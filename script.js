// 判斷是否為運算符
function isOperator(c) {
    return c === '+' || c === '-' || c === '*' || c === '/' || c === '%';
}

// 獲取運算符的優先級
function precedence(c) {
    if (c === '+' || c === '-') return 1;
    if (c === '*' || c === '/' || c === '%') return 2;
    return 0;
}

// 將 infix 表達式轉換為 tokens
function tokenize(infix) {
    const tokens = [];
    let i = 0;

    while (i < infix.length) {
        if (/\s/.test(infix[i])) {
            i++;
            continue;
        }

        if (/\d/.test(infix[i])) {
            let val = '';
            while (i < infix.length && /\d/.test(infix[i])) {
                val += infix[i];
                i++;
            }
            tokens.push({ type: 'number', value: val });
        } else if (isOperator(infix[i]) || infix[i] === '(' || infix[i] === ')') {
            tokens.push({ type: 'operator', value: infix[i] });
            i++;
        } else {
            i++; // 跳過未知字符
        }
    }

    return tokens;
}

function check(value1, value2, rev) {
    if (rev == 0)
        return (precedence(value1) >= precedence(value2));
    else
        return (precedence(value1) > precedence(value2));
}

// 轉換為 postfix 的步驟記錄
function infixToPostfixSteps(tokens, rev) {
    const steps = [];
    const stack = [];
    const output = [];

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        if (token.type === 'number') {
            steps.push({ action: 'read', token, stack: [...stack], output: [...output], explanation: `Read the number ${token.value} and add it directly to the output.` });
            output.push(token);
            steps.push({ action: 'output', token, stack: [...stack], output: [...output], explanation: `Add the number ${token.value} to the output.` });
        } else if (token.value === '(') {
            steps.push({ action: 'read', token, stack: [...stack], output: [...output], explanation: `Read the left parenthesis '(', push it onto the stack.` });
            stack.push(token);
            steps.push({ action: 'push', token, stack: [...stack], output: [...output], explanation: `Push the left parenthesis '(' onto the stack.` });
        } else if (token.value === ')') {
            steps.push({ action: 'read', token, stack: [...stack], output: [...output], explanation: `Read the right parenthesis ')', start popping from the stack until the matching left parenthesis is found.` });
            while (stack.length > 0 && stack[stack.length - 1].value !== '(') {
                const popped = stack.pop();
                output.push(popped);
                steps.push({ action: 'pop', token: popped, stack: [...stack], output: [...output], explanation: `Pop the operator '${popped.value}' and add it to the output.` });
            }
            if (stack.length > 0 && stack[stack.length - 1].value === '(') {
                const leftParen = stack.pop();
                steps.push({ action: 'pop', token: leftParen, stack: [...stack], output: [...output], explanation: `Pop the left parenthesis '(' and discard it.` });
            }
        } else if (isOperator(token.value)) {
            steps.push({ action: 'read', token, stack: [...stack], output: [...output], explanation: `Read the operator '${token.value}'` });
            while (stack.length > 0 && stack[stack.length - 1].value !== '(' && check(stack[stack.length - 1].value, token.value, rev)) {
                const popped = stack.pop();
                output.push(popped);
                steps.push({ action: 'pop', token: popped, stack: [...stack], output: [...output], explanation: `Pop operators with higher or equal precedence (in this case, '${popped.value}') and add them to the output.` });
            }
            stack.push(token);
            steps.push({ action: 'push', token, stack: [...stack], output: [...output], explanation: `Push the operator '${token.value}' onto the stack.` });
        }
    }

    while (stack.length > 0) {
        const popped = stack.pop();
        output.push(popped);
        steps.push({ action: 'pop', token: popped, stack: [...stack], output: [...output], explanation: `Pop the remaining operator '${popped.value}' and add it to the output.` });
    }

    steps.push({ action: 'complete', stack: [], output: [...output], explanation: `Conversion complete!` });
    return { steps, output };
}

// 轉換為 prefix 的步驟記錄
function infixToPrefixSteps(infix) {
    const tokens = tokenize(infix);
    const reversedTokens = tokens.reverse().map(token => {
        if (token.value === '(') return { ...token, value: ')' };
        else if (token.value === ')') return { ...token, value: '(' };
        else return token;
    });

    const { steps: postfixSteps, output: postfixOutput } = infixToPostfixSteps(reversedTokens, 1);

    return {
        steps: [
            { action: 'init', explanation: `First, we reverse the tokens and swap the parentheses.` },
            ...postfixSteps,
            { action: 'reverse', output: [...postfixOutput].reverse(), explanation: `Finally, we reverse the postfix output to obtain the prefix expression.` }
        ],
        output: [...postfixOutput].reverse()
    };
}

