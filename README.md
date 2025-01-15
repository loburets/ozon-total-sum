# 🛒 Сумма выкупленных товаров на Ozon

Скрипт, который считает сумму вашего выкупа на Озон и не требует технических знаний для своего запуска.

## 🛠️ Как запустить

1. **Войдите в свой аккаунт с компьютера или ноутбука на сайте [ozon.ru](https://www.ozon.ru/).**
   Мобильное приложение или мобильная версия сайта не подойдут.

2. **Зайдите [на страницу с завершенными заказами](https://www.ozon.ru/my/orderlist?selectedTab=archive) и откройте консоль разработчика**
   В зависимости от вашей операционной системы и браузера:

    - **Windows**:
        - Chrome/Edge: Нажмите `Ctrl + Shift + J`
        - Firefox: Нажмите `Ctrl + Shift + K`
    - **MacOS**:
        - Chrome/Edge: Нажмите `Cmd + Option + J`
        - Firefox: Нажмите `Cmd + Option + K`
    - **Linux**:
        - Chrome/Edge: Нажмите `Ctrl + Shift + J`
        - Firefox: Нажмите `Ctrl + Shift + K`

3. **Если вы используете Google Chrome, то он может ограничивать вставку скриптов в консоль.**
   - В этом случае, перед вставкой скрипта вам необходимо в консоль вручную с клавиатуры напечатать команду `allow pasting` и нажмите Enter. Это разрешит вставку текста в консоль.
   - **Примечание**: Firefox и другие браузеры, как правило, не требуют этой команды, но в случае проблем с вставкой текста проверьте настройки безопасности браузера и сообщения в консоли.

4. **Скопируйте и ставьте скрипт в консоль и нажмите `Enter`**

    ```javascript
    const maxScrolls=200;const refundKeyWord="Заявка на возврат";const refundUrlKeyWord="returns";const completedRefundKeyWord="Деньги отправлены";const orderKeyWord="Заказ от";async function run(){const type=window.location.href.includes(refundUrlKeyWord)?"refunds":"orders";await loadAllOrders(type);const ordersAmounts=checkAmount(type);printResults(ordersAmounts,type)}run();function printResults(ordersAmounts,type){const ordersAmount=ordersAmounts.reduce(((acc,amount)=>acc+amount),0);console.log("=============================");console.log(`%c✅ Найдено ${ordersAmounts.length} ${type==="refunds"?"возвратов, где были отправлены деньги":"заказов"}, список их сумм от самого дорогого к самому дешевому:`,"color: BurlyWood; font-size: 14px;");console.log(`%c${ordersAmounts.sort(((a,b)=>b-a)).join(", ")}`,"color: BurlyWood; font-size: 12px;");console.log("=============================");console.log(`%c📦 Итоговая сумма ${type==="refunds"?"возвратов":"заказов"}:`,"color: ForestGreen; font-size: 16px; font-weight: bold;");console.log(`%c💰 ${ordersAmount} ₽`,"color: DarkOrange; font-size: 32px; font-weight: bold;");console.log("=============================");console.log(`%c✅ КОНЕЦ`,"color: BurlyWood; font-size: 20; font-weight: bold;");console.log("=============================")}function getCurrentOrdersCount(type){return Array.from(document.querySelectorAll("span")).filter((el=>el.textContent&&el.textContent.trim().includes(type==="refunds"?refundKeyWord:orderKeyWord))).length}function waitFor(timeout){return new Promise((resolve=>setTimeout(resolve,timeout)))}async function scrollIteration(count,type="orders"){const timeout=300;let prevOrdersCount=getCurrentOrdersCount(type);window.scrollBy(0,1e3);await waitFor(timeout);window.scrollBy(0,1e3);await waitFor(timeout);if(count>maxScrolls){console.error(`%c⚠️ Слишком большое количество попыток проскроллить страницу, допустимый максимум ${maxScrolls}. Завершение скрипта`,"color: Crimson; font-size: 24px; font-weight: bold;");throw new Error("Too many scrolls")}console.clear();console.log(`%c⏳ Список ${type==="refunds"?"возвратов":"заказов"} проскролен ${count} раз, продолжаю скролить, подождите...`,"color: BurlyWood; font-size: 16px;");if(getCurrentOrdersCount(type)!==prevOrdersCount){return true}await waitFor(2e3);if(getCurrentOrdersCount(type)!==prevOrdersCount){return true}await waitFor(2e3);if(getCurrentOrdersCount(type)!==prevOrdersCount){return true}return false}async function loadAllOrders(type="orders"){for(let count=1;count<maxScrolls;count++){const shouldContinue=await scrollIteration(count,type);if(!shouldContinue){console.log(`%c✅ Список ${type==="refunds"?"возвратов":"заказов"} проскролен ${count} раз и получен конец списка.`,"color: BurlyWood; font-size: 16px;");break}}}function getDirectTextContent(element){return Array.from(element.childNodes).filter((node=>node.nodeType===Node.TEXT_NODE)).map((node=>node.textContent.trim())).join("")}function checkAmount(type="orders"){const orderSpanElements=Array.from(document.querySelectorAll(type==="refunds"?"div":"span")).filter((el=>getDirectTextContent(el).trim().includes(type==="refunds"?completedRefundKeyWord:orderKeyWord)));let ordersAmounts=[];orderSpanElements.forEach((element=>{let parent=type==="refunds"?element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement:element.parentElement.parentElement.parentElement.parentElement;const amountElement=Array.from(parent.querySelectorAll(type==="refunds"?"div":"span")).find((span=>span.textContent&&span.textContent.trim().match(/^.*\d*[\s\u00A0]*\d+[\s\u00A0]*₽$/)));if(amountElement){const amountText=amountElement.textContent.replace(/\s|₽/g,"");const amount=parseInt(amountText,10);if(!isNaN(amount)){ordersAmounts.push(amount)}}}));return ordersAmounts}
    ```

5. После небольшого ожидания, скрипт выведет общую сумму выкупленных товаров прямо в консоли.

6. Если вы хотите учесть **возвраты**, вы можете дополнительно запустить скрипт [на странице возвратов](https://www.ozon.ru/my/returns) и вычесть полученную сумму.

## ℹ️ Примечания

Скрипт обрабатывает бесконечную прокрутку страницы и автоматически завершает работу, когда все элементы загружены.

Скрипт считает все ваши завершенные заказы, а после этого все ваши возвраты, и вычитает одну сумму из другой.

Автор не гарантирует 100% точность. Скрипт работает на основе данных, которые видит пользователь на сайте и также потенциально может содержать неточности. Результат не может быть использован в качестве документа для бухгалтерии, юридических целей или каких-либо других официальных документов.

Скрипт не сохраняет и не передает данные третьим лицам. Все данные обрабатываются локально на вашем устройстве.

## 🧑‍💻 Для разработчиков

- В случае изменения структуры страницы Ozon может потребоваться обновление селекторов в скрипте или адресов страниц.
- Если заметили ошибку или у вас есть предложения по улучшению скрипта, пожалуйста, создайте pull request.
- Исходники JavaScript лежат в [src/index.js](src/index.js) и обрабатываются ESLint и Prettier.
- Минифицированный код генерируются через Terser и лежит в `dist/index.min.js`.
- Минифицированный код вручную добавляется в `README.md` для удобства пользователей

После внесения изменений в исходный код, выполните следующие команды:

```bash
npm i
npm run minify
```
