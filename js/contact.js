(function () {
  'use strict';

  const successModal = document.getElementById('successModal');
  const errorModal = document.getElementById('errorModal');
  const WA_NUMBER = '524422402238';
  const successDefaults = successModal
    ? {
        title: successModal.querySelector('#successTitle')?.textContent || '',
        text: successModal.querySelector('p')?.textContent || '',
      }
    : null;

  let lastSubmitAt = 0;

  function resetSuccessModalCopy() {
    if (!successModal || !successDefaults) return;
    const title = successModal.querySelector('#successTitle');
    const text = successModal.querySelector('p');
    if (title) title.textContent = successDefaults.title;
    if (text) text.textContent = successDefaults.text;
  }

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      closeModal(successModal);
      closeModal(errorModal);
      resetSuccessModalCopy();
    });
  });

  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  function getField(form, names) {
    for (let i = 0; i < names.length; i += 1) {
      const el = form.querySelector('[name="' + names[i] + '"]');
      if (el && String(el.value).trim()) return String(el.value).trim();
    }
    return '';
  }

  function clearFieldErrors(form) {
    form.querySelectorAll('.field-error').forEach((el) => el.remove());
    form.querySelectorAll('[aria-invalid="true"]').forEach((el) => {
      el.removeAttribute('aria-invalid');
    });
  }

  function showFieldError(input, message) {
    if (!input) return;
    input.setAttribute('aria-invalid', 'true');
    const err = document.createElement('span');
    err.className = 'field-error';
    err.setAttribute('role', 'alert');
    err.textContent = message;
    const group = input.closest('.form-group') || input.parentElement;
    if (group) group.appendChild(err);
  }

  function validateForm(form) {
    clearFieldErrors(form);
    let valid = true;

    const name = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const whatsapp = form.querySelector('[name="whatsapp"], [name="subject"]');
    const situacion = form.querySelector('[name="situacion"], [name="message"]');
    const empresa = form.querySelector('[name="empresa"]');

    if (name && !name.value.trim()) {
      showFieldError(name, 'Ingresa tu nombre.');
      valid = false;
    }
    if (empresa && empresa.hasAttribute('required') && !empresa.value.trim()) {
      showFieldError(empresa, 'Ingresa el nombre de tu empresa.');
      valid = false;
    }
    if (email) {
      const value = email.value.trim();
      if (!value) {
        showFieldError(email, 'Ingresa tu correo electrónico.');
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        showFieldError(email, 'Ingresa un correo válido.');
        valid = false;
      }
    }
    if (whatsapp) {
      const digits = whatsapp.value.replace(/\D+/g, '');
      if (!whatsapp.value.trim()) {
        showFieldError(whatsapp, 'Ingresa tu WhatsApp.');
        valid = false;
      } else if (digits.length < 10) {
        showFieldError(whatsapp, 'Ingresa un WhatsApp válido (mínimo 10 dígitos).');
        valid = false;
      }
    }
    if (situacion && !situacion.value.trim()) {
      showFieldError(situacion, 'Describe la situación que deseas resolver.');
      valid = false;
    }

    return valid;
  }

  function buildWhatsAppMessage(form) {
    const lines = [
      'Hola, quiero agendar un Diagnóstico Empresarial:',
      '',
      'Nombre: ' + getField(form, ['name']),
      'Empresa: ' + getField(form, ['empresa']),
      'Puesto: ' + getField(form, ['puesto']),
      'Colaboradores: ' + getField(form, ['colaboradores', 'tamano']),
      'Área: ' + getField(form, ['area', 'servicio']),
      'WhatsApp: ' + getField(form, ['whatsapp', 'subject']),
      'Correo: ' + getField(form, ['email']),
    ];
    const situacion = getField(form, ['situacion', 'message']);
    const fuera = getField(form, ['fuera_control']);
    if (situacion) lines.push('', 'Situación a resolver:', situacion);
    if (fuera) lines.push('', 'Fuera de control hoy:', fuera);
    return lines.join('\n');
  }

  function openWhatsAppFallback(form) {
    const text = encodeURIComponent(buildWhatsAppMessage(form));
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + text, '_blank', 'noopener');
  }

  function initForm(form) {
    const submitLabel = form.dataset.submitText || 'Agendar Diagnóstico Empresarial';
    const submitBtn = form.querySelector('[type="submit"]');
    const submitHtml = submitBtn ? submitBtn.innerHTML : submitLabel;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const now = Date.now();
      if (now - lastSubmitAt < 4000) return;
      lastSubmitAt = now;

      if (!validateForm(form)) {
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute('aria-busy', 'true');
        submitBtn.textContent = 'Enviando...';
      }

      let sent = false;

      try {
        const response = await fetch(form.action, {
          method: form.method || 'POST',
          body: new FormData(form),
        });
        if (response.ok) sent = true;
      } catch {
        sent = false;
      }

      if (sent) {
        form.reset();
        clearFieldErrors(form);
        resetSuccessModalCopy();
        openModal(successModal);
      } else {
        openWhatsAppFallback(form);
        if (successModal) {
          const title = successModal.querySelector('#successTitle');
          const text = successModal.querySelector('p');
          if (title) title.textContent = 'Continúa por WhatsApp';
          if (text) {
            text.textContent =
              'Abrimos WhatsApp con los datos de tu solicitud. Si no se abrió, escríbenos al 442 240 2238.';
          }
          openModal(successModal);
        } else if (errorModal) {
          openModal(errorModal);
        }
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.removeAttribute('aria-busy');
        submitBtn.innerHTML = submitHtml;
      }
    });
  }

  document.querySelectorAll('.js-contact-form').forEach(initForm);
})();
