import { convertCurrency } from './api.js';

let displayValue = '0';
let memoryValue = 0;
let operator = null;
let waitingForSecondValue = false;

const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const themeToggle = document.getElementById('theme-toggle');
const convertCurrencyButton = document.getElementById('convert-currency');

function updateDisplay() {
    display.textContent = displayValue;
}

function handleNumber(number) {
    if (waitingForSecondValue) {
        displayValue = number;
        waitingForSecondValue = false;
    } else {
        displayValue = displayValue === '0' ? number : displayValue + number;
    }
}

function handleOperator(nextOperator) {
    const value = parseFloat(displayValue);

    if (operator && waitingForSecondValue) {
        operator = nextOperator;
        return;
    }

    if (operator) {
        const result = performCalculation[operator](memoryValue, value);
        displayValue = `${parseFloat(result.toFixed(7))}`;
        memoryValue = result;
    } else {
        memoryValue = value;
    }

    waitingForSecondValue = true;
    operator = nextOperator;
}

const performCalculation = {
    '/': (firstValue, secondValue) => firstValue / secondValue,
    '*': (firstValue, secondValue) => firstValue * secondValue,
    '+': (firstValue, secondValue) => firstValue + secondValue,
    '-': (firstValue, secondValue) => firstValue - secondValue,
    '=': (firstValue, secondValue) => secondValue,
    'sin': (value) => Math.sin(value),
    'cos': (value) => Math.cos(value),
    'tan': (value) => Math.tan(value),
    'log': (value) => Math.log(value),
    'exp': (value) => Math.exp(value)
};

function handleMemory(action) {
    const value = parseFloat(displayValue);
    switch (action) {
        case 'MC':
            memoryValue = 0;
            break;
        case 'MR':
            displayValue = `${memoryValue}`;
            break;
        case 'M+':
            memoryValue += value;
            break;
        case 'M-':
            memoryValue -= value;
            break;
    }
}

function clearDisplay() {
    displayValue = '0';
    memoryValue = 0;
    operator = null;
    waitingForSecondValue = false;
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const { textContent: value } = button;

        if (parseFloat(value) >= 0 || value === '.') {
            handleNumber(value);
        } else if (value in performCalculation) {
            handleOperator(value);
        } else if (value === 'C') {
            clearDisplay();
        } else if (['MC', 'MR', 'M+', 'M-'].includes(value)) {
            handleMemory(value);
        }

        updateDisplay();
    });
});

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    themeToggle.textContent = document.body.classList.contains('light-theme') ? '🌞' : '🌙';
});

convertCurrencyButton.addEventListener('click', async () => {
    const amount = parseFloat(displayValue);
    const fromCurrency = prompt('Enter the base currency (e.g., USD):');
    const toCurrency = prompt('Enter the target currency (e.g., EUR):');
    const convertedAmount = await convertCurrency(amount, fromCurrency, toCurrency);
    if (convertedAmount !== null) {
        displayValue = `${convertedAmount.toFixed(2)}`;
        updateDisplay();
    } else {
        alert('Currency conversion failed. Please try again.');
    }
});

updateDisplay();
