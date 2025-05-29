document.getElementById('convertBtn').addEventListener('click', convertNumber);

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
    
    // Validar o valor de entrada de acordo com a base
    if (!isValidInput(inputValue, fromBase)) {
        showError(`O valor digitado não é válido para a base ${fromBase}.`);
        return;
    }
    
    // Se a base de origem e destino forem iguais
    if (fromBase === toBase) {
        document.getElementById('result').value = inputValue;
        addStep(`A base de origem e destino são iguais (Base ${fromBase}), portanto o valor permanece o mesmo.`);
        return;
    }
    
    // Converter para decimal como passo intermediário (exceto se a origem já for decimal)
    let decimalValue;
    let steps = [];
    
    if (fromBase !== 10) {
        decimalValue = convertToDecimal(inputValue, fromBase, steps);
        if (decimalValue === null) return;
    } else {
        decimalValue = parseInt(inputValue, 10);
        addStep(`Valor decimal inicial: ${decimalValue}`);
    }
    
    // Se o destino for decimal, já terminamos
    if (toBase === 10) {
        document.getElementById('result').value = decimalValue.toString();
        return;
    }
    
    // Converter do decimal para a base de destino
    const result = convertFromDecimal(decimalValue, toBase, steps);
    document.getElementById('result').value = result;
    
    // Mostrar todos os passos
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
    
    steps.push(`Conversão de Base ${fromBase} para Decimal (Base 10):`);
    steps.push(`Valor original: ${value}`);
    steps.push(`Separando cada dígito e enumerando posições começando de 0 da direita para esquerda:`);
    
    let calculationParts = [];
    
    for (let i = 0; i < digits.length; i++) {
        let digitValue;
        if (fromBase === 16) {
            digitValue = parseInt(digits[i], 16);
        } else {
            digitValue = parseInt(digits[i]);
        }
        
        const power = Math.pow(fromBase, i);
        const term = `${digitValue} × ${fromBase}^${i} = ${digitValue * power}`;
        calculationParts.unshift(term); // Adiciona no início para manter a ordem original
        
        decimal += digitValue * power;
    }
    
    // Mostrar os termos em ordem original (da esquerda para direita)
    steps.push(...calculationParts.map((term, idx) => `Posição ${digits.length - 1 - idx}: ${term}`));
    
    steps.push(`Somando todos os termos: ${decimal}`);
    steps.push(`Resultado em decimal: ${decimal}`);
    
    return decimal;
}

function convertFromDecimal(decimalValue, toBase, steps) {
    steps.push(`<br>Conversão de Decimal (Base 10) para Base ${toBase}:`);
    steps.push(`Valor decimal: ${decimalValue}`);
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
    
    // Converter restos para a base correta (especialmente para hexadecimal)
    const convertedRemainders = remainders.map(r => {
        if (toBase === 16) {
            return r.toString(16).toUpperCase();
        }
        return r.toString();
    });
    
    steps.push(`Restos coletados em ordem inversa: ${convertedRemainders.reverse().join(', ')}`);
    
    const result = convertedRemainders.reverse().join('');
    steps.push(`Resultado final (lendo os restos de baixo para cima): ${result}`);
    
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
    document.getElementById('conversionSteps').innerHTML = 
        `<div class="step error">${message}</div>`;
}