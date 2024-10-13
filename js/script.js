const API_KEY = '4e007091cb92d3f93bc8896b';
const API_URL = 'https://v6.exchangerate-api.com/v6/';

const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const convertBtn = document.getElementById('convertBtn');
const resultDiv = document.getElementById('result');
const currentRatesDiv = document.getElementById('currentRates');

const currencies = [
    { code: 'KZT', name: 'Казахстанский тенге' },
    { code: 'USD', name: 'Доллар США' },
    { code: 'EUR', name: 'Евро' },
    { code: 'RUB', name: 'Российский рубль' },
    { code: 'GBP', name: 'Британский фунт' },
];

function initializeCurrencySelects() {
    currencies.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency.code;
        option.textContent = `${currency.code} - ${currency.name}`;
        fromCurrencySelect.appendChild(option.cloneNode(true));
        toCurrencySelect.appendChild(option);
    });

    fromCurrencySelect.value = 'KZT';
    toCurrencySelect.value = 'USD';
}

async function fetchExchangeRates(baseCurrency) {
    try {
        const response = await fetch(`${API_URL}${API_KEY}/latest/${baseCurrency}`);
        const data = await response.json();
        return data.conversion_rates;
    } catch (error) {
        console.error('Ошибка при получении курсов валют:', error);
        return null;
    }
}

async function convertCurrency() {
    try {
        const amount = parseFloat(amountInput.value);
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;

        if (isNaN(amount)) {
            throw new Error('Пожалуйста, введите корректную сумму');
        }

        resultDiv.textContent = 'Загрузка...';

        const rates = await fetchExchangeRates(fromCurrency);
        if (!rates) {
            throw new Error('Не удалось получить курсы валют');
        }

        const rate = rates[toCurrency];
        if (typeof rate !== 'number') {
            throw new Error('Неверный курс валюты');
        }

        const convertedAmount = amount * rate;
        resultDiv.textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
    } catch (error) {
        console.error('Ошибка при конвертации:', error);
        resultDiv.textContent = `Ошибка: ${error.message}`;
    }
}

async function displayCurrentRates() {
    const baseCurrency = 'KZT';
    const targetCurrencies = ['USD', 'EUR', 'RUB'];

    currentRatesDiv.innerHTML = '';

    try {
        const rates = await fetchExchangeRates(baseCurrency);
        
        if (rates) {
            for (const target of targetCurrencies) {
                const rate = 1 / rates[target];
                const rateCard = document.createElement('div');
                rateCard.className = 'col-md-4 col-sm-6 mb-3';
                rateCard.innerHTML = `
                    <div class="rate-card">
                        <h3>${target}/${baseCurrency}</h3>
                        <p>${rate.toFixed(2)}</p>
                        <small>1 ${target} = ${rate.toFixed(2)} ${baseCurrency}</small>
                    </div>
                `;
                currentRatesDiv.appendChild(rateCard);
            }
        } else {
            throw new Error('Не удалось получить курсы валют');
        }
    } catch (error) {
        console.error('Ошибка при получении текущих курсов:', error);
        currentRatesDiv.innerHTML = '<p class="text-center">Не удалось загрузить текущие курсы валют.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeCurrencySelects();
    displayCurrentRates();
});

convertBtn.addEventListener('click', convertCurrency);