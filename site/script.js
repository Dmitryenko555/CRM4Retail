(function () {
  // Year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Burger
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        menu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Валидация в духе Artemsites/validate-signal-lamp, но сигнал — рамка поля, а не лампа.
  // Email-паттерн — из validate-signal-lamp: /^[^ ]+@[^ ]+\.[a-z](.+)$/
  var EMAIL_PATTERN = /^[^ ]+@[^ ]+\.[a-z](.+)$/;
  function paint(input, state) {
    input.classList.remove('field-ok', 'field-err');
    if (state === 'ok') input.classList.add('field-ok');
    if (state === 'err') input.classList.add('field-err');
  }
  function validateEmailField(input) {
    var v = input.value.trim();
    if (v === '') { paint(input, null); return null; } // пустое — нейтрально, как у лампы
    var ok = EMAIL_PATTERN.test(v);
    paint(input, ok ? 'ok' : 'err');
    return ok;
  }
  function validatePhoneField(input) {
    var v = input.value.trim();
    if (v === '') { paint(input, null); return null; }
    var digits = v.replace(/\D/g, '');
    var ok = /^(7|8)\d{10}$/.test(digits);
    paint(input, ok ? 'ok' : 'err');
    return ok;
  }

  // Demo form: front-only validation + success state (backend подключается позже)
  var form = document.querySelector('.demo-form');
  var emailInput = document.getElementById('f-email');
  var phoneInput = document.getElementById('f-phone');
  if (emailInput) {
    emailInput.addEventListener('input', function () { validateEmailField(emailInput); });
  }
  if (phoneInput) {
    phoneInput.addEventListener('input', function () { validatePhoneField(phoneInput); });
  }
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var err = form.querySelector('.form-error');
      var emailOk = emailInput ? validateEmailField(emailInput) : true;
      var phoneOk = phoneInput ? validatePhoneField(phoneInput) : true;
      var bad = (emailOk === false) ? emailInput : ((phoneOk === false) ? phoneInput : form.querySelector(':invalid'));
      if (emailOk === false || phoneOk === false || !form.checkValidity()) {
        if (err) {
          err.hidden = false;
          err.textContent = 'Проверьте поля: имя, телефон (+7/8, 11 цифр), корректный email и согласие на обработку данных.';
        }
        if (bad) bad.focus();
        return;
      }
      var name = (document.getElementById('f-name') || {}).value || '';
      form.outerHTML = '<div class="form-ok" role="status"><b>Заявка отправлена' +
        (name ? ', ' + name.replace(/[<>&"]/g, '') : '') +
        '.</b><br>Мы свяжемся в течение рабочего дня и договоримся о демо.</div>';
    });
  }

  // Scroll-spy: пункт текущего раздела всегда подсвечен (не гаснет в hero и демо).
  // hero → первый пункт, демо без пункта → держим предыдущий (FAQ).
  var spyLinks = Array.prototype.slice.call(document.querySelectorAll('.menu a[href^="#"]:not(.btn)'));
  var spyOrder = ['features', 'how', 'for', 'cases', 'pricing', 'faq', 'demo'];
  function setCurrent(id) {
    spyLinks.forEach(function (a) {
      a.classList.toggle('current', a.getAttribute('href') === '#' + id);
    });
  }
  var spyTicking = false;
  function spyTick() {
    spyTicking = false;
    var mid = window.scrollY + window.innerHeight * 0.4;
    var current = 'features';
    spyOrder.forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec && sec.getBoundingClientRect().top + window.scrollY <= mid) current = id;
    });
    if (current === 'demo') current = 'faq';
    setCurrent(current);
  }
  function spyRequest() {
    if (!spyTicking) { spyTicking = true; window.requestAnimationFrame(spyTick); }
  }
  if (spyLinks.length) {
    window.addEventListener('scroll', spyRequest, { passive: true });
    window.addEventListener('resize', spyRequest);
    spyTick();
  }

  // Tilt карточек (Artemsites/card-tilt → VanillaTilt), аккуратный: max 6, без блика.
  // Только для мыши и без prefers-reduced-motion.
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var calmMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.VanillaTilt && finePointer && !calmMotion) {
    window.VanillaTilt.init(document.querySelectorAll('.pain, .case'), {
      max: 6,
      speed: 300,
      scale: 1.02,
      glare: false
    });
  }
})();
