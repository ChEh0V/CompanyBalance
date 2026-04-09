window.onload = function() {
    let a = '';
    let b = '';
    let expressionResult = '';
    let selectedOperation = null;

    let bgColors = ['#303030', '#e5e5e5'];
    let bgIndex = 0;

    let outputColors = ['#ffffff', '#ffeb3b', '#ff9800', '#4caf50', '#f44336'];
    let outputColorIndex = 0;

    let memoryValue = 0;

    const outputElement = document.getElementById("result");

    const digitButtons = document.querySelectorAll('[id^="btn_digit_"]');

    function onDigitButtonClicked(digit) {
        if (!selectedOperation) {
            if ((digit != '.') || (digit == '.' && !a.includes('.'))) {
                a += digit;
            }
            outputElement.innerHTML = a || '0';
        }
        else {
            if ((digit != '.') || (digit == '.' && !b.includes('.'))) {
                b += digit;
                outputElement.innerHTML = b;
            }
        }
    }

    function factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    digitButtons.forEach(button => {
        button.onclick = function() {
            const digitValue = button.innerHTML;
            onDigitButtonClicked(digitValue);
        }
    });

    document.getElementById("btn_op_mult").onclick = function() {
        if (a === '') return;
        selectedOperation = '×';
        outputElement.innerHTML = a + ' ×';
    }

    document.getElementById("btn_op_plus").onclick = function() {
        if (a === '') return;
        selectedOperation = '+';
        outputElement.innerHTML = a + ' +';
    }

    document.getElementById("btn_op_minus").onclick = function() {
        if (a === '') return;
        selectedOperation = '-';
        outputElement.innerHTML = a + ' -';
    }

    document.getElementById("btn_op_div").onclick = function() {
        if (a === '') return;
        selectedOperation = '÷';
        outputElement.innerHTML = a + ' ÷';
    }

    document.getElementById("btn_op_sign").onclick = function() {
        if (!selectedOperation) {
            if (a !== '') {
                a = (parseFloat(a) * -1).toString();
                outputElement.innerHTML = a;
            }
        } else {
            if (b !== '') {
                b = (parseFloat(b) * -1).toString();
                outputElement.innerHTML = b;
            }
        }
    }

    document.getElementById("btn_op_percent").onclick = function() {
        if (!selectedOperation) {
            if (a !== '') {
                a = (parseFloat(a) / 100).toString();
                outputElement.innerHTML = a;
            }
        } else {
            if (a !== '' && b !== '') {
                const percent = (parseFloat(b) / 100) * parseFloat(a);
                b = percent.toString();
                outputElement.innerHTML = b;
            } else if (b !== '') {
                b = (parseFloat(b) / 100).toString();
                outputElement.innerHTML = b;
            }
        }
    }

    document.getElementById("btn_op_clear").onclick = function() {
        a = '';
        b = '';
        selectedOperation = null;
        expressionResult = '';
        outputElement.innerHTML = '0';
    }

    document.getElementById("btn_op_equal").onclick = function() {
        if (a === '' || b === '' || selectedOperation === null) {
            if (a !== '' && selectedOperation === null) {
                return;
            }
            return;
        }

        const numA = parseFloat(a);
        const numB = parseFloat(b);

        switch(selectedOperation) {
            case '×':
                expressionResult = numA * numB;
                break;
            case '+':
                expressionResult = numA + numB;
                break;
            case '-':
                expressionResult = numA - numB;
                break;
            case


'÷':
                if (numB === 0) {
                    alert("Ошибка: деление на ноль!");
                    return;
                }
                expressionResult = numA / numB;
                break;
            default:
                return;
        }

        a = expressionResult.toString();
        b = '';
        selectedOperation = null;

        outputElement.innerHTML = a;
    }

    document.getElementById("btn_backspace").onclick = function() {
        if (!selectedOperation) {
            if (a !== '') {
                a = a.slice(0, -1);
                outputElement.innerHTML = a || '0';
            }
        } else {
            if (b !== '') {
                b = b.slice(0, -1);
                outputElement.innerHTML = b || '0';
            }
        }
    }

    document.getElementById("btn_change_bg").onclick = function() {
        bgIndex = (bgIndex + 1) % bgColors.length;
        document.body.style.backgroundColor = bgColors[bgIndex];
        document.querySelector('.calculator_body').style.backgroundColor = bgColors[bgIndex];
    }

    document.getElementById("btn_sqrt").onclick = function() {
        let currentNumber;
        if (!selectedOperation) {
            currentNumber = a;
        } else {
            currentNumber = b;
        }

        if (currentNumber !== '' && parseFloat(currentNumber) >= 0) {
            const sqrtValue = Math.sqrt(parseFloat(currentNumber));
            if (!selectedOperation) {
                a = sqrtValue.toString();
                outputElement.innerHTML = a;
            } else {
                b = sqrtValue.toString();
                outputElement.innerHTML = b;
            }
        } else if (parseFloat(currentNumber) < 0) {
            alert("Ошибка: нельзя извлечь корень из отрицательного числа!");
        }
    }

    document.getElementById("btn_square").onclick = function() {
        let currentNumber;
        if (!selectedOperation) {
            currentNumber = a;
        } else {
            currentNumber = b;
        }

        if (currentNumber !== '') {
            const squareValue = Math.pow(parseFloat(currentNumber), 2);
            if (!selectedOperation) {
                a = squareValue.toString();
                outputElement.innerHTML = a;
            } else {
                b = squareValue.toString();
                outputElement.innerHTML = b;
            }
        }
    }

    document.getElementById("btn_factorial").onclick = function() {
        let currentNumber;
        if (!selectedOperation) {
            currentNumber = a;
        } else {
            currentNumber = b;
        }

        if (currentNumber !== '') {
            const num = parseFloat(currentNumber);
            if (Number.isInteger(num) && num >= 0) {
                const factValue = factorial(num);
                if (!selectedOperation) {
                    a = factValue.toString();
                    outputElement.innerHTML = a;
                } else {
                    b = factValue.toString();
                    outputElement.innerHTML = b;
                }
            } else {
                alert("Ошибка: факториал можно вычислить только для целых неотрицательных чисел!");
            }
        }
    }

    document.getElementById("btn_triple_zero").onclick = function() {
        if (!selectedOperation) {
            if (a === '0') {
                a = '000';
            } else {
                a += '000';
            }
            outputElement.innerHTML = a;
        } else {
            if (b === '0') {
                b = '000';
            } else {
                b += '000';
            }
            outputElement.innerHTML = b;
        }
    }

    document.getElementById("btn_accum_plus").onclick = function() {
        let currentValue;
        if (!selectedOperation && a !== '') {
            currentValue = parseFloat(a);
        } else if (selectedOperation && b !== '') {


currentValue = parseFloat(b);
        } else if (expressionResult !== '') {
            currentValue = parseFloat(expressionResult);
        } else {
            return;
        }
        memoryValue += currentValue;
        outputElement.innerHTML = 'M+ ' + memoryValue;
        setTimeout(() => {
            if (!selectedOperation) {
                outputElement.innerHTML = a || '0';
            } else {
                outputElement.innerHTML = b || '0';
            }
        }, 1000);
    }

    document.getElementById("btn_accum_minus").onclick = function() {
        let currentValue;
        if (!selectedOperation && a !== '') {
            currentValue = parseFloat(a);
        } else if (selectedOperation && b !== '') {
            currentValue = parseFloat(b);
        } else if (expressionResult !== '') {
            currentValue = parseFloat(expressionResult);
        } else {
            return;
        }
        memoryValue -= currentValue;
        outputElement.innerHTML = 'M- ' + memoryValue;
        setTimeout(() => {
            if (!selectedOperation) {
                outputElement.innerHTML = a || '0';
            } else {
                outputElement.innerHTML = b || '0';
            }
        }, 1000);
    }

    document.getElementById("btn_change_output").onclick = function() {
        outputColorIndex = (outputColorIndex + 1) % outputColors.length;
        outputElement.style.backgroundColor = outputColors[outputColorIndex];
        if (outputColorIndex === 0) {
            outputElement.style.color = '#000000';
        } else {
            outputElement.style.color = '#ffffff';
        }
    }

    document.getElementById("btn_foundation").onclick = function() {
        let currentValue;
        if (!selectedOperation) {
            currentValue = a;
        } else {
            currentValue = b;
        }
        if (currentValue === '') {
            alert("Введите выручку от услуг (руб.)");
            return;
        }
        const revenue = parseFloat(currentValue);
        if (isNaN(revenue) || revenue <= 0) {
            alert("Ошибка: выручка должна быть положительным числом");
            return;
        }
        let additionalCapital;
        if (revenue <= 100000) {
            additionalCapital = revenue * 0.20;      // 20% для малой выручки
        } else if (revenue <= 500000) {
            additionalCapital = revenue * 0.15;      // 15% для средней
        } else {
            additionalCapital = revenue * 0.10;      // 10% для крупной
        }
        additionalCapital = Math.round(additionalCapital * 100) / 100;
        const message = `Выручка от услуг: ${revenue} руб.\nРекомендуемый добавочный капитал: ${additionalCapital} руб.`;
        alert(message);
        if (!selectedOperation) {
            a = additionalCapital.toString();
            outputElement.innerHTML = a;
        } else {
            b = additionalCapital.toString();
            outputElement.innerHTML = b;
        }
    };
};
