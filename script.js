(function () {
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

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

  var EMAIL_PATTERN = /^[^ ]+@[^ ]+\.[a-z](.+)$/;
  function paint(input, state) {
    input.classList.remove('field-ok', 'field-err');
    if (state === 'ok') input.classList.add('field-ok');
    if (state === 'err') input.classList.add('field-err');
  }
  function validateEmailField(input) {
    var v = input.value.trim();
    if (v === '') { paint(input, null); return null; }
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
    var current = null;
    spyOrder.forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec && sec.getBoundingClientRect().top + window.scrollY <= mid) current = id;
    });
    if (current === 'demo') current = null;
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

  var overlay = document.getElementById('modal');
  var modalForm = document.getElementById('m-form');
  var modalEmail = document.getElementById('m-email');
  var modalPhone = document.getElementById('m-phone');
  var lastFocus = null;
  function openModal() {
    if (!overlay) return;
    lastFocus = document.activeElement;
    overlay.hidden = false;
    window.requestAnimationFrame(function () { overlay.classList.add('open'); });
    document.body.classList.add('locked');
    var first = modalForm ? modalForm.querySelector('input') : null;
    if (first) first.focus();
  }
  function closeModal() {
    if (!overlay || overlay.hidden) return;
    overlay.classList.remove('open');
    document.body.classList.remove('locked');
    window.setTimeout(function () { overlay.hidden = true; }, 180);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-modal]'), function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
  });
  if (overlay) {
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
    var closer = overlay.querySelector('.modal-close');
    if (closer) closer.addEventListener('click', closeModal);
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay && !overlay.hidden) closeModal();
  });
  if (modalEmail) {
    modalEmail.addEventListener('input', function () { validateEmailField(modalEmail); });
  }
  if (modalPhone) {
    modalPhone.addEventListener('input', function () { validatePhoneField(modalPhone); });
  }
  if (modalForm) {
    modalForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var err = modalForm.querySelector('.form-error');
      var emailOk = modalEmail ? validateEmailField(modalEmail) : true;
      var phoneOk = modalPhone ? validatePhoneField(modalPhone) : true;
      var bad = (emailOk === false) ? modalEmail : ((phoneOk === false) ? modalPhone : modalForm.querySelector(':invalid'));
      if (emailOk === false || phoneOk === false || !modalForm.checkValidity()) {
        if (err) {
          err.hidden = false;
          err.textContent = 'Проверьте имя, телефон (+7/8, 11 цифр), email и согласие.';
        }
        if (bad) bad.focus();
        return;
      }
      var name = (document.getElementById('m-name') || {}).value || '';
      modalForm.outerHTML = '<div class="form-ok" role="status"><b>Заявка отправлена' +
        (name ? ', ' + name.replace(/[<>&"]/g, '') : '') +
        '.</b><br>Мы свяжемся в течение рабочего дня и договоримся о демо.</div>';
    });
  }
})();
