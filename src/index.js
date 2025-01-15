const maxScrolls = 200;

const refundKeyWord = 'Заявка на возврат';
const refundUrlKeyWord = 'returns';
const completedRefundKeyWord = 'Деньги отправлены';
const orderKeyWord = 'Заказ от';

async function run() {
  const type = window.location.href.includes(refundUrlKeyWord)
    ? 'refunds'
    : 'orders';

  await loadAllOrders(type);
  const ordersAmounts = checkAmount(type);

  printResults(ordersAmounts, type);
}

run();

function printResults(ordersAmounts, type) {
  const ordersAmount = ordersAmounts.reduce((acc, amount) => acc + amount, 0);

  console.log('=============================');
  console.log(
    `%c✅ Найдено ${ordersAmounts.length} ${type === 'refunds' ? 'возвратов, где были отправлены деньги' : 'заказов'}, список их сумм от самого дорогого к самому дешевому:`,
    'color: BurlyWood; font-size: 14px;',
  );
  console.log(
    `%c${ordersAmounts.sort((a, b) => b - a).join(', ')}`,
    'color: BurlyWood; font-size: 12px;',
  );
  console.log('=============================');
  console.log(
    `%c📦 Итоговая сумма ${type === 'refunds' ? 'возвратов' : 'заказов'}:`,
    'color: ForestGreen; font-size: 16px; font-weight: bold;',
  );
  console.log(
    `%c💰 ${ordersAmount} ₽`,
    'color: DarkOrange; font-size: 32px; font-weight: bold;',
  );
  console.log('=============================');
  console.log(
    `%c✅ КОНЕЦ`,
    'color: BurlyWood; font-size: 20; font-weight: bold;',
  );
  console.log('=============================');
}

function getCurrentOrdersCount(type) {
  return Array.from(document.querySelectorAll('span')).filter(
    (el) =>
      el.textContent &&
      el.textContent
        .trim()
        .includes(type === 'refunds' ? refundKeyWord : orderKeyWord),
  ).length;
}

function waitFor(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

/**
 * Scroll the page and check if the number of orders has changed
 *
 * @param count Number of current iteration
 * @param type 'orders' or 'refunds'
 * @returns {Promise<boolean>} Is next scroll needed
 */
async function scrollIteration(count, type = 'orders') {
  const timeout = 300; // Adjust timeout if needed
  let prevOrdersCount = getCurrentOrdersCount(type);

  window.scrollBy(0, 1000);
  await waitFor(timeout);
  window.scrollBy(0, 1000);
  await waitFor(timeout);

  if (count > maxScrolls) {
    console.error(
      `%c⚠️ Слишком большое количество попыток проскроллить страницу, допустимый максимум ${maxScrolls}. Завершение скрипта`,
      'color: Crimson; font-size: 24px; font-weight: bold;',
    );
    throw new Error('Too many scrolls');
  }

  console.clear();
  console.log(
    `%c⏳ Список ${type === 'refunds' ? 'возвратов' : 'заказов'} проскролен ${count} раз, продолжаю скролить, подождите...`,
    'color: BurlyWood; font-size: 16px;',
  );

  if (getCurrentOrdersCount(type) !== prevOrdersCount) {
    return true;
  }

  // wait for content to be loaded for the case when it is not loaded yet
  await waitFor(2000);
  if (getCurrentOrdersCount(type) !== prevOrdersCount) {
    return true;
  }

  // wait for content to be loaded for the case when it is not loaded yet
  await waitFor(2000);
  if (getCurrentOrdersCount(type) !== prevOrdersCount) {
    return true;
  }

  return false;
}

async function loadAllOrders(type = 'orders') {
  for (let count = 1; count < maxScrolls; count++) {
    const shouldContinue = await scrollIteration(count, type);
    if (!shouldContinue) {
      console.log(
        `%c✅ Список ${type === 'refunds' ? 'возвратов' : 'заказов'} проскролен ${count} раз и получен конец списка.`,
        'color: BurlyWood; font-size: 16px;',
      );
      break;
    }
  }
}

function getDirectTextContent(element) {
  return Array.from(element.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent.trim())
    .join('');
}

function checkAmount(type = 'orders') {
  const orderSpanElements = Array.from(
    document.querySelectorAll(type === 'refunds' ? 'div' : 'span'),
  ).filter((el) =>
    getDirectTextContent(el)
      .trim()
      .includes(type === 'refunds' ? completedRefundKeyWord : orderKeyWord),
  );

  let ordersAmounts = [];

  orderSpanElements.forEach((element) => {
    let parent =
      type === 'refunds'
        ? element.parentElement.parentElement.parentElement.parentElement
            .parentElement.parentElement
        : element.parentElement.parentElement.parentElement.parentElement;

    const amountElement = Array.from(
      parent.querySelectorAll(type === 'refunds' ? 'div' : 'span'),
    ).find(
      (span) =>
        span.textContent &&
        span.textContent.trim().match(/^.*\d*[\s\u00A0]*\d+[\s\u00A0]*₽$/),
    );

    if (amountElement) {
      // Extract the amount, remove non-numeric characters, and parse it as an integer
      const amountText = amountElement.textContent.replace(/\s|₽/g, '');
      const amount = parseInt(amountText, 10);

      if (!isNaN(amount)) {
        ordersAmounts.push(amount);
      }
    }
  });

  return ordersAmounts;
}
