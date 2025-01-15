const maxScrolls = 200;

async function run() {
  await loadAllOrders();
  const ordersAmounts = checkAmount();

  console.log('=============================');
  console.log(
    `%c✅ Найдено ${ordersAmounts.length} заказов, список их сумм от самого дорогого к самому дешевому:`,
    'color: BurlyWood; font-size: 14px;',
  );
  console.log(
    `%c${ordersAmounts.sort((a, b) => b - a).join(', ')}`,
    'color: BurlyWood; font-size: 12px;',
  );
  console.log('=============================');
  console.log(
    '%c📦 Итоговая сумма заказов:',
    'color: ForestGreen; font-size: 16px; font-weight: bold;',
  );
  console.log(
    '%c💰 3407 ₽',
    'color: DarkOrange; font-size: 20px; font-weight: bold;',
  );
  console.log('=============================');
  console.log(
    '%c📦 Итоговая сумма возвратов:',
    'color: ForestGreen; font-size: 16px; font-weight: bold;',
  );
  console.log(
    '%c💰 3407 ₽',
    'color: DarkOrange; font-size: 20px; font-weight: bold;',
  );
  console.log('=============================');
  console.log(
    '%c📦 Итоговая сумма выкупа:',
    'color: ForestGreen; font-size: 16px; font-weight: bold;',
  );
  console.log(
    '%c💰 3407 ₽',
    'color: DarkOrange; font-size: 20px; font-weight: bold;',
  );
  console.log('=============================');
  console.log(
    `%c✅ КОНЕЦ`,
    'color: BurlyWood; font-size: 32px; font-weight: bold;',
  );
}

run();

function getCurentOrdersCount() {
  return Array.from(document.querySelectorAll('span')).filter(
    (el) => el.textContent && el.textContent.trim().includes('Заказ от'),
  ).length;
}

function waitFor(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

/**
 * Scroll the page and check if the number of orders has changed
 *
 * @param count Number of current iteration
 * @returns {Promise<boolean>} Is next scroll needed
 */
async function scrollIteration(count) {
  const timeout = 300; // Adjust timeout if needed
  let prevOrdersCount = getCurentOrdersCount();

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
    `%c⏳ Список заказов проскролен ${count} раз, продолжаю скролить, подождите...`,
    'color: BurlyWood; font-size: 16px;',
  );

  if (getCurentOrdersCount() !== prevOrdersCount) {
    return true;
  }

  // wait for content to be loaded for the case when it is not loaded yet
  await waitFor(2000);
  if (getCurentOrdersCount() !== prevOrdersCount) {
    return true;
  }

  // wait for content to be loaded for the case when it is not loaded yet
  await waitFor(2000);
  if (getCurentOrdersCount() !== prevOrdersCount) {
    return true;
  }

  return false;
}

async function loadAllOrders() {
  for (let count = 1; count < maxScrolls; count++) {
    const shouldContinue = await scrollIteration(count);
    if (!shouldContinue) {
      console.log(
        `%c✅ Список заказов проскролен ${count} раз и получен конец списка.`,
        'color: BurlyWood; font-size: 16px;',
      );
      break;
    }
  }
}

function checkAmount() {
  const receivedElements = Array.from(document.querySelectorAll('span')).filter(
    (el) => el.textContent && el.textContent.trim().includes('Заказ от'),
  );

  let ordersAmounts = [];

  receivedElements.forEach((element) => {
    let parent =
      element.parentElement.parentElement.parentElement.parentElement;

    const amountElement = Array.from(parent.querySelectorAll('span')).find(
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