function evaluatePostfix(postfixTokens) {
    const stack = [];
    for (const token of postfixTokens) {
        if (token.type === 'number') {
            stack.push(parseInt(token.value));
        } else if (isOperator(token.value)) {
            const n2 = stack.pop();
            const n1 = stack.pop();
            let result;
            switch (token.value) {
                case '+': result = n1 + n2; break;
                case '-': result = n1 - n2; break;
                case '*': result = n1 * n2; break;
                case '/': result = Math.floor(n1 / n2); break;
                case '%': result = n1 % n2; break;
            }
            stack.push(result);
        }
    }
    return stack[0];
}

function tokensToString(tokens) {
    return tokens.map(token => token.value).join(' ');
}

// ======= 全域變數與 DOM ======= //
let currentSteps = [];
let currentStepIndex = 0;
let animationInterval = null;

const infixInput = document.getElementById('infixInput');
const prefixBtn = document.getElementById('prefixBtn');
const postfixBtn = document.getElementById('postfixBtn');
const prevStepBtn = document.getElementById('prevStepBtn');
const nextStepBtn = document.getElementById('nextStepBtn');
const playBtn = document.getElementById('playBtn');
const resetBtn = document.getElementById('resetBtn');
const stackContainer = document.getElementById('stackContainer');
const outputContainer = document.getElementById('outputContainer');
const outputDisplay = document.getElementById('outputDisplay');
const explanationBox = document.getElementById('explanationBox');
const inputDisplay = document.getElementById('inputDisplay');
const prefixResult = document.getElementById('prefixResult');
const postfixResult = document.getElementById('postfixResult');
const evaluationResult = document.getElementById('evaluationResult');

// 顯示步驟
function displayStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= currentSteps.length) return;

    const step = currentSteps[stepIndex];
    explanationBox.textContent = step.explanation;
    stackContainer.innerHTML = '';
    outputContainer.innerHTML = '';

    if (step.stack) {
        step.stack.forEach((token, index) => {
            const stackItem = document.createElement('div');
            stackItem.className = 'stack-item';
            stackItem.textContent = token.value;
            stackContainer.appendChild(stackItem);
            if (step.action === 'push' && index === step.stack.length - 1 && token.value === step.token?.value) {
                stackItem.classList.add('pushed');
            }
        });
    }

    if (step.output) {
        step.output.forEach((token, index) => {
            const outputItem = document.createElement('div');
            outputItem.className = 'output-item';
            outputItem.textContent = token.value;
            outputContainer.appendChild(outputItem);
            setTimeout(() => outputItem.style.opacity = '1', index * 100);
        });
    }

    if (step.action === 'pop' && step.token) {
        const poppedItem = document.createElement('div');
        poppedItem.className = 'stack-item popped';
        poppedItem.textContent = step.token.value;
        poppedItem.style.position = 'absolute';
        poppedItem.style.bottom = '50%';
        stackContainer.appendChild(poppedItem);
        setTimeout(() => poppedItem.remove(), 500);
    }

    if (step.action === 'complete' || step.action === 'reverse') {
        outputDisplay.textContent = tokensToString(step.output);
    }

    prevStepBtn.disabled = stepIndex === 0;
    nextStepBtn.disabled = stepIndex === currentSteps.length - 1;
}

function nextStep() {
    if (currentStepIndex < currentSteps.length - 1) {
        currentStepIndex++;
        displayStep(currentStepIndex);
    } else {
        stopAnimation();
    }
}

function prevStep() {
    if (currentStepIndex > 0) {
        currentStepIndex--;
        displayStep(currentStepIndex);
    }
}

function startAnimation() {
    stopAnimation();
    playBtn.textContent = 'Pause';
    animationInterval = setInterval(() => {
        if (currentStepIndex < currentSteps.length - 1) {
            nextStep();
        } else {
            stopAnimation();
        }
    }, 1000);
}

function stopAnimation() {
    clearInterval(animationInterval);
    animationInterval = null;
    playBtn.textContent = 'Auto Play';
}

function resetVisualization() {
    stopAnimation();
    playBtn.textContent = 'Auto Play';
    infixInput.value = '';
    prefixResult.textContent = '-';
    postfixResult.textContent = '-';
    evaluationResult.textContent = '-';
    inputDisplay.innerHTML = '';
    stackContainer.innerHTML = '';
    outputContainer.innerHTML = '';
    outputDisplay.textContent = '';
    explanationBox.textContent = 'Please enter an infix expression and choose whether to convert it to prefix or postfix.';
    currentSteps = [];
    currentStepIndex = 0;
    prevStepBtn.disabled = true;
    nextStepBtn.disabled = true;
    prefixBtn.disabled = false;
    postfixBtn.disabled = false;
}

