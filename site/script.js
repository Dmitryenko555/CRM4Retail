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

  // Demo form: front-only validation + success state (backend подключается позже)
  var form = document.querySelector('.demo-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var err = form.querySelector('.form-error');
      if (!form.checkValidity()) {
        if (err) {
          err.hidden = false;
          err.textContent = 'Проверьте поля: имя, телефон, email и согласие на обработку данных.';
          err.focus && err.setAttribute('tabindex', '-1'), err.focus();
        }
        var firstBad = form.querySelector(':invalid');
        if (firstBad) firstBad.focus();
        return;
      }
      var name = (document.getElementById('f-name') || {}).value || '';
      form.outerHTML = '<div class="form-ok" role="status"><b>Заявка отправлена' +
        (name ? ', ' + name.replace(/[<>&"]/g, '') : '') +
        '.</b><br>Мы свяжемся в течение рабочего дня и договоримся о демо.</div>';
    });
  }
})();
