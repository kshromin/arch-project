/**
 * KHROM Form Handler — отправка заявок в Google Sheets
 * 
 * НАСТРОЙКА:
 * 1. Выполните шаги из GOOGLE_SETUP.md
 * 2. Вставьте полученный URL в переменную GOOGLE_SCRIPT_URL ниже
 * 3. Готово
 */

// ===== ВСТАВЬТЕ СЮДА URL ПОСЛЕ НАСТРОЙКИ GOOGLE APPS SCRIPT =====
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/ВАШ_ID/exec';
// =================================================================

/**
 * Инициализация форм на странице
 * Автоматически подключается ко всем формам с data-form="khrom"
 */
function initKhromForms() {
  document.querySelectorAll('form[data-form="khrom"]').forEach(form => {
    form.addEventListener('submit', handleFormSubmit);
  });
}

/**
 * Обработчик отправки формы
 */
async function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn ? btn.textContent : '';
  
  // Проверка URL
  if (GOOGLE_SCRIPT_URL.includes('ВАШ_ID')) {
    showFormStatus(form, '⚠️ Google Apps Script ещё не настроен. См. инструкцию GOOGLE_SETUP.md', 'warning');
    return;
  }

  // Собираем данные
  const formData = new FormData(form);
  const fileInput = form.querySelector('input[type="file"]');
  const fileName = fileInput && fileInput.files[0] ? fileInput.files[0].name : '';
  
  let message = formData.get('message') || '';
  if (fileName) {
    message = '[Файл: ' + fileName + ']\n' + message;
  }

  const data = {
    timestamp: new Date().toISOString(),
    source: form.dataset.source || 'site',
    page: window.location.pathname,
    name: formData.get('name') || '',
    phone: formData.get('phone') || '',
    email: formData.get('email') || '',
    message: message,
    direction: formData.get('direction') || ''
  };

  // Блокируем кнопку
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Отправка...';
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    // При no-cors мы не видим ответ, но считаем что отправка прошла
    showFormStatus(form, '✅ Заявка отправлена! Мы свяжемся с вами в течение дня.', 'success');
    form.reset();

  } catch (err) {
    console.error('Form error:', err);
    showFormStatus(form, '❌ Ошибка отправки. Попробуйте позже или напишите напрямую: it@khrom-in.ru', 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  }
}

/**
 * Показать статус формы
 */
function showFormStatus(form, message, type) {
  let statusEl = form.querySelector('.form-status');
  if (!statusEl) {
    statusEl = document.createElement('div');
    statusEl.className = 'form-status';
    form.appendChild(statusEl);
  }
  
  statusEl.textContent = message;
  statusEl.className = 'form-status ' + type;
  statusEl.style.display = 'block';
  
  setTimeout(() => {
    statusEl.style.display = 'none';
  }, 8000);
}

// Автоинициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initKhromForms);
