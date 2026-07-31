# Настройка Google Sheets для приёма заявок

> Время настройки: ~5 минут  
> Аккаунт: `k.s.hromin@gmail.com`

---

## Шаг 1. Создать Google Таблицу

1. Откройте [Google Sheets](https://sheets.google.com) и войдите в аккаунт **k.s.hromin@gmail.com**
2. Нажмите **(+) Пустая таблица**
3. В первой строке (заголовки) введите:

   | A | B | C | D | E | F | G |
   |---|---|---|---|---|---|---|
   | Дата | Имя | Телефон | Email | Сообщение | Направление | Источник |

4. Нажмите **Файл → Сохранить** и дайте название: `KHROM — Заявки с сайта`

---

## Шаг 2. Скрипт для приёма данных

1. В таблице: **Расширения → Apps Script**
2. Удалите весь стандартный код и вставьте:

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    sheet.appendRow([
      data.timestamp ? new Date(data.timestamp) : new Date(),
      data.name || '',
      data.phone || '',
      data.email || '',
      data.message || '',
      data.direction || '',
      data.source || 'site'
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({result: 'ok'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({result: 'error', message: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({status: 'ok', message: 'KHROM Form API'}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Нажмите **Сохранить** (дискетка) и назовите проект: `KHROM-Form-Handler`

---

## Шаг 3. Развернуть веб-приложение

1. Нажмите **Развернуть → Новое развертывание**
2. Нажмите на значок шестерёнки (⚙️) рядом с «Описание» и выберите **Веб-приложение**
3. Заполните:
   - **Описание**: `KHROM Form API`
   - **Выполнять как**: `Я`
   - **Кто имеет доступ**: `Все`
4. Нажмите **Развернуть**
5. Подтвердите разрешения (нажмите «Дополнительные», затем «Перейти»)
6. Скопируйте **URL веб-приложения** (пример: `https://script.google.com/macros/s/.../exec`)

---

## Шаг 4. Вставить URL в сайт

1. Откройте файл `site/js/form-handler.js`
2. Найдите строку:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/ВАШ_ID/exec';
   ```
3. Замените URL на тот, что скопировали на шаге 3
4. Сохраните файл

---

## Шаг 5. Опубликовать таблицу для дашборда

1. В таблице: **Файл → Опубликовать в интернете**
2. В разделе «Ссылка» выберите:
   - **Вся таблица** или нужный лист
   - Формат: **CSV**
3. Нажмите **Опубликовать** → подтвердите
4. Скопируйте ID таблицы из URL адресной строки:  
   `https://docs.google.com/spreadsheets/d/«ВОТ_ЭТОТ_ID»/edit`
5. Откройте `site/dashboard.html` и вставьте ID в строку:
   ```javascript
   const SHEET_ID = 'ВАШ_SHEET_ID';
   ```

---

## Готово!

- **Формы на сайте** → отправляют заявки в таблицу
- **Дашборд** → `project.khrom-in.ru/dashboard.html` (или `ваш-домен/dashboard.html`)
- **Таблица** → все данные в Google Sheets, доступна с любого устройства

---

## Проверка

1. Откройте любую страницу с формой (index.html, konstruktor.html)
2. Заполните и отправьте тестовую заявку
3. Проверьте таблицу — строка должна появиться в течение 2–3 секунд
4. Откройте дашборд — заявка отобразится автоматически

---

## Важно

- **mode: 'no-cors'** в скрипте сайта означает, что мы не видим ответ от Google. Это нормально — заявки всё равно записываются.
- Если нужно получать ответ, придётся добавить CORS-заголовки в скрипт (сложнее, но возможно). Для начала работает и так.
- Дашборд обновляется автоматически каждые 2 минуты.
