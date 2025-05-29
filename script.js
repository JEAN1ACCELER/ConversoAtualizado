document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('convertBtn').addEventListener('click', convertNumber);
});

function convertNumber() {
    const inputValue = document.getElementById('inputValue').value.trim();
    const fromBase = parseInt(document.getElementById('fromBase').value);
    const toBase = parseInt(document.getElementById('toBase').value);
    
    const stepsContainer = document.getElementById('conversionSteps');
    stepsContainer.innerHTML = '';
    
    if (!inputValue) {
        showError("Por favor, digite um valor para converter.");
        return;
    }
    
    if (!isValidInput(inputValue, fromBase)) {
        showError(`O valor digitado não é válido para a base ${fromBase}.`);
        return;
    }
    
    if (fromBase === toBase) {
        document.getElementById('result').value = inputValue;
        addStep(`A base de origem e destino são iguais (Base ${fromBase}), portanto o valor permanece o mesmo.`);
        return;
    }
    
    let decimalValue;
    let steps = [];
    
    if (fromBase !== 10) {
        decimalValue = convertToDecimal(inputValue, fromBase, steps);
        if (decimalValue === null) return;
    } else {
        decimalValue = parseInt(inputValue, 10);
        addStep(`Valor decimal inicial: ${decimalValue}`);
    }
    
    if (toBase === 10) {
        document.getElementById('result').value = decimalValue.toString();
        return;
    }
    
    const result = convertFromDecimal(decimalValue, toBase, steps);
    document.getElementById('result').value = result;
    
    steps.forEach(step => addStep(step));
}

function isValidInput(value, base) {
    const validChars = {
        2: /^[01]+$/,
        8: /^[0-7]+$/,
        10: /^-?\d+$/,
        16: /^[0-9a-fA-F]+$/
    };
    return validChars[base].test(value);
}

function convertToDecimal(value, fromBase, steps) {
    value = value.toUpperCase();
    let decimal = 0;
    const digits = value.split('').reverse();
    
    steps.push(`<strong>Conversão de Base ${fromBase} para Decimal (Base 10):</strong>`);
    steps.push(`Valor original: <code>${value}</code>`);
    steps.push(`Separando cada dígito e enumerando posições começando de 0 da direita para esquerda:`);
    
    let calculationParts = [];
    
    for (let i = 0; i < digits.length; i++) {
        let digitValue = parseInt(digits[i], fromBase);
        const power = Math.pow(fromBase, i);
        const term = `${digitValue} × ${fromBase}^${i} = ${digitValue * power}`;
        calculationParts.unshift(term);
        decimal += digitValue * power;
    }
    
    steps.push(...calculationParts.map((term, idx) => 
        `Posição ${digits.length - 1 - idx}: ${term}`));
    
    steps.push(`<strong>Somando todos os termos:</strong> ${decimal}`);
    steps.push(`<strong>Resultado em decimal:</strong> ${decimal}`);
    
    return decimal;
}

function convertFromDecimal(decimalValue, toBase, steps) {
    steps.push(`<br><strong>Conversão de Decimal (Base 10) para Base ${toBase}:</strong>`);
    steps.push(`Valor decimal: <code>${decimalValue}</code>`);
    steps.push(`Dividindo sucessivamente por ${toBase} e registrando os restos:`);
    
    let value = decimalValue;
    let remainders = [];
    
    if (value === 0) {
        remainders = [0];
    } else {
        while (value > 0) {
            const remainder = value % toBase;
            const quotient = Math.floor(value / toBase);
            steps.push(`${value} ÷ ${toBase} = ${quotient} com resto ${remainder}`);
            remainders.push(remainder);
            value = quotient;
        }
    }
    
    const convertedRemainders = remainders.map(r => 
        toBase === 16 ? r.toString(16).toUpperCase() : r.toString());
    
    steps.push(`<strong>Restos coletados em ordem inversa:</strong> ${convertedRemainders.reverse().join(', ')}`);
    
    const result = convertedRemainders.reverse().join('');
    steps.push(`<strong>Resultado final</strong> (lendo os restos de baixo para cima): <code>${result}</code>`);
    
    return result;
}

function addStep(stepText) {
    const stepDiv = document.createElement('div');
    stepDiv.className = 'step';
    stepDiv.innerHTML = stepText;
    document.getElementById('conversionSteps').appendChild(stepDiv);
}

function showError(message) {
    document.getElementById('result').value = '';
    const errorDiv = document.createElement('div');
    errorDiv.className = 'step error';
    errorDiv.textContent = message;
    document.getElementById('conversionSteps').appendChild(errorDiv);
}
