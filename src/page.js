    (() => {
      const translations = {
        zh: {
          title: '域名出售', language: '显示语言', email: '邮件联系',
          intro: '为你的品牌、产品或个人项目，挑一个好记的网络地址。', browse: '浏览在售域名',
          featured: '精选域名', inquire: 'WhatsApp 询价', emailInquiry: '邮件询价', inventory: '在售域名',
          hint: '选择域名，通过 WhatsApp 询价。',
          count: n => `共 ${n} 个`, subject: '域名询价',
          message: name => `您好，我想购买域名 ${name}，请问还在出售吗？`
        },
        en: {
          title: 'Domains for sale', language: 'Display language', email: 'Email',
          intro: 'Find a memorable web address for your brand, product, or next project.', browse: 'Browse domains',
          featured: 'Featured domain', inquire: 'Ask on WhatsApp', emailInquiry: 'Ask by email', inventory: 'Available domains',
          hint: 'Select a domain to inquire on WhatsApp.',
          count: n => `${n} domains`, subject: 'Domain inquiry',
          message: name => `Hello, I am interested in purchasing ${name}. Is it still available?`
        },
        es: {
          title: 'Dominios en venta', language: 'Idioma de la página', email: 'Correo',
          intro: 'Encuentra una dirección web fácil de recordar para tu marca, producto o próximo proyecto.', browse: 'Ver dominios',
          featured: 'Dominio destacado', inquire: 'Consultar por WhatsApp', emailInquiry: 'Consultar por correo', inventory: 'Dominios disponibles',
          hint: 'Selecciona un dominio para consultar por WhatsApp.',
          count: n => `${n} dominios`, subject: 'Consulta de dominio',
          message: name => `Hola, me interesa comprar ${name}. ¿Sigue disponible?`
        },
        fr: {
          title: 'Domaines à vendre', language: 'Langue de la page', email: 'E-mail',
          intro: 'Trouvez une adresse web facile à retenir pour votre marque, votre produit ou votre prochain projet.', browse: 'Voir les domaines',
          featured: 'Domaine à la une', inquire: 'Demander sur WhatsApp', emailInquiry: 'Demander par e-mail', inventory: 'Domaines disponibles',
          hint: 'Choisissez un domaine pour nous contacter sur WhatsApp.',
          count: n => `${n} domaines`, subject: 'Demande de domaine',
          message: name => `Bonjour, je souhaite acheter ${name}. Est-il disponible ?`
        },
        de: {
          title: 'Domains zum Verkauf', language: 'Seitensprache', email: 'E-Mail',
          intro: 'Finden Sie eine einprägsame Webadresse für Ihre Marke, Ihr Produkt oder Ihr nächstes Projekt.', browse: 'Domains ansehen',
          featured: 'Domain im Fokus', inquire: 'Per WhatsApp anfragen', emailInquiry: 'Per E-Mail anfragen', inventory: 'Verfügbare Domains',
          hint: 'Wählen Sie eine Domain für Ihre Anfrage per WhatsApp.',
          count: n => `${n} Domains`, subject: 'Domainanfrage',
          message: name => `Hallo, ich interessiere mich für ${name}. Ist die Domain noch verfügbar?`
        },
        pt: {
          title: 'Domínios à venda', language: 'Idioma da página', email: 'E-mail',
          intro: 'Encontre um endereço fácil de lembrar para sua marca, produto ou próximo projeto.', browse: 'Ver domínios',
          featured: 'Domínio em destaque', inquire: 'Consultar via WhatsApp', emailInquiry: 'Consultar por e-mail', inventory: 'Domínios disponíveis',
          hint: 'Selecione um domínio para consultar via WhatsApp.',
          count: n => `${n} domínios`, subject: 'Consulta de domínio',
          message: name => `Olá, tenho interesse em comprar ${name}. Ainda está disponível?`
        },
        ja: {
          title: 'ドメイン販売中', language: '表示言語', email: 'メール',
          intro: 'ブランドや商品、次のプロジェクトに、覚えやすいウェブアドレスを。', browse: '販売中のドメインを見る',
          featured: '注目のドメイン', inquire: 'WhatsApp で問い合わせ', emailInquiry: 'メールで問い合わせ', inventory: '販売中のドメイン',
          hint: 'ドメインを選ぶと WhatsApp で問い合わせできます。',
          count: n => `${n} 件`, subject: 'ドメインのお問い合わせ',
          message: name => `こんにちは。${name} の購入を検討しています。まだ販売中でしょうか？`
        },
        ar: {
          title: 'نطاقات للبيع', language: 'لغة العرض', email: 'البريد الإلكتروني',
          intro: 'اعثر على عنوان ويب سهل التذكر لعلامتك التجارية أو منتجك أو مشروعك القادم.', browse: 'تصفح النطاقات',
          featured: 'نطاق مميز', inquire: 'استفسر عبر واتساب', emailInquiry: 'استفسر عبر البريد', inventory: 'النطاقات المتاحة',
          hint: 'اختر نطاقًا للاستفسار عنه عبر واتساب.',
          count: n => `${n} نطاقات`, subject: 'استفسار عن نطاق',
          message: name => `مرحباً، أرغب في شراء النطاق ${name}. هل ما زال متاحاً؟`
        }
      };

      const language = document.getElementById('language');
      const feature = document.querySelector('[data-feature]');
      const featureName = feature.querySelector('.feature-name');
      const primary = feature.dataset.feature;
      const cards = [...document.querySelectorAll('.domain-card')];
      const contactLinks = document.querySelectorAll('[data-contact]');
      const headerEmail = document.querySelector('.header-email');
      const { whatsapp, email } = document.body.dataset;
      const requested = new URLSearchParams(location.search).get('domain')?.trim().toLowerCase();
      const requestedCard = cards.find(card => card.dataset.domain === requested);
      const requestedDomain = requestedCard || requested === primary ? requested : undefined;
      const selected = requestedDomain || primary;

      if (requestedCard) {
        // Promote the requested domain and put the default featured domain in the list.
        requestedCard.dataset.domain = primary;
        requestedCard.querySelector('.domain-name').textContent = primary;
        requestedCard.querySelector('.domain-tld').textContent = primary.slice(primary.lastIndexOf('.'));
        requestedCard.parentElement.parentElement.append(requestedCard.parentElement);

        const dot = selected.lastIndexOf('.');
        feature.dataset.feature = selected;
        feature.querySelector('.feature-stem').textContent = selected.slice(0, dot);
        feature.querySelector('.suffix').textContent = selected.slice(dot);
      }
      featureName.classList.toggle('is-long', selected.length > 9);

      function setLanguage() {
        const t = translations[language.value];
        document.documentElement.lang = language.value === 'zh' ? 'zh-CN' : language.value;
        document.documentElement.dir = language.value === 'ar' ? 'rtl' : 'ltr';
        document.title = `${selected}｜${t.title}`;
        document.querySelectorAll('[data-copy]').forEach(element => {
          element.textContent = t[element.dataset.copy];
        });
        document.getElementById('count').textContent = t.count(cards.length + 1);
        headerEmail.setAttribute('aria-label', t.email);

        for (const link of contactLinks) {
          const domain = link.dataset.domain || (feature.contains(link) ? selected : requestedDomain);
          const message = domain ? encodeURIComponent(t.message(domain)) : '';
          if (link.dataset.contact === 'email') {
            const subject = domain ? `${t.subject}: ${domain}` : t.subject;
            const body = message ? `&body=${message}` : '';
            link.href = `mailto:${email}?subject=${encodeURIComponent(subject)}${body}`;
          } else {
            link.href = message ? `${whatsapp}?text=${message}` : whatsapp;
          }
        }
      }

      language.addEventListener('change', setLanguage);
      setLanguage();
    })();
