/* ============================================================
   GTC — script.js
   اسکریپت مشترک همهٔ صفحات
   ============================================================ */
(function () {
  'use strict';

  /* ---------- ابزارها ---------- */
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  // تبدیل اعداد لاتین به فارسی
  const toFa = (v) => String(v).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);

  const store = {
    get(key, fallback) {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
      catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); return true; }
      catch { return false; }
    }
  };

  function toast(msg) {
    let el = $('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 3200);
  }

  /* ---------- ۱. منوی موبایل و لینک فعال ---------- */
  function initNav() {
    const toggle = $('.nav-toggle');
    const links  = $('.nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        const open = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
      });
    }
    const here = location.pathname.split('/').pop() || 'index.html';
    $$('.nav-links a').forEach(a => {
      const target = a.getAttribute('href');
      if (target === here) a.classList.add('active');
    });
  }

  /* ---------- ۲. شمارش معکوس ---------- */
  const TERMINATION_DATE = new Date('2049-12-31T23:59:59');

  function initCountdown() {
    const box = $('#countdown');
    if (!box) return;

    const cells = {
      d: $('[data-cd="d"]', box),
      h: $('[data-cd="h"]', box),
      m: $('[data-cd="m"]', box),
      s: $('[data-cd="s"]', box)
    };

    const pad = n => String(n).padStart(2, '0');

    function tick() {
      const diff = TERMINATION_DATE - new Date();
      if (diff <= 0) {
        box.innerHTML = '<p>زمان فرا رسیده است. (شوخی کردیم. هنوز نه.)</p>';
        clearInterval(timer);
        return;
      }
      const sec  = Math.floor(diff / 1000);
      const days = Math.floor(sec / 86400);
      const hrs  = Math.floor((sec % 86400) / 3600);
      const mins = Math.floor((sec % 3600) / 60);
      const secs = sec % 60;

      if (cells.d) cells.d.textContent = toFa(days);
      if (cells.h) cells.h.textContent = toFa(pad(hrs));
      if (cells.m) cells.m.textContent = toFa(pad(mins));
      if (cells.s) cells.s.textContent = toFa(pad(secs));
    }

    tick();
    const timer = setInterval(tick, 1000);
  }

  /* ---------- ۳. فرم نام‌نویسی ---------- */
  const MEMBERS_KEY = 'gtc_members';

  function makeCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    let s = '';
    for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return 'GTC-' + s + '-' + Math.floor(1000 + Math.random() * 9000);
  }

  function initSignup() {
    const form = $('#signup-form');
    if (!form) return;

    const success = $('#signup-success');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      const data = Object.fromEntries(new FormData(form).entries());
      const member = {
        code: makeCode(),
        codename: (data.codename || '').trim(),
        city: (data.city || '').trim(),
        email: (data.email || '').trim(),
        role: data.role || 'نامشخص',
        reason: (data.reason || '').trim(),
        joinedAt: new Date().toISOString()
      };

      const all = store.get(MEMBERS_KEY, []);
      all.push(member);
      store.set(MEMBERS_KEY, all);

      if (success) {
        $('[data-out="codename"]', success).textContent = member.codename || 'داوطلب بی‌نام';
        $('[data-out="code"]', success).textContent = member.code;
        $('[data-out="city"]', success).textContent = member.city || '—';
        form.classList.add('hidden');
        success.classList.remove('hidden');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      toast('نام‌نویسی ثبت شد. به خانواده خوش آمدید.');
    });
  }

  /* ---------- ۴. بایگانی مقاله‌ها ---------- */
  const ARTICLES_KEY = 'gtc_articles';

  const SEED_ARTICLES = [
    {
      id: 'a1',
      title: 'چگونه خورشید را به تعطیلی موقت وادار کنیم',
      author: 'دکتر ن. هلاک',
      category: 'پژوهش',
      date: '1403/02/11',
      body: 'پس از یازده سال مطالعهٔ مستمر، به این نتیجه رسیدیم که خورشید به هیچ‌وجه همکاری نمی‌کند. پیشنهاد ما این است که به‌جای تلاش برای خاموش کردنش، صبر کنیم تا خودش خسته شود. این پروژه فعلاً در وضعیت «معلق» قرار دارد — مثل تقریباً همهٔ پروژه‌های دیگر ما.'
    },
    {
      id: 'a2',
      title: 'راهنمای ساخت سیاه‌چالهٔ خانگی با وسایل دورریز',
      author: 'کاربر ۴۰۴',
      category: 'راهنما',
      date: '1403/03/02',
      body: 'مواد لازم: یک جعبهٔ مقوایی، مقداری چسب حرارتی، و انتظارات بسیار بلند. مراحل: جعبه را بردارید. آن را در گوشهٔ اتاق بگذارید. به آن نگاه کنید. هیچ اتفاقی نمی‌افتد. تبریک می‌گویم، شما یک سیاه‌چاله ساخته‌اید که کاملاً نامرئی است. ما این را موفقیت می‌نامیم.'
    },
    {
      id: 'a3',
      title: 'چرا دوشنبه‌ها بهترین روز برای پایان جهان است',
      author: 'م. آخرالزمانی',
      category: 'ایده',
      date: '1403/04/19',
      body: 'از نظر آماری، دوشنبه‌ها روزی است که بیشترین تعداد انسان‌ها آرزو می‌کنند دنیا تمام شود. پس اگر قرار است کاری انجام دهیم، بهتر است همان روز باشد تا کسی متوجه تفاوت نشود. مزیت دوم: تعطیلی‌های رسمی هرگز روی دوشنبه نمی‌افتند، پس هیچ برنامه‌ای لغو نمی‌شود.'
    },
    {
      id: 'a4',
      title: 'معماری پناهگاه: طراحی اتاقی که هیچ‌کس پیدا نکند',
      author: 'ک. زیرزمینی',
      category: 'راهنما',
      date: '1403/05/07',
      body: 'کلید یک پناهگاه خوب، نه عمق آن است و نه فولادش؛ بلکه این است که هیچ‌کس به‌دنبالش نگردد. ما توصیه می‌کنیم پناهگاه خود را شبیه یک ادارهٔ مالیاتی معمولی بسازید. تا امروز هیچ‌کس داوطلبانه وارد یکی از آن‌ها نشده است.'
    },
    {
      id: 'a5',
      title: 'ده ایده برای نابودی دنیا که هرگز نباید امتحان کنید',
      author: 'تیم تحلیل GTC',
      category: 'طنز',
      date: '1403/06/23',
      body: 'یک: آن را به یک نرم‌افزار بسپارید. دو: آن را به یک کمیته بسپارید. سه: منتظر بمانید تا خودش انجام شود. چهار تا ده: متأسفانه همهٔ آن‌ها همین‌قدر بی‌فایده بودند. ما این فهرست را صرفاً برای ثبت در تاریخ منتشر می‌کنیم.'
    }
  ];

  function normalizeCategory(c) {
    const allowed = ['پژوهش', 'ایده', 'راهنما', 'طنز'];
    return allowed.includes(c) ? c : 'ایده';
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, m => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]
    ));
  }

  function initArticles() {
    const list = $('#articles-list');
    if (!list) return;

    const searchInput = $('#article-search');
    const filterSel   = $('#article-filter');
    const compose     = $('#compose');
    const toggleBtn   = $('#toggle-compose');
    const form        = $('#article-form');
    const emptyState  = $('#empty-state');

    function getAll() {
      const user = store.get(ARTICLES_KEY, []);
      return [...user, ...SEED_ARTICLES];
    }

    function render() {
      const q = (searchInput?.value || '').trim().toLowerCase();
      const cat = filterSel?.value || 'all';

      const items = getAll().filter(a => {
        const matchQ = !q ||
          a.title.toLowerCase().includes(q) ||
          a.body.toLowerCase().includes(q) ||
          (a.author || '').toLowerCase().includes(q);
        const matchC = cat === 'all' || a.category === cat;
        return matchQ && matchC;
      });

      list.innerHTML = items.map(a => `
        <article class="card article reveal" data-id="${a.id}">
          <div class="article-top">
            <span class="badge">${escapeHtml(a.category)}</span>
            <time>${escapeHtml(a.date)}</time>
          </div>
          <h3>${escapeHtml(a.title)}</h3>
          <p class="article-body">${escapeHtml(a.body)}</p>
          <div class="article-foot">
            <span>نویسنده: ${escapeHtml(a.author || 'ناشناس')}</span>
            <span>برای باز کردن کلیک کنید</span>
          </div>
        </article>
      `).join('');

      if (emptyState) emptyState.classList.toggle('hidden', items.length > 0);

      $$('.article', list).forEach(card => {
        card.addEventListener('click', () => card.classList.toggle('open'));
      });

      observeReveals();
    }

    if (toggleBtn && compose) {
      toggleBtn.addEventListener('click', () => {
        compose.classList.toggle('hidden');
        if (!compose.classList.contains('hidden')) {
          compose.scrollIntoView({ behavior: 'smooth', block: 'center' });
          $('#a-title')?.focus();
        }
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }

        const data = Object.fromEntries(new FormData(form).entries());
        const now = new Date();
        const article = {
          id: 'u' + now.getTime(),
          title: (data.title || '').trim(),
          author: (data.author || '').trim() || 'ناشناس',
          category: normalizeCategory(data.category),
          date: toFa(
            now.toLocaleDateString('fa-IR-u-nu-latn', { year: 'numeric', month: '2-digit', day: '2-digit' })
          ),
          body: (data.body || '').trim()
        };

        const user = store.get(ARTICLES_KEY, []);
        user.unshift(article);
        store.set(ARTICLES_KEY, user);

        form.reset();
        compose.classList.add('hidden');
        render();
        toast('ایده‌ی شما ثبت شد. مسئولیتش با خودتان است.');
      });
    }

    searchInput?.addEventListener('input', render);
    filterSel?.addEventListener('change', render);

    render();
  }

  /* ---------- ۵. فرم تماس ---------- */
  function initContact() {
    const form = $('#contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      const success = $('#contact-success');
      form.classList.add('hidden');
      success?.classList.remove('hidden');
      success?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      toast('پیام ارسال شد. کسی هرگز پاسخ نخواهد داد.');
    });
  }

  /* ---------- ۶. انیمیشن ظهور ---------- */
  let observer = null;

  function observeReveals() {
    const items = $$('.reveal:not(.in)');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('in'));
      return;
    }
    if (!observer) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            observer.unobserve(en.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    }
    items.forEach(el => observer.observe(el));
  }

  /* ---------- راه‌اندازی ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initCountdown();
    initSignup();
    initArticles();
    initContact();
    observeReveals();
  });
})();
