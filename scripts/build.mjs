import { mkdir, readFile, writeFile } from 'node:fs/promises';
import config from '../site.config.json' with { type: 'json' };
import { aliases, domainUrl, primaryDomain, redirectStatus, siteOrigin } from '../src/routing.js';

const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const write = (path, contents) => writeFile(new URL(path, root), contents, 'utf8');
const domainPattern = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/;
const domains = new Set(config.domains);
const phone = config.whatsapp.replaceAll(' ', '');

if (!domains.has(primaryDomain) || domains.size !== config.domains.length ||
    [...domains].some(domain => domain.length > 253 || !domainPattern.test(domain))) {
  throw new Error('Use unique lowercase hostnames in domains and include primaryDomain.');
}
if (!/^\+[1-9]\d{7,14}$/.test(phone) || !/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(config.email)) {
  throw new Error('Use an international WhatsApp number and a valid contact email.');
}

const whatsapp = `https://wa.me/${phone.slice(1)}`;
const mailto = `mailto:${config.email}`;
const message = domain => encodeURIComponent(`您好，我想购买域名 ${domain}，请问还在出售吗？`);
const inquire = domain => `${whatsapp}?text=${message(domain)}`;
const dot = primaryDomain.lastIndexOf('.');
const [template, css, script] = await Promise.all(['src/page.html', 'src/styles.css', 'src/page.js'].map(read));

const cards = aliases.map(domain => `        <li>
          <a class="domain-card" data-contact="whatsapp" data-domain="${domain}" href="${inquire(domain)}" target="_blank" rel="noopener noreferrer">
            <span class="domain-name" dir="ltr">${domain}</span>
            <span class="domain-tld" dir="ltr" aria-hidden="true">${domain.slice(domain.lastIndexOf('.'))}</span>
            <span class="card-icon" aria-hidden="true"><svg class="icon"><use href="#i-arrow"/></svg></span>
            <span class="visually-hidden" data-copy="inquire">WhatsApp 询价</span>
          </a>
        </li>`).join('\n');

const values = {
  SITE_ORIGIN: siteOrigin,
  PRIMARY_DOMAIN: primaryDomain,
  FEATURE_NAME: primaryDomain.slice(0, dot),
  FEATURE_TLD: primaryDomain.slice(dot),
  COUNT: domains.size,
  WHATSAPP: whatsapp,
  PHONE_DISPLAY: config.whatsapp,
  EMAIL: config.email,
  FEATURE_WHATSAPP: inquire(primaryDomain),
  FEATURE_EMAIL: `${mailto}?subject=${encodeURIComponent(`域名询价: ${primaryDomain}`)}&amp;body=${message(primaryDomain)}`,
  CARDS: cards,
  CSS: css.trimEnd(),
  SCRIPT: script.trimEnd(),
};

const html = template.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
  if (!Object.hasOwn(values, key)) throw new Error(`Unknown template placeholder ${key}`);
  return values[key];
});

const redirects = aliases.flatMap(domain => [domain, `www.${domain}`].map(host =>
  `${host}/,${domainUrl(domain)},${redirectStatus},FALSE,FALSE,TRUE,FALSE`
));
redirects.push(`www.${primaryDomain}/,${siteOrigin}/,${redirectStatus},TRUE,FALSE,TRUE,TRUE`);

await Promise.all(['dist/', 'build/'].map(path => mkdir(new URL(path, root), { recursive: true })));
await Promise.all([write('dist/index.html', html), write('build/cloudflare-redirects.csv', `${redirects.join('\n')}\n`)]);
console.log(`Built ${domains.size} domain listings and ${redirects.length} redirect rules.`);
