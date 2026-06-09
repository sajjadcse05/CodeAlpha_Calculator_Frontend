// State Tracking Containers
let executionString = "";      // Mathematical tokens parsed ready for execution string processing
let visualDisplayString = "";   // Text string presented seamlessly within the expression display window
let clearScreenOnNextInput = false;

// DOM Selectors
const expressionDisplay = document.getElementById('expression-display');
const resultDisplay = document.getElementById('result-display');
const buttonMatrixContainer = document.querySelector('.calculator-buttons');

// Central Input Traffic Controller
buttonMatrixContainer.addEventListener('click', (e) => {
    const activeTarget = e.target.closest('.btn');
    if (!activeTarget) return;

    processInput(activeTarget);
});

// Structural Matrix Route Actions Mapping
function processInput(btnNode) {
    const isNum = btnNode.classList.contains('num-btn') && !btnNode.hasAttribute('data-action');
    const isOp = btnNode.classList.contains('op-btn') || btnNode.hasAttribute('data-operator');
    const action = btnNode.dataset.action;

    if (clearScreenOnNextInput && (isNum || action === 'decimal')) {
        hardResetSystem();
    }
    clearScreenOnNextInput = false;

    if (isNum) {
        appendNumericToken(btnNode.textContent.trim());
    } else if (isOp) {
        const rawOp = btnNode.dataset.operator;
        const displayOp = btnNode.dataset.display || btnNode.textContent.trim();
        appendOperatorToken(rawOp, displayOp);
    } else if (action === 'decimal') {
        appendDecimalToken();
    } else if (action === 'clear') {
        hardResetSystem();
    } else if (action === 'delete') {
        popLastToken();
    } else if (action === 'calculate') {
        evaluateExpression();
    }
    
    synchronizeDisplay();
}

// Token Processing Logics
function appendNumericToken(digit) {
    // Stop consecutive zero overflow bugs
    if (executionString === "0" && digit === "0") return;
    
    if (executionString === "0") {
        executionString = digit;
        visualDisplayString = digit;
    } else {
        executionString += digit;
        visualDisplayString += digit;
    }
    calculateLivePreview();
}

function appendOperatorToken(rawOp, displayOp) {
    if (executionString === "") {
        // Fallback option allowing quick chained calculations starting from absolute 0
        executionString = "0";
        visualDisplayString = "0";
    }

    const lastChar = executionString.slice(-1);
    const operatorsList = ['+', '-', '*', '/', '%'];

    // Overwrite the last operator if a user changes their mind mid-expression
    if (operatorsList.includes(lastChar)) {
        executionString = executionString.slice(0, -1) + rawOp;
        visualDisplayString = visualDisplayString.slice(0, -1) + displayOp;
    } else {
        executionString += rawOp;
        visualDisplayString += displayOp;
    }
}

function appendDecimalToken() {
    const currentTokens = executionString.split(/[\+\-\*\/\%]/);
    const activeSegment = currentTokens[currentTokens.length - 1];

    // Prevent duplicate decimals within the same number segment
    if (activeSegment.includes('.')) return;

    if (activeSegment === "" || executionString === "") {
        executionString += "0.";
        visualDisplayString += "0.";
    } else {
        executionString += ".";
        visualDisplayString += ".";
    }
}

function popLastToken() {
    if (executionString.length > 0) {
        executionString = executionString.slice(0, -1);
        visualDisplayString = visualDisplayString.slice(0, -1);
    }
    calculateLivePreview();
}

function hardResetSystem() {
    executionString = "";
    visualDisplayString = "";
    resultDisplay.textContent = "0";
}

// Live Math Preview Parser Engine
function calculateLivePreview() {
    if (executionString === "") {
        resultDisplay.textContent = "0";
        return;
    }
    
    const lastChar = executionString.slice(-1);
    if (['+', '-', '*', '/', '%', '.'].includes(lastChar)) return;

    try {
        // Safely parse expressions using Function evaluation instead of global eval()
        const computedResult = safeEvalEngine(executionString);
        if (isFinite(computedResult)) {
            resultDisplay.textContent = sanitizeOutputLength(computedResult);
        }
    } catch (e) {
        // Suppress errors during live tracking updates
    }
}

// Finalization Expression Processor
function evaluateExpression() {
    if (executionString === "") return;

    const lastChar = executionString.slice(-1);
    if (['+', '-', '*', '/', '%'].includes(lastChar)) {
        executionString = executionString.slice(0, -1);
        visualDisplayString = visualDisplayString.slice(0, -1);
    }

    try {
        const finalOutput = safeEvalEngine(executionString);
        
        if (!isFinite(finalOutput) || isNaN(finalOutput)) {
            resultDisplay.textContent = "Error";
        } else {
            resultDisplay.textContent = sanitizeOutputLength(finalOutput);
            // Lock state context configuration to handle post-evaluation changes cleanly
            executionString = finalOutput.toString();
            visualDisplayString = executionString;
            clearScreenOnNextInput = true;
        }
    } catch (error) {
        resultDisplay.textContent = "Error";
    }
}

function safeEvalEngine(str) {
    return new Function(`return (${str})`)();
}

function sanitizeOutputLength(num) {
    // Handle floating-point precision issues (e.g., 0.1 + 0.2)
    const precisionFixed = parseFloat(num.toFixed(10));
    
    if (precisionFixed.toString().length > 12) {
        if (Math.abs(precisionFixed) > 1e12 || Math.abs(precisionFixed) < 1e-6) {
            return precisionFixed.toExponential(5);
        }
    }
    return precisionFixed;
}

function synchronizeDisplay() {
    expressionDisplay.textContent = visualDisplayString;
    if (executionString === "") {
        resultDisplay.textContent = "0";
    }
}

// Bonus Feature: Physical Keyboard Event Mappings
window.addEventListener('keydown', (e) => {
    let targetedDOMElement = null;

    // Numerical character matching
    if (!isNaN(e.key) && e.key !== ' ') {
        targetedDOMElement = Array.from(document.querySelectorAll('.num-btn')).find(b => b.textContent.trim() === e.key);
    } 
    // Operators parsing paths mapping logic triggers
    else if (e.key === '+') {
        targetedDOMElement = document.querySelector('[data-operator="+"]');
    } else if (e.key === '-') {
        targetedDOMElement = document.querySelector('[data-operator="-"]');
    } else if (e.key === '*') {
        targetedDOMElement = document.querySelector('[data-operator="*"]');
    } else if (e.key === '/') {
        targetedDOMElement = document.querySelector('[data-operator="/"]');
    } else if (e.key === '%') {
        targetedDOMElement = document.querySelector('[data-operator="%"]');
    } else if (e.key === '.') {
        targetedDOMElement = document.querySelector('[data-action="decimal"]');
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        targetedDOMElement = document.getElementById('key-equals');
    } else if (e.key === 'Backspace') {
        targetedDOMElement = document.getElementById('key-backspace');
    } else if (e.key === 'Escape') {
        targetedDOMElement = document.getElementById('key-clear');
    }

    if (targetedDOMElement) {
        targetedDOMElement.classList.add('keyboard-active');
        processInput(targetedDOMElement);
        setTimeout(() => targetedDOMElement.classList.remove('keyboard-active'), 100);
    }
});