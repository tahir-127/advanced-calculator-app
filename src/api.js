const apiKey = 'YOUR_API_KEY';
const apiUrl = 'https://api.exchangerate-api.com/v4/latest/';
const cache = {};

export async function getExchangeRate(from, to) {
    const cacheKey = `${from}_${to}`;
    if (cache[cacheKey]) {
        return cache[cacheKey];
    }

    try {
        const response = await fetch(`${apiUrl}${from}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const rate = data.rates[to];
        cache[cacheKey] = rate;
        return rate;
    } catch (error) {
        console.error('Currency Conversion Error:', error);
        return null;
    }
}

export async function convertCurrency(amount, from, to) {
    const rate = await getExchangeRate(from, to);
    if (rate === null) {
        return null;
    }
    return amount * rate;
}

export async function getMultipleExchangeRates(from, toCurrencies) {
    try {
        const response = await fetch(`${apiUrl}${from}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const rates = {};
        toCurrencies.forEach(to => {
            rates[to] = data.rates[to];
        });
        return rates;
    } catch (error) {
        console.error('Currency Conversion Error:', error);
        return null;
    }
}
