async function run() {
  await loadAllOrders();
  checkAmount();
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

  console.log(`Scrolling ${count} times`, { orders: getCurentOrdersCount() });

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
  for (let i = 0; i < 100; i++) {
    const shouldContinue = await scrollIteration(i);
    if (!shouldContinue) {
      break;
    }
  }
}

function checkAmount() {
  const receivedElements = Array.from(document.querySelectorAll('span')).filter(
    (el) => el.textContent && el.textContent.trim().includes('Заказ от'),
  );

  let totalSum = 0;

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
      console.log({ amountText, amount });

      if (!isNaN(amount)) {
        totalSum += amount;
      }
    }
  });

  console.log(`Total sum of received orders: ${totalSum} ₽`);
}