function handlePostfixConversion() {
    const infix = infixInput.value.trim();
    if (!infix) return alert('Please enter an infix expression.');
    inputDisplay.innerHTML = `Infix: ${infix}`;
    const tokens = tokenize(infix);
    const { steps, output } = infixToPostfixSteps(tokens, 0);
    currentSteps = steps;
    currentStepIndex = 0;
    postfixResult.textContent = tokensToString(output);
    try {
        evaluationResult.textContent = evaluatePostfix(output);
    } catch {
        evaluationResult.textContent = 'Calculation Error';
    }
    const { output: prefixOutput } = infixToPrefixSteps(infix);
    prefixResult.textContent = tokensToString(prefixOutput);
    prefixBtn.disabled = true;
    postfixBtn.disabled = true;
    displayStep(currentStepIndex);
}

function handlePrefixConversion() {
    const infix = infixInput.value.trim();
    if (!infix) return alert('Please enter an infix expression.');
    inputDisplay.innerHTML = `Infix: ${infix}`;
    const { steps, output } = infixToPrefixSteps(infix);
    currentSteps = steps;
    currentStepIndex = 0;
    prefixResult.textContent = tokensToString(output);
    const tokens = tokenize(infix);
    const { output: postfixOutput } = infixToPostfixSteps(tokens, 0);
    postfixResult.textContent = tokensToString(postfixOutput);
    try {
        evaluationResult.textContent = evaluatePostfix(postfixOutput);
    } catch {
        evaluationResult.textContent = 'Calculation Error';
    }
    prefixBtn.disabled = true;
    postfixBtn.disabled = true;
    displayStep(currentStepIndex);
}

// 初始化事件
prefixBtn.addEventListener('click', handlePrefixConversion);
postfixBtn.addEventListener('click', handlePostfixConversion);
prevStepBtn.addEventListener('click', prevStep);
nextStepBtn.addEventListener('click', nextStep);
playBtn.addEventListener('click', () => animationInterval ? stopAnimation() : startAnimation());
resetBtn.addEventListener('click', resetVisualization);
prevStepBtn.disabled = true;
nextStepBtn.disabled = true;

// Usage Modal 功能
document.addEventListener('DOMContentLoaded', function () {
    const usageButton = document.getElementById('usageButton');
    usageButton.addEventListener('click', function () {
        const modal = document.createElement('div');
        modal.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.7);z-index:1000;display:flex;justify-content:center;align-items:center;`;
        modal.classList.add('fade-in-bg');

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `background:white;border:3px solid #2c3e50;box-shadow:8px 8px 0 #ff5555;padding:30px;max-width:600px;width:80%;max-height:80%;overflow:auto;position:relative;`;
        modalContent.classList.add('scale-in-center');

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'X';
        closeBtn.style.cssText = `position:absolute;top:10px;right:10px;border:2px solid #2c3e50;background:#ff5555;color:white;font-weight:bold;width:30px;height:30px;cursor:pointer;display:flex;justify-content:center;align-items:center;`;

        const usageTitle = document.createElement('h2');
        usageTitle.textContent = 'Usage Instructions';
        usageTitle.style.borderBottom = '3px solid #ffdd59';

        const usageContent = document.createElement('div');
        usageContent.innerHTML = `
            <h3>How to Use the Converter:</h3>
            <ol>
                <li>Enter an infix expression.</li>
                <li>Click "CONVERT TO PREFIX" or "CONVERT TO POSTFIX".</li>
                <li>Click "NEXT STEP" step through or click "AUTO PLAY" to auto-play the conversion process.</li>
            </ol>
            <h3>Supported Operators:</h3>
            <ul>
                <li>+ (Addition)</li>
                <li>- (Subtraction)</li>
                <li>* (Multiplication)</li>
                <li>/ (Division)</li>
                <li>% (Modulo)</li>
                <li>( ) (Parentheses)</li>
            </ul>`;

        modalContent.append(closeBtn, usageTitle, usageContent);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        closeBtn.onclick = () => {
            modal.classList.remove('fade-in-bg');
            modal.classList.add('fade-out-bg');
        
            modalContent.classList.remove('scale-in-center');
            modalContent.classList.add('scale-out-center');
        
            setTimeout(() => {
                modal.remove();
            }, 300); // 等動畫跑完才 remove
        };        
        modal.onclick = e => {
            if (e.target === modal) {
                modal.classList.remove('fade-in-bg');
                modal.classList.add('fade-out-bg');
                modalContent.classList.remove('scale-in-center');
                modalContent.classList.add('scale-out-center');
                setTimeout(() => modal.remove(), 300);
            }
        };        
    });
});
