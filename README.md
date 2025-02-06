# 🛒 Сумма выкупленных товаров на Ozon

Скрипт для подсчета суммы выкупа на Озон, не требующий технических знаний для запуска.

![Пример использования](img/screenshot.png)

---

## 🚀 Как запустить

### 1️⃣ Вход на сайт
- Войдите в аккаунт на [ozon.ru](https://www.ozon.ru/) с **компьютера или ноутбука**.
- Мобильные устройства и мобильная версия сайта **не подходят**.

### 2️⃣ Открытие завершенных заказов
- Перейдите на [страницу завершенных заказов](https://www.ozon.ru/my/orderlist?selectedTab=archive).
- Откройте консоль разработчика:

   - **Windows**:
      - Chrome/Edge: `Ctrl + Shift + J`
      - Firefox: `Ctrl + Shift + K`
   - **MacOS**:
      - Chrome/Edge: `Cmd + Option + J`
      - Firefox: `Cmd + Option + K`
   - **Linux**:
      - Chrome/Edge: `Ctrl + Shift + J`
      - Firefox: `Ctrl + Shift + K`

### 3️⃣ Разрешение вставки скрипта (только Chrome)
Если используете Chrome, перед вставкой скрипта введите в консоли команду:
```js
allow pasting
```

### 4️⃣ Запуск скрипта
- Скопируйте и вставьте следующий код в консоль, затем нажмите `Enter`:

    ```javascript
    const maxScrolls=200;const refundKeyWord="Заявка на возврат";const refundUrlKeyWord="returns";const completedRefundKeyWord="Деньги отправлены";const orderKeyWord="Заказ от";async function run(){const type=window.location.href.includes(refundUrlKeyWord)?"refunds":"orders";await loadAllOrders(type);const ordersAmounts=checkAmount(type);printResults(ordersAmounts,type)}run();function printResults(ordersAmounts,type){const ordersAmount=ordersAmounts.reduce(((acc,amount)=>acc+amount),0);console.log("=============================");console.log(`%c✅ Найдено ${ordersAmounts.length} ${type==="refunds"?"возвратов, где были отправлены деньги":"заказов"}, список их сумм от самого дорогого к самому дешевому:`,"color: BurlyWood; font-size: 14px;");console.log(`%c${ordersAmounts.sort(((a,b)=>b-a)).join(", ")}`,"color: BurlyWood; font-size: 12px;");console.log("=============================");console.log(`%c📦 Итоговая сумма ${type==="refunds"?"возвратов":"заказов"}:`,"color: ForestGreen; font-size: 16px; font-weight: bold;");console.log(`%c💰 ${ordersAmount} ₽`,"color: DarkOrange; font-size: 32px; font-weight: bold;");console.log("=============================");console.log(`%c✅ КОНЕЦ`,"color: BurlyWood; font-size: 20; font-weight: bold;");console.log("=============================")}function getCurrentOrdersCount(type){return Array.from(document.querySelectorAll("span")).filter((el=>el.textContent&&el.textContent.trim().includes(type==="refunds"?refundKeyWord:orderKeyWord))).length}function waitFor(timeout){return new Promise((resolve=>setTimeout(resolve,timeout)))}async function scrollIteration(count,type="orders"){const timeout=300;let prevOrdersCount=getCurrentOrdersCount(type);window.scrollBy(0,1e3);await waitFor(timeout);window.scrollBy(0,1e3);await waitFor(timeout);if(count>maxScrolls){console.error(`%c⚠️ Слишком большое количество попыток проскроллить страницу, допустимый максимум ${maxScrolls}. Завершение скрипта`,"color: Crimson; font-size: 24px; font-weight: bold;");throw new Error("Too many scrolls")}console.clear();console.log(`%c⏳ Список ${type==="refunds"?"возвратов":"заказов"} проскролен ${count} раз, продолжаю скролить, подождите...`,"color: BurlyWood; font-size: 16px;");if(getCurrentOrdersCount(type)!==prevOrdersCount){return true}await waitFor(2e3);if(getCurrentOrdersCount(type)!==prevOrdersCount){return true}await waitFor(2e3);if(getCurrentOrdersCount(type)!==prevOrdersCount){return true}return false}async function loadAllOrders(type="orders"){for(let count=1;count<maxScrolls;count++){const shouldContinue=await scrollIteration(count,type);if(!shouldContinue){console.log(`%c✅ Список ${type==="refunds"?"возвратов":"заказов"} проскролен ${count} раз и получен конец списка.`,"color: BurlyWood; font-size: 16px;");break}}}function getDirectTextContent(element){return Array.from(element.childNodes).filter((node=>node.nodeType===Node.TEXT_NODE)).map((node=>node.textContent.trim())).join("")}function checkAmount(type="orders"){const orderSpanElements=Array.from(document.querySelectorAll(type==="refunds"?"div":"span")).filter((el=>getDirectTextContent(el).trim().includes(type==="refunds"?completedRefundKeyWord:orderKeyWord)));let ordersAmounts=[];orderSpanElements.forEach((element=>{let parent=type==="refunds"?element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement:element.parentElement.parentElement.parentElement.parentElement;const amountElement=Array.from(parent.querySelectorAll(type==="refunds"?"div":"span")).find((span=>span.textContent&&span.textContent.trim().match(/^.*\d*[\s\u00A0]*\d+[\s\u00A0]*₽$/)));if(amountElement){const amountText=amountElement.textContent.replace(/\s|₽/g,"");const amount=parseInt(amountText,10);if(!isNaN(amount)){ordersAmounts.push(amount)}}}));return ordersAmounts}
    ```

### 5️⃣ Получение результата
После выполнения скрипта в консоли отобразится сумма всех заказов.

### 6️⃣ Учёт возвратов
Если хотите учесть **возвраты**, запустите скрипт [на странице возвратов](https://www.ozon.ru/my/returns) и вычтите полученную сумму.

---

## ℹ️ Примечания

- Скрипт **автоматически** прокручивает страницу и собирает все заказы.
- Автор **не гарантирует** 100% точность. Данные основаны на видимой информации на сайте и могут содержать неточности.
- **Скрипт не сохраняет и не передает данные**. Все вычисления происходят **локально** в браузере.

---

## 🧑‍💻 Для разработчиков

- В случае изменений на Ozon могут потребоваться  обновления селекторов в скрипте или адресов страниц.
- Если нашли ошибку или есть предложения – создайте pull request.
- Исходный код находится в [src/index.js](src/index.js) и форматируется ESLint + Prettier.
- Минифицированный код создается с помощью Terser и хранится в `dist/index.min.js`.
- Минифицированный код вручную добавляется в `README.md` для удобства пользователей

После внесения изменений в исходный код, запустите:

```bash
npm i
npm run minify
```
