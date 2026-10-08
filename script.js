(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

  const T = (key, ...args) => (window.I18N ? window.I18N.t(key, ...args) : '');
  const L = (group, key) => (window.I18N ? window.I18N.label(group, key) : key);
  const fmtDate = (iso) => (window.I18N ? window.I18N.formatDate(iso) : iso);

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isTouch = () => window.matchMedia('(hover: none)').matches;

  function rafThrottle(fn) {
    let ticking = false;
    return function (...args) {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { fn.apply(this, args); ticking = false; });
    };
  }

  const storage = {
    get(key) {
      try { return window.localStorage.getItem(key); } catch (e) { return null; }
    },
    set(key, val) {
      try { window.localStorage.setItem(key, val); return true; } catch (e) { return false; }
    },
    remove(key) {
      try { window.localStorage.removeItem(key); } catch (e) {  }
    }
  };

  const toISODate = (date) => {
    const p = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
  };

  const Backgrounds = {
    init() {
      const nodes = $$('[data-bg]');
      if (!nodes.length) return;

      if (!('IntersectionObserver' in window)) {
        nodes.forEach(this.load);
        return;
      }

      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          this.load(entry.target);
          obs.unobserve(entry.target);
        });
      }, { rootMargin: '300px 0px' });

      nodes.forEach((n) => io.observe(n));
    },

    load(el) {
      const url = el.getAttribute('data-bg');
      if (!url || el.dataset.bgLoaded) return;
      el.dataset.bgLoaded = '1';

      const img = new Image();
      img.onload = () => {
        el.style.setProperty('--photo', `url("${url}")`);
        el.classList.add('bg-ready');
      };

      img.onerror = () => { el.dataset.bgFailed = '1'; };
      img.src = url;
    }
  };

  const Header = {
    init() {
      this.header = $('#header');
      this.nav    = $('#nav');
      this.toggle = $('#navToggle');
      if (!this.header) return;

      this.links    = $$('.nav__link');
      this.sections = this.links
        .map((a) => $(a.getAttribute('href')))
        .filter(Boolean);

      on(window, 'scroll', rafThrottle(() => this.onScroll()), { passive: true });
      this.onScroll();

      this.bindMobileNav();
    },

    onScroll() {
      this.header.classList.toggle('is-stuck', window.scrollY > 40);
      this.spy();
    },

    spy() {
      const line = window.scrollY + window.innerHeight * 0.32;
      let current = null;

      this.sections.forEach((sec) => {
        if (sec.offsetTop <= line) current = sec.id;
      });

      this.links.forEach((a) => {
        a.classList.toggle('is-current', a.getAttribute('href') === `#${current}`);
      });
    },

    bindMobileNav() {
      if (!this.toggle || !this.nav) return;

      const close = () => {
        this.nav.classList.remove('is-open');
        this.toggle.setAttribute('aria-expanded', 'false');
        this.toggle.setAttribute('aria-label', T('openMenu'));
        document.body.classList.remove('is-locked');
      };

      on(this.toggle, 'click', () => {
        const open = this.nav.classList.toggle('is-open');
        this.toggle.setAttribute('aria-expanded', String(open));
        this.toggle.setAttribute('aria-label', open ? T('closeMenu') : T('openMenu'));
        document.body.classList.toggle('is-locked', open);
      });

      $$('a', this.nav).forEach((a) => on(a, 'click', close));
      on(document, 'keydown', (e) => {
        if (e.key === 'Escape' && this.nav.classList.contains('is-open')) close();
      });

      on(window, 'resize', () => {
        if (window.innerWidth > 1050) close();
      });
    }
  };

  const HeroSlider = {
    INTERVAL: 6500,

    init() {
      this.wrap   = $('#heroSlides');
      this.dotsEl = $('#heroDots');
      if (!this.wrap) return;

      this.slides = $$('.hero__slide', this.wrap);
      if (this.slides.length < 2) return;

      this.index = 0;
      this.buildDots();
      this.start();

      on(document, 'visibilitychange', () => {
        document.hidden ? this.stop() : this.start();
      });
    },

    buildDots() {
      if (!this.dotsEl) return;
      this.slides.forEach((_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'hero__dot' + (i === 0 ? ' is-active' : '');
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-label', T('slide', i + 1));
        b.setAttribute('aria-selected', String(i === 0));
        on(b, 'click', () => { this.goTo(i); this.start(); });
        this.dotsEl.appendChild(b);
      });
      this.dots = $$('.hero__dot', this.dotsEl);
    },

    goTo(i) {
      this.index = (i + this.slides.length) % this.slides.length;
      this.slides.forEach((s, n) => s.classList.toggle('is-active', n === this.index));
      (this.dots || []).forEach((d, n) => {
        d.classList.toggle('is-active', n === this.index);
        d.setAttribute('aria-selected', String(n === this.index));
      });
    },

    start() {
      this.stop();
      if (prefersReducedMotion()) return;
      this.timer = setInterval(() => this.goTo(this.index + 1), this.INTERVAL);
    },

    stop() { clearInterval(this.timer); }
  };

  const Reveal = {
    init() {
      const nodes = $$('[data-reveal]');
      if (!nodes.length) return;

      if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
        nodes.forEach((n) => n.classList.add('is-visible'));
        return;
      }

      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const delay = entry.target.getAttribute('data-reveal-delay') || 0;
          entry.target.style.setProperty('--d', `${delay}ms`);
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

      nodes.forEach((n) => io.observe(n));
    }
  };

  const Motion = {
    init() {
      if (prefersReducedMotion()) return;
      this.parallax();
      if (!isTouch()) this.tilt();
    },

    parallax() {
      const content = $('.hero__content');
      const hero    = $('.hero');
      if (!content || !hero) return;

      on(window, 'scroll', rafThrottle(() => {
        const y = window.scrollY;
        if (y > hero.offsetHeight) return;
        content.style.transform  = `translate3d(0, ${y * 0.18}px, 0)`;
        content.style.opacity    = String(Math.max(0, 1 - y / (hero.offsetHeight * 0.72)));
      }), { passive: true });
    },

    tilt() {
      $$('[data-tilt]').forEach((card) => {
        const MAX = 5;

        const move = (e) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width  - 0.5;
          const py = (e.clientY - r.top)  / r.height - 0.5;
          card.style.transform =
            `perspective(900px) rotateX(${-py * MAX}deg) rotateY(${px * MAX}deg) translateY(-6px)`;
        };
        const reset = () => { card.style.transform = ''; };

        on(card, 'mousemove', rafThrottle(move));
        on(card, 'mouseleave', reset);
      });
    }
  };

  const Modal = {
    active: null,
    lastFocus: null,

    init() {
      $$('[data-close-modal]').forEach((btn) =>
        on(btn, 'click', () => this.close())
      );
      on(document, 'keydown', (e) => {
        if (!this.active) return;
        if (e.key === 'Escape') this.close();
        if (e.key === 'Tab') this.trap(e);
      });
    },

    open(id) {
      const el = $(`#${id}`);
      if (!el) return;

      this.lastFocus = document.activeElement;
      el.hidden = false;
      document.body.classList.add('is-locked');
      this.active = el;

      const focusable = this.focusables(el);
      if (focusable.length) focusable[0].focus();
    },

    close() {
      if (!this.active) return;
      this.active.hidden = true;
      this.active = null;
      document.body.classList.remove('is-locked');
      if (this.lastFocus && this.lastFocus.focus) this.lastFocus.focus();
    },

    focusables(el) {
      return $$(
        'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
        el
      ).filter((n) => n.offsetParent !== null);
    },

    trap(e) {
      const items = this.focusables(this.active);
      if (!items.length) return;
      const first = items[0];
      const last  = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  };

  const Validate = {
    RULES: {
      name:  { test: (v) => v.trim().length >= 2,  msg: 'nameShort' },
      cName: { test: (v) => v.trim().length >= 2,  msg: 'nameSimple' },
      phone: {
        test: (v) => /^[+()\d\s-]{6,20}$/.test(v.trim()) && (v.replace(/\D/g, '').length >= 6),
        msg: 'phoneBad'
      },
      email:  { test: (v) => v.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
                msg: 'emailCheck' },
      cEmail: { test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
                msg: 'emailBad' },
      cMsg:   { test: (v) => v.trim().length >= 10, msg: 'msgShort' }
    },

    setError(form, fieldName, msg) {
      const box = $(`[data-error-for="${fieldName}"]`, form);
      const input = form.elements[fieldName];

      if (box) {
        box.textContent = msg || '';
        box.classList.toggle('is-shown', Boolean(msg));
      }
      if (input && input.classList) {
        input.classList.toggle('is-invalid', Boolean(msg));
      }
      return !msg;
    },

    field(form, name) {
      const el = form.elements[name];
      if (!el) return true;
      const rule = this.RULES[name];
      const value = el.value || '';

      if (el.required && !value.trim()) {
        return this.setError(form, name, T('required'));
      }
      if (rule && !rule.test(value)) {
        return this.setError(form, name, T(rule.msg));
      }
      return this.setError(form, name, '');
    }
  };

  const Booking = {
    TOTAL: 4,

    SLOTS: {
      weekday: ['09:00','10:00','11:00','12:00','13:00','14:00','15:00',
                '16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'],
      weekend: ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00',
                '17:00','18:00','19:00','20:00','21:00','22:00','23:00','00:00']
    },

    init() {
      this.form = $('#bookingForm');
      if (!this.form) return;

      this.step      = 1;
      this.steps     = $$('.fstep', this.form);
      this.indicator = $$('.steps__item');
      this.fill      = $('#stepsFill');
      this.prevBtn   = $('#prevBtn');
      this.nextBtn   = $('#nextBtn');
      this.submitBtn = $('#submitBtn');
      this.countEl   = $('#stepCount');
      this.dateInput = $('#date');
      this.timeGrid  = $('#timeGrid');

      this.setupDateBounds();
      this.renderTimeSlots();
      this.bind();
      this.render();
    },

    setupDateBounds() {
      if (!this.dateInput) return;
      const today = new Date();
      const max = new Date(today);
      max.setDate(max.getDate() + 60);

      this.dateInput.min = toISODate(today);
      this.dateInput.max = toISODate(max);
      this.dateInput.value = toISODate(today);
    },

    renderTimeSlots() {
      if (!this.timeGrid) return;

      const iso = this.dateInput ? this.dateInput.value : '';
      const selected = this.selectedTime();

      let list = this.SLOTS.weekday;
      if (iso) {
        const [y, m, d] = iso.split('-').map(Number);
        const day = new Date(y, m - 1, d).getDay();
        if (day === 5 || day === 6) list = this.SLOTS.weekend;
      }

      const isToday = iso === toISODate(new Date());
      const nowMin  = new Date().getHours() * 60 + new Date().getMinutes();

      this.timeGrid.innerHTML = '';
      list.forEach((time, i) => {
        const [hh, mm] = time.split(':').map(Number);

        const slotMin = (hh === 0 ? 24 * 60 : hh * 60) + mm;
        const past = isToday && slotMin <= nowMin + 45;

        const label = document.createElement('label');
        label.className = 'time-slot';
        label.innerHTML =
          `<input type="radio" name="time" value="${time}" id="t${i}"${past ? ' disabled' : ''}` +
          `${!past && time === selected ? ' checked' : ''}><span>${time}</span>`;
        this.timeGrid.appendChild(label);
      });

      if (!this.selectedTime()) Validate.setError(this.form, 'time', '');
    },

    selectedTime() {
      const el = this.form.querySelector('input[name="time"]:checked');
      return el ? el.value : '';
    },

    selectedRadio(name) {
      const el = this.form.querySelector(`input[name="${name}"]:checked`);
      return el ? el.value : '';
    },

    bind() {
      on(this.nextBtn, 'click', () => this.next());
      on(this.prevBtn, 'click', () => this.prev());
      on(this.form, 'submit', (e) => this.submit(e));

      on(this.dateInput, 'change', () => {
        this.renderTimeSlots();
        Validate.setError(this.form, 'date', '');
      });

      $$('[data-guests]', this.form).forEach((btn) => {
        on(btn, 'click', () => {
          const input = this.form.elements.guests;
          const delta = Number(btn.getAttribute('data-guests'));
          const next  = Math.min(30, Math.max(1, Number(input.value || 1) + delta));
          input.value = next;
        });
      });

      const occ = this.form.elements.occasion;
      const otherWrap = $('#occasionOtherWrap');
      on(occ, 'change', () => {
        if (otherWrap) otherWrap.hidden = occ.value !== 'other';
        Validate.setError(this.form, 'occasion', '');
      });

      ['location', 'seating', 'time'].forEach((name) => {
        on(this.form, 'change', (e) => {
          if (e.target.name === name) Validate.setError(this.form, name, '');
        });
      });
      $$('input, textarea, select', this.form).forEach((el) => {
        on(el, 'input', () => {
          if (el.classList.contains('is-invalid')) Validate.setError(this.form, el.name, '');
        });
      });

      $$('[data-prefill]').forEach((link) => {
        on(link, 'click', () => {
          const val = link.getAttribute('data-prefill');
          const radio = this.form.querySelector(`input[name="location"][value="${val}"]`);
          if (radio) { radio.checked = true; this.goTo(1); }
        });
      });
    },

    validateStep(n) {
      let ok = true;

      if (n === 1) {
        ok = this.selectedRadio('location')
          ? Validate.setError(this.form, 'location', '')
          : Validate.setError(this.form, 'location', T('pickVenue'));
      }

      if (n === 2) {
        const dateOk = this.dateInput.value
          ? Validate.setError(this.form, 'date', '')
          : Validate.setError(this.form, 'date', T('pickDate'));
        const timeOk = this.selectedTime()
          ? Validate.setError(this.form, 'time', '')
          : Validate.setError(this.form, 'time', T('pickTime'));
        ok = dateOk && timeOk;
      }

      if (n === 3) {
        const occOk = this.form.elements.occasion.value
          ? Validate.setError(this.form, 'occasion', '')
          : Validate.setError(this.form, 'occasion', T('pickOccasion'));
        const seatOk = this.selectedRadio('seating')
          ? Validate.setError(this.form, 'seating', '')
          : Validate.setError(this.form, 'seating', T('pickSeating'));
        ok = occOk && seatOk;
      }

      if (n === 4) {
        const nameOk  = Validate.field(this.form, 'name');
        const phoneOk = Validate.field(this.form, 'phone');
        const mailOk  = Validate.field(this.form, 'email');
        const consent = this.form.elements.consent.checked
          ? Validate.setError(this.form, 'consent', '')
          : Validate.setError(this.form, 'consent', T('needConsent'));
        ok = nameOk && phoneOk && mailOk && consent;
      }

      if (!ok) {
        const firstErr = $('.field-error.is-shown', this.steps[n - 1]);
        if (firstErr) firstErr.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
      return ok;
    },

    next() {
      if (!this.validateStep(this.step)) return;
      if (this.step < this.TOTAL) { this.step++; this.render(true); }
    },

    prev() {
      if (this.step > 1) { this.step--; this.render(true); }
    },

    goTo(n) {
      this.step = Math.min(this.TOTAL, Math.max(1, n));
      this.render(false);
    },

    render(scroll) {
      this.steps.forEach((f) =>
        f.classList.toggle('is-active', Number(f.dataset.step) === this.step)
      );

      this.indicator.forEach((li) => {
        const n = Number(li.dataset.step);
        li.classList.toggle('is-active', n === this.step);
        li.classList.toggle('is-done',   n < this.step);
      });

      if (this.fill) this.fill.style.width = `${(this.step / this.TOTAL) * 100}%`;
      if (this.countEl) this.countEl.textContent = T('step', this.step, this.TOTAL);

      this.prevBtn.hidden   = this.step === 1;
      this.nextBtn.hidden   = this.step === this.TOTAL;
      this.submitBtn.hidden = this.step !== this.TOTAL;

      if (this.step === this.TOTAL) this.updateSummary();
      if (scroll) this.keepInView();
    },

    keepInView() {
      const box = $('.booking');
      if (!box) return;

      const header = $('#header');
      const offset = (header ? header.offsetHeight : 0) + 24;
      const top = box.getBoundingClientRect().top;

      if (top >= offset) return;

      window.scrollTo({
        top: top + window.scrollY - offset,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth'
      });
    },

    collect() {
      const f = this.form;
      const occKey = f.elements.occasion.value;
      let occasion = occKey ? L('occasion', occKey) : '—';
      const other = f.elements.occasionOther ? f.elements.occasionOther.value.trim() : '';
      if (occKey === 'other' && other) occasion = `${L('occasion', 'other')} — ${other}`;

      const venueKey = this.selectedRadio('location');
      const seatKey  = this.selectedRadio('seating');

      return {
        keys: { venue: venueKey, seating: seatKey, occasion: occKey, other },
        location: venueKey ? L('venue', venueKey) : '—',
        date:     f.elements.date.value,
        time:     this.selectedTime() || '—',
        guests:   f.elements.guests.value || '—',
        occasion,
        seating:  seatKey ? L('seating', seatKey) : '—',
        name:     f.elements.name.value.trim(),
        phone:    f.elements.phone.value.trim(),
        email:    f.elements.email.value.trim(),
        note:     f.elements.note.value.trim()
      };
    },

    updateSummary() {
      const d = this.collect();
      const map = {
        location: d.location,
        date:     fmtDate(d.date),
        time:     d.time,
        guests:   T('guests', d.guests),
        occasion: d.occasion,
        seating:  d.seating
      };
      Object.keys(map).forEach((k) => {
        const el = $(`[data-sum="${k}"]`);
        if (el) el.textContent = map[k];
      });
    },

    submit(e) {
      e.preventDefault();
      if (!this.validateStep(4)) return;

      const data = this.collect();
      this.lastSubmitted = data;

      this.submitBtn.disabled = true;
      this.submitBtn.textContent = T('sending');

      setTimeout(() => {
        this.renderModalSummary(data);
        Modal.open('successModal');

        this.submitBtn.disabled = false;
        this.submitBtn.textContent = T('sendBooking');
        this.reset();
      }, 700);
    },

    renderModalSummary(d) {
      const box = $('#modalSummary');
      if (!box) return;

      const R = T('rows');
      const k = d.keys || {};
      let occasion = d.occasion;
      if (k.occasion) {
        occasion = L('occasion', k.occasion);
        if (k.occasion === 'other' && k.other) occasion += ` — ${k.other}`;
      }

      const rows = [
        [R.venue,    k.venue ? L('venue', k.venue) : d.location],
        [R.date,     fmtDate(d.date)],
        [R.time,     d.time],
        [R.guests,   T('guests', d.guests)],
        [R.occasion, occasion],
        [R.seating,  k.seating ? L('seating', k.seating) : d.seating],
        [R.name,     d.name],
        [R.phone,    d.phone]
      ];
      if (d.note) rows.push([R.note, d.note]);

      box.innerHTML = rows
        .map(([k, v]) => `<div class="row"><span>${k}</span><span>${escapeHTML(v)}</span></div>`)
        .join('');
    },

    reset() {
      this.form.reset();
      this.setupDateBounds();
      this.renderTimeSlots();
      const otherWrap = $('#occasionOtherWrap');
      if (otherWrap) otherWrap.hidden = true;
      $$('.field-error', this.form).forEach((el) => {
        el.textContent = ''; el.classList.remove('is-shown');
      });
      $$('.is-invalid', this.form).forEach((el) => el.classList.remove('is-invalid'));
      this.step = 1;
      this.steps.forEach((f) => f.classList.toggle('is-active', Number(f.dataset.step) === 1));
      this.indicator.forEach((li) => li.classList.remove('is-active', 'is-done'));
      this.indicator[0].classList.add('is-active');
      if (this.fill) this.fill.style.width = '25%';
      if (this.countEl) this.countEl.textContent = T('step', 1, this.TOTAL);
      this.prevBtn.hidden = true;
      this.nextBtn.hidden = false;
      this.submitBtn.hidden = true;
    }
  };

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  const Contact = {
    init() {
      this.form = $('#contactForm');
      if (!this.form) return;
      this.status = $('#contactStatus');

      $$('input, textarea', this.form).forEach((el) => {
        on(el, 'input', () => {
          if (el.classList.contains('is-invalid')) Validate.setError(this.form, el.name, '');
        });
      });

      on(this.form, 'submit', (e) => {
        e.preventDefault();
        const ok = ['cName', 'cEmail', 'cMsg']
          .map((n) => Validate.field(this.form, n))
          .every(Boolean);
        if (!ok) return;

        const btn = $('button[type="submit"]', this.form);
        btn.disabled = true;
        btn.textContent = T('sending');

        setTimeout(() => {
          this.form.reset();
          btn.disabled = false;
          btn.textContent = T('sendMessage');
          if (this.status) {
            this.status.textContent = T('sent');
            this.status.classList.add('is-shown');
            setTimeout(() => this.status.classList.remove('is-shown'), 6000);
          }
        }, 700);
      });
    }
  };

  const Cookies = {
    KEY: 'getcaffe_cookie_consent',
    VERSION: 2,
    DEFAULTS: { necessary: true, analytics: false, marketing: false },

    init() {
      this.banner = $('#cookieBanner');
      this.prefs  = this.read();

      this.bind();

      if (!this.prefs) {
        setTimeout(() => this.showBanner(), 1200);
      } else {
        this.apply(this.prefs);
      }
    },

    read() {
      const raw = storage.get(this.KEY);
      if (!raw) return null;
      try {
        const parsed = JSON.parse(raw);
        if (parsed.version !== this.VERSION) { storage.remove(this.KEY); return null; }
        return parsed;
      } catch (e) {
        storage.remove(this.KEY);
        return null;
      }
    },

    write(prefs) {
      const payload = Object.assign({}, this.DEFAULTS, prefs, {
        necessary: true,
        version: this.VERSION,
        savedAt: new Date().toISOString()
      });
      storage.set(this.KEY, JSON.stringify(payload));
      this.prefs = payload;
      this.apply(payload);
      return payload;
    },

    apply(prefs) {
      if (prefs.analytics) {
        document.documentElement.dataset.analytics = 'on';
      }
      if (prefs.marketing) {
        document.documentElement.dataset.marketing = 'on';
      }

      document.dispatchEvent(new CustomEvent('cookieconsent', { detail: prefs }));
    },

    showBanner() {
      if (!this.banner) return;
      this.banner.hidden = false;

      requestAnimationFrame(() => requestAnimationFrame(() =>
        this.banner.classList.add('is-shown')
      ));
    },

    hideBanner() {
      if (!this.banner) return;
      this.banner.classList.remove('is-shown');
      setTimeout(() => { this.banner.hidden = true; }, 650);
    },

    acceptAll() {
      this.write({ analytics: true, marketing: true });
      this.hideBanner();
      Modal.close();
    },

    rejectAll() {
      this.write({ analytics: false, marketing: false });
      this.hideBanner();
      Modal.close();
    },

    saveCustom() {
      this.write({
        analytics: $('#ckAnalytics').checked,
        marketing: $('#ckMarketing').checked
      });
      this.hideBanner();
      Modal.close();
    },

    openSettings() {
      const current = this.prefs || this.DEFAULTS;
      $$('[data-cookie-cat]').forEach((input) => {
        input.checked = Boolean(current[input.getAttribute('data-cookie-cat')]);
      });
      Modal.open('cookieModal');
    },

    bind() {
      on($('#cookieAccept'),    'click', () => this.acceptAll());
      on($('#cookieReject'),    'click', () => this.rejectAll());
      on($('#cookieSettings'),  'click', () => this.openSettings());
      on($('#cookieAcceptAll'), 'click', () => this.acceptAll());
      on($('#cookieRejectAll'), 'click', () => this.rejectAll());
      on($('#cookieSave'),      'click', () => this.saveCustom());

      $$('[data-open-cookie-settings]').forEach((link) =>
        on(link, 'click', (e) => { e.preventDefault(); this.openSettings(); })
      );
    }
  };

  const Language = {
    init() {
      if (!window.I18N) return;
      window.I18N.init();

      document.addEventListener('languagechange', () => {
        if (Booking.form) {
          if (Booking.countEl) Booking.countEl.textContent = T('step', Booking.step, Booking.TOTAL);
          if (Booking.step === Booking.TOTAL) Booking.updateSummary();
          if (Booking.submitBtn) Booking.submitBtn.textContent = T('sendBooking');

          $$('.field-error', Booking.form).forEach((el) => {
            el.textContent = ''; el.classList.remove('is-shown');
          });
          $$('.is-invalid', Booking.form).forEach((el) => el.classList.remove('is-invalid'));
        }

        const cBtn = $('#contactForm button[type="submit"]');
        if (cBtn && !cBtn.disabled) cBtn.textContent = T('sendMessage');

        if (Header.toggle) {
          const open = Header.nav && Header.nav.classList.contains('is-open');
          Header.toggle.setAttribute('aria-label', open ? T('closeMenu') : T('openMenu'));
        }
        $$('.hero__dot').forEach((d, i) => d.setAttribute('aria-label', T('slide', i + 1)));

        const success = $('#successModal');
        if (success && !success.hidden && Booking.lastSubmitted) {
          Booking.renderModalSummary(Booking.lastSubmitted);
        }
      });
    }
  };

  const Misc = {
    init() {
      const yearEl = $('#year');
      if (yearEl) yearEl.textContent = String(new Date().getFullYear());

      const btn = $('#toTop');
      if (!btn) return;

      on(window, 'scroll', rafThrottle(() => {
        const show = window.scrollY > window.innerHeight * 0.9;
        btn.hidden = false;
        btn.classList.toggle('is-shown', show);
      }), { passive: true });

      on(btn, 'click', () =>
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
      );
    }
  };

  const App = {
    modules: [Language, Backgrounds, Header, HeroSlider, Reveal, Motion,
              Modal, Booking, Contact, Cookies, Misc],

    init() {
      this.modules.forEach((m) => {
        try {
          m.init();
        } catch (err) {
          console.error('[Get Caffe] Модулот падна при иницијализација:', err);
        }
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
  } else {
    App.init();
  }
})();
