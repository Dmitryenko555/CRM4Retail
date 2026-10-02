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

  // Scroll-spy: кликнутый/текущий раздел выделяется в меню (приподнят + фон)
  var spyLinks = Array.prototype.slice.call(document.querySelectorAll('.menu a[href^="#"]:not(.btn)'));
  function setCurrent(id) {
    spyLinks.forEach(function (a) {
      a.classList.toggle('current', a.getAttribute('href') === '#' + id);
    });
  }
  if ('IntersectionObserver' in window && spyLinks.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) setCurrent(en.target.id);
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    spyLinks.forEach(function (a) {
      var sec = document.getElementById(a.getAttribute('href').slice(1));
      if (sec) spy.observe(sec);
    });
  }
  spyLinks.forEach(function (a) {
    a.addEventListener('click', function () { setCurrent(a.getAttribute('href').slice(1)); });
  });

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
