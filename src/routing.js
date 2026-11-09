import config from '../site.config.json' with { type: 'json' };

export const primaryDomain = config.primaryDomain;
export const siteOrigin = `https://${primaryDomain}`;
export const aliases = config.domains.filter(domain => domain !== primaryDomain);
export const redirectStatus = 302;

const aliasesByHost = new Map(aliases.flatMap(domain => [[domain, domain], [`www.${domain}`, domain]]));

export function domainUrl(domain) {
  const target = new URL('/', siteOrigin);
  target.searchParams.set('domain', domain);
  return target.href;
}

export function redirectLocation(url) {
  if (url.hostname === `www.${primaryDomain}` ||
      (url.hostname === primaryDomain && url.protocol === 'http:')) {
    const target = new URL(siteOrigin);
    target.pathname = url.pathname;
    target.search = url.search;
    return target.href;
  }

  const domain = aliasesByHost.get(url.hostname);
  return domain ? domainUrl(domain) : null;
}
