(function () {
  'use strict';

  const STORAGE_KEY = 'getcaffe_lang';
  const norm = (s) => s.replace(/\s+/g, ' ').trim();

  const TEXT = {
    'Get café & Lounge Bar — Скопје | Аеродром & Кисела Вода':
      'Get café & Lounge Bar — Skopje | Aerodrom & Kisela Voda',
    'Прескокни кон содржината': 'Skip to content',

    'Почетна': 'Home',
    'За нас': 'About',
    'Локации': 'Locations',
    'Контакт': 'Contact',
    'Мени': 'Menu',
    'Резервирај маса': 'Book a table',

    'Скопје · Аеродром & Кисела Вода': 'Skopje · Aerodrom & Kisela Voda',
    'Каде што секоја шолја': 'Where every cup',
    'има своја приказна': 'has a story',
    'Топла светлина, темно дрво и мирис на свежо печено кафе. Get café е местото каде утринското еспресо преминува во вечерен коктел — без брзање, со стил.':
      'Warm light, dark wood and the smell of freshly roasted coffee. Get café is where the morning espresso turns into an evening cocktail — unhurried, with style.',
    'Разгледај го менито': 'Browse the menu',
    'Скролај': 'Scroll',

    'Specialty кафе': 'Specialty coffee',
    'Signature коктели': 'Signature cocktails',
    'Домашни десерти': 'Homemade desserts',
    'Тераса & бавча': 'Terrace & garden',
    'Две локации во Скопје': 'Two locations in Skopje',

    'локации': 'locations',
    'во Скопје': 'in Skopje',
    'Нашата приказна': 'Our story',
    'Кафуле кое стана': 'A café that became',
    'навика на градот': "the city's habit",
    'Get café го отвори првиот кат на': 'Get café opened its first floor in',
    'Аеродром': 'Aerodrom',
    'со едноставна замисла — да создаде простор кој се чувствува како дневна соба, но служи како најдобриот бар во соседството. Годините донесоа втор дом на':
      'with one simple idea — to create a space that feels like a living room but serves like the best bar in the neighbourhood. The years brought a second home in',
    'Кисела Вода': 'Kisela Voda',
    ', но филозофијата остана иста: добро зрно, вистинска мера и луѓе кои те паметат по име.':
      ', but the philosophy stayed the same: a good bean, the right measure, and people who remember your name.',
    'Наутро мирисот на свежо мелено кафе и топли кроасани. Попладне — тивок агол за состанок или книга. Навечер, светлата се придушуваат, музиката добива тежина, а барот оживува со signature коктели миксани пред тебе.':
      'Mornings smell of freshly ground coffee and warm croissants. Afternoons offer a quiet corner for a meeting or a book. In the evening the lights dim, the music gains weight, and the bar comes alive with signature cocktails mixed in front of you.',
    'Првото еспресо': 'First espresso',
    'Последниот коктел': 'Last cocktail',
    'Свежо & домашно': 'Fresh & homemade',
    'Резервирај ја твојата маса': 'Book your table',

    'Не продаваме само кафе. Продаваме половина час во кој никој нема да те брза.':
      "We don't just sell coffee. We sell half an hour in which nobody will rush you.",
    '— Тимот на Get café': '— The Get café team',

    'Резервација': 'Reservation',
    'Твојата маса': 'Your table',
    'те чека': 'is waiting',
    'Четири кратки чекори. Ќе те контактираме за потврда во рок од 30 минути во работно време.':
      'Four short steps. We will contact you to confirm within 30 minutes during working hours.',
    'Локал': 'Venue',
    'Термин': 'Time',
    'Повод': 'Occasion',
    'Избери локал': 'Choose a venue',
    'Каде сакаш да те пречекаме?': 'Where would you like us to welcome you?',
    'Get café — Аеродром': 'Get café — Aerodrom',
    '23 Октомври, Скопје · +389 2 240 0501': '23 Oktomvri, Skopje · +389 2 240 0501',
    'Get café — Кисела Вода': 'Get café — Kisela Voda',
    'Христо Татарчев 47б, Скопје · +389 2 277 7457': 'Hristo Tatarcev 47b, Skopje · +389 2 277 7457',
    'Датум и час': 'Date and time',
    'Резервации се прифаќаат до 60 дена однапред.': 'Reservations are accepted up to 60 days in advance.',
    'Датум': 'Date',
    'Број на лица': 'Number of guests',
    'За групи над 15 лица јави се директно.': 'For groups over 15, please call us directly.',
    'Временски термин': 'Time slot',
    'Повод и амбиент': 'Occasion and setting',
    'Ќе го подготвиме просторот според приликата.': 'We will prepare the space to suit the occasion.',
    'Избери повод…': 'Choose an occasion…',
    'Роденден': 'Birthday',
    'Бизнис средба': 'Business meeting',
    'Романтична вечера': 'Romantic dinner',
    'Дружење / Собиранка': 'Get-together',
    'Друго': 'Other',
    'Опиши го поводот': 'Describe the occasion',
    'Каде сакате да седите?': 'Where would you like to sit?',
    'Внатре': 'Inside',
    'Топол ентериер, придушени светла': 'Warm interior, dimmed lights',
    'Надвор': 'Outside',
    'Тераса / бавча, отворено небо': 'Terrace / garden, open sky',
    'Посебни барања': 'Special requests',
    '(опционално)': '(optional)',
    'Твоите податоци': 'Your details',
    'Само за потврда на резервацијата — ништо повеќе.': 'Only to confirm your reservation — nothing more.',
    'Име и презиме': 'Full name',
    'Телефонски број': 'Phone number',
    'Е-пошта': 'Email',
    'Се согласувам моите податоци да се користат исклучиво за обработка на оваа резервација.':
      'I agree that my details may be used solely to process this reservation.',
    'Политика за приватност': 'Privacy policy',
    'Преглед на резервацијата': 'Reservation summary',
    'Час': 'Time',
    'Лица': 'Guests',
    'Место': 'Seating',
    '← Назад': '← Back',
    'Продолжи →': 'Continue →',
    'Испрати резервација': 'Send reservation',

    'Два дома,': 'Two homes,',
    'иста топлина': 'the same warmth',
    'Локација 01': 'Location 01',
    'Локација 02': 'Location 02',
    'Адреса': 'Address',
    'ул. 23 Октомври, Аеродром': '23 Oktomvri St., Aerodrom',
    '1000 Скопје': '1000 Skopje',
    'ул. Христо Татарчев 47б': 'Hristo Tatarcev St. 47b',
    'Кисела Вода, 1000 Скопје': 'Kisela Voda, 1000 Skopje',
    'Телефон': 'Phone',
    'Работно време': 'Opening hours',
    'Пон – Чет': 'Mon – Thu',
    'Пет – Саб': 'Fri – Sat',
    'Недела': 'Sunday',
    'Резервирај тука': 'Book here',
    'Отвори во Google Maps': 'Open in Google Maps',
    'Работното време може да варира за празници и приватни настани. За сигурност, јави се пред доаѓање.':
      'Opening hours may vary on holidays and during private events. To be sure, call before you come.',

    'Слободно': 'Feel free',
    'јави се': 'to call',
    'Прашање за менито, голема прослава или соработка? Пиши ни или ѕвони — одговараме брзо.':
      'A question about the menu, a big celebration or a collaboration? Write or call — we reply fast.',
    'Име': 'Name',
    'Порака': 'Message',
    'Испрати порака': 'Send message',

    'Кафуле и ланџ бар во срцето на Скопје. Две локации, едно чувство —':
      'A café and lounge bar in the heart of Skopje. Two locations, one feeling —',
    'дома, но со подобро кафе.': 'like home, but with better coffee.',
    'Мени ↗': 'Menu ↗',
    'Аеродром · 23 Октомври': 'Aerodrom · 23 Oktomvri',
    'Кисела Вода · Х. Татарчев 47б': 'Kisela Voda · H. Tatarcev 47b',
    'Приватност': 'Privacy',
    'Поставки за колачиња': 'Cookie settings',
    'Дигитално мени ↗': 'Digital menu ↗',
    'Get café & Lounge Bar. Сите права задржани.': 'Get café & Lounge Bar. All rights reserved.',
    'Изработено со внимание кон детали.': 'Made with attention to detail.',

    'Резервацијата е забележана!': 'Reservation recorded!',
    'Твојата резервација е запишана во системот. На дадениот број ќе ти пристигне порака со потврда на резервацијата.':
      'Your reservation has been recorded in our system. A confirmation message will arrive on the number you provided.',
    'Одлично': 'Great',
    'Види го менито': 'View the menu',

    'Ние користиме колачиња 🍪': 'We use cookies 🍪',
    'Користиме колачиња за да ја подобриме твојата посета, да ја анализираме посетеноста и да прикажеме содржини од трети страни (како Google Maps). Ти избираш што дозволуваш.':
      'We use cookies to improve your visit, analyse traffic and show third-party content (such as Google Maps). You choose what you allow.',
    'Поставки': 'Settings',
    'Одбиј': 'Decline',
    'Прифати ги сите': 'Accept all',
    'Избери кои категории колачиња дозволуваш. Изборот се памети на овој уред и може да го промениш во секое време преку линкот во подножјето.':
      'Choose which cookie categories you allow. Your choice is remembered on this device and can be changed at any time via the link in the footer.',
    'Неопходни': 'Essential',
    'Секогаш активни': 'Always on',
    'Овозможуваат основно функционирање — навигација, форми и безбедност. Без нив сајтот не работи.':
      'They enable core functionality — navigation, forms and security. The site does not work without them.',
    'Аналитика': 'Analytics',
    'Ни помагаат да разбереме кои делови од сајтот се најкорисни, преку анонимна статистика.':
      'They help us understand which parts of the site are most useful, through anonymous statistics.',
    'Маркетинг': 'Marketing',
    'Се користат за прикажување релевантни понуди и мерење на успешноста на кампањите.':
      'Used to show relevant offers and measure campaign performance.',
    'Одбиј ги сите': 'Decline all',
    'Зачувај избор': 'Save choice'
  };

  const ATTR = {
    'Get café & Lounge Bar — топло кафуле и ланџ бар во Скопје со две локации: Аеродром и Кисела Вода. Врвно кафе, signature коктели, закуски и резервација на маса онлајн.':
      'Get café & Lounge Bar — a warm café and lounge bar in Skopje with two locations: Aerodrom and Kisela Voda. Great coffee, signature cocktails, small plates and online table booking.',
    'Get café, кафуле Скопје, ланџ бар, Аеродром, Кисела Вода, коктели, резервација маса':
      'Get café, Skopje café, lounge bar, Aerodrom, Kisela Voda, cocktails, table booking',
    'Get café & Lounge Bar — Скопје': 'Get café & Lounge Bar — Skopje',
    'Каде секоја шолја има приказна. Две локации во Скопје — Аеродром и Кисела Вода.':
      'Where every cup has a story. Two locations in Skopje — Aerodrom and Kisela Voda.',
    'Get café & Lounge Bar — почетна': 'Get café & Lounge Bar — home',
    'Главна навигација': 'Main navigation',
    'Отвори мени': 'Open menu',
    'Затвори мени': 'Close menu',
    'Слајдови': 'Slides',
    'Скролај надолу': 'Scroll down',
    'Чекори на резервација': 'Reservation steps',
    'Намали': 'Decrease',
    'Зголеми': 'Increase',
    'Термин': 'Time slot',
    'Затвори': 'Close',
    'Согласност за колачиња': 'Cookie consent',
    'Назад на врв': 'Back to top',
    'Дигитално мени': 'Digital menu',
    'Јазик / Language': 'Language / Јазик',
    'на пр. годишнина, прослава на дипломирање…': 'e.g. anniversary, graduation party…',
    'Алергии, торта за роденден, детско столче, омилен агол…':
      'Allergies, birthday cake, high chair, favourite corner…',
    'на пр. Ана Стојановска': 'e.g. Ana Stojanovska',
    '07X XXX XXX': '07X XXX XXX',
    'Твоето име': 'Your name',
    'Како можеме да помогнеме?': 'How can we help?',
    'Мапа — Get café Аеродром': 'Map — Get café Aerodrom',
    'Мапа — Get café Кисела Вода': 'Map — Get café Kisela Voda'
  };

  const UI = {
    mk: {
      days:   ['недела','понеделник','вторник','среда','четврток','петок','сабота'],
      months: ['јануари','февруари','март','април','мај','јуни','јули','август','септември','октомври','ноември','декември'],
      dateFmt: (d, mo, y, day) => `${day}, ${d} ${mo} ${y}`,

      required:    'Ова поле е задолжително.',
      nameShort:   'Внеси го твоето име (најмалку 2 букви).',
      nameSimple:  'Внеси го твоето име.',
      phoneBad:    'Внеси валиден телефонски број (на пр. 070 123 456).',
      emailCheck:  'Провери ја е-поштата.',
      emailBad:    'Внеси валидна е-пошта.',
      msgShort:    'Пораката е прекратка (најмалку 10 знаци).',
      pickVenue:   'Избери еден од локалите.',
      pickDate:    'Избери датум.',
      pickTime:    'Избери временски термин.',
      pickOccasion:'Избери повод.',
      pickSeating: 'Избери внатре или надвор.',
      needConsent: 'Потребна е согласност за да продолжиме.',

      step:     (n, t) => `Чекор ${n} од ${t}`,
      guests:   (n) => (Number(n) === 1 ? '1 лице' : `${n} лица`),
      sending:  'Се испраќа…',
      sendBooking: 'Испрати резервација',
      sendMessage: 'Испрати порака',
      sent:     '✓ Пораката е испратена. Ти благодариме!',
      slide:    (n) => `Слајд ${n}`,
      openMenu: 'Отвори мени',
      closeMenu:'Затвори мени',

      venue:   { 'aerodrom': 'Get café — Аеродром', 'kisela-voda': 'Get café — Кисела Вода' },
      seating: { 'inside': 'Внатре', 'outside': 'Надвор (Тераса / Бавча)' },
      occasion:{ birthday:'Роденден', business:'Бизнис средба', romantic:'Романтична вечера',
                 gathering:'Дружење / Собиранка', other:'Друго' },
      rows: { venue:'Локал', date:'Датум', time:'Час', guests:'Лица', occasion:'Повод',
              seating:'Место', name:'На име', phone:'Телефон', note:'Забелешка' }
    },

    en: {
      days:   ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
      months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
      dateFmt: (d, mo, y, day) => `${day}, ${d} ${mo} ${y}`,

      required:    'This field is required.',
      nameShort:   'Enter your name (at least 2 letters).',
      nameSimple:  'Enter your name.',
      phoneBad:    'Enter a valid phone number (e.g. 070 123 456).',
      emailCheck:  'Please check the email address.',
      emailBad:    'Enter a valid email address.',
      msgShort:    'The message is too short (at least 10 characters).',
      pickVenue:   'Choose one of the venues.',
      pickDate:    'Choose a date.',
      pickTime:    'Choose a time slot.',
      pickOccasion:'Choose an occasion.',
      pickSeating: 'Choose inside or outside.',
      needConsent: 'We need your consent to continue.',

      step:     (n, t) => `Step ${n} of ${t}`,
      guests:   (n) => (Number(n) === 1 ? '1 guest' : `${n} guests`),
      sending:  'Sending…',
      sendBooking: 'Send reservation',
      sendMessage: 'Send message',
      sent:     '✓ Message sent. Thank you!',
      slide:    (n) => `Slide ${n}`,
      openMenu: 'Open menu',
      closeMenu:'Close menu',

      venue:   { 'aerodrom': 'Get café — Aerodrom', 'kisela-voda': 'Get café — Kisela Voda' },
      seating: { 'inside': 'Inside', 'outside': 'Outside (Terrace / Garden)' },
      occasion:{ birthday:'Birthday', business:'Business meeting', romantic:'Romantic dinner',
                 gathering:'Get-together', other:'Other' },
      rows: { venue:'Venue', date:'Date', time:'Time', guests:'Guests', occasion:'Occasion',
              seating:'Seating', name:'Name', phone:'Phone', note:'Note' }
    }
  };

  const originals = new Map();
  let nodeCache = null;
  let attrCache = null;

  function collectNodes() {
    if (nodeCache) return nodeCache;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const tag = node.parentNode && node.parentNode.nodeName;
        if (tag === 'SCRIPT' || tag === 'STYLE') return NodeFilter.FILTER_REJECT;
        return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    nodeCache = [];
    let n;
    while ((n = walker.nextNode())) nodeCache.push(n);
    return nodeCache;
  }

  function collectAttrs() {
    if (attrCache) return attrCache;
    attrCache = [];
    const names = ['placeholder', 'aria-label', 'title', 'alt'];
    document.querySelectorAll('[placeholder],[aria-label],[title],[alt]').forEach((el) => {
      names.forEach((name) => {
        const v = el.getAttribute(name);
        if (v && norm(v) in ATTR) attrCache.push({ el, name, mk: v });
      });
    });
    document.querySelectorAll('meta[content]').forEach((el) => {
      const v = el.getAttribute('content');
      if (v && norm(v) in ATTR) attrCache.push({ el, name: 'content', mk: v });
    });
    return attrCache;
  }

  const I18N = {
    lang: 'mk',

    t(key, ...args) {
      const pack = UI[this.lang] || UI.mk;
      const val = pack[key];
      return typeof val === 'function' ? val(...args) : val;
    },

    label(group, key) {
      const pack = UI[this.lang] || UI.mk;
      return (pack[group] && pack[group][key]) || key;
    },

    formatDate(iso) {
      if (!iso) return '—';
      const [y, m, d] = iso.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      if (isNaN(date)) return iso;
      const pack = UI[this.lang] || UI.mk;
      return pack.dateFmt(d, pack.months[m - 1], y, pack.days[date.getDay()]);
    },

    set(lang, opts) {
      lang = lang === 'en' ? 'en' : 'mk';
      this.lang = lang;

      collectNodes().forEach((node) => {
        if (!originals.has(node)) originals.set(node, node.nodeValue);
        const mk = originals.get(node);
        if (lang === 'mk') { node.nodeValue = mk; return; }
        const hit = TEXT[norm(mk)];
        if (!hit) return;

        const lead  = mk.match(/^\s*/)[0];
        const trail = mk.match(/\s*$/)[0];
        node.nodeValue = lead + hit + trail;
      });

      collectAttrs().forEach(({ el, name, mk }) => {
        el.setAttribute(name, lang === 'mk' ? mk : (ATTR[norm(mk)] || mk));
      });

      if (!this._titleMk) this._titleMk = document.title;
      document.title = lang === 'mk'
        ? this._titleMk
        : (TEXT[norm(this._titleMk)] || this._titleMk);

      document.documentElement.lang = lang;
      const og = document.querySelector('meta[property="og:locale"]');
      if (og) og.setAttribute('content', lang === 'en' ? 'en_GB' : 'mk_MK');

      document.querySelectorAll('.lang__btn').forEach((b) => {
        const on = b.getAttribute('data-lang') === lang;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });

      try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {  }

      if (!opts || opts.notify !== false) {
        document.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
      }
    },

    init() {
      let saved = null;
      try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {  }

      const start = saved || (/^en\b/i.test(navigator.language || '') ? 'en' : 'mk');

      document.querySelectorAll('.lang__btn').forEach((btn) => {
        btn.addEventListener('click', () => this.set(btn.getAttribute('data-lang')));
      });

      this.set(start, { notify: false });
    }
  };

  window.I18N = I18N;
})();
