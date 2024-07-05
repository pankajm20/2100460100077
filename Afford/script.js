const windowSize = 10;
let numberWindow = [];

async function fetchNumbers(type) {
  const apiMap = {
    'p': 'http://20.244.56.144/test/primes',
    'f': 'http://20.244.56.144/test/fibo',
    'e': 'http://20.244.56.144/test/even',
    'r': 'http://20.244.56.144/test/rand'
  };

  const url = apiMap[type];

  if (!url) {
    console.error("Invalid type specified.");
    return;
  }

  const prevState = [...numberWindow];

  try {
    const response = await fetchWithTimeout(url, 500);
    const data = await response.json();
    const newNumbers = data.numbers.filter(num => !numberWindow.includes(num));

    numberWindow = [...numberWindow, ...newNumbers];
    if (numberWindow.length > windowSize) {
      numberWindow = numberWindow.slice(numberWindow.length - windowSize);
    }

    const average = numberWindow.length ? (numberWindow.reduce((a, b) => a + b, 0) / numberWindow.length).toFixed(2) : 0;

    displayResponse(prevState, numberWindow, newNumbers, average);
  } catch (error) {
    console.error("Error fetching numbers:", error);
  }
}

function fetchWithTimeout(url, timeout) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), timeout)
    )
  ]);
}

function displayResponse(prevState, currState, newNumbers, average) {
  const responseElement = document.getElementById("response");
  responseElement.textContent = JSON.stringify({
    windowPrevState: prevState,
    windowCurrState: currState,
    numbers: newNumbers,
    avg: average
  }, null, 2);
}