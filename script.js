"use strict";

/**
 * Selects element matching a selector and returns it.
 * @template {HTMLDivElement} T
 * @param {string} selector
 * @returns {T}
 */
const sel = (q) => document.querySelector(q);
/**
 * Selects all elements matching a selector and returns them as an array.
 * @template {HTMLDivElement} T
 * @param {string} selector
 * @returns {T[]}
 */
const selA = (q) => Array.from(document.querySelectorAll(q));

const operators = {
  add: "+",
  sub: "-",
  mul: "×",
  div: "÷",
};

const previousDisplay = sel("#previous-operand");
const currentDisplay = sel("#current-operand");

const actionBtns = selA("button[data-action]");
const numberBtns = selA("button[data-number]");
const operatorBtns = selA("button[data-operator]");

const currentFlow = [
  {
    type: "number",
    value: "1",
  },
  {
    type: "operator",
    value: "+",
  },
  {
    type: "number",
    value: "2",
  },
  {
    type: "operator",
    value: "*",
  },
  {
    type: "number",
    value: "6",
  },
  {
    type: "operator",
    value: "/",
  },
  {
    type: "number",
    value: "9",
  },
  {
    type: "operator",
    value: "+",
  },
  {
    type: "number",
    value: "3",
  },
];
update();

function update() {
  console.log(currentFlow);
  currentDisplay.textContent = currentFlow.reduce((acc, item) => {
    return acc + item.value;
  }, "");
}

const insertAction = (action) => {
  switch (action) {
    case "=":
      eq();
      break;
    case "del":
      del();
      break;
    default:
      break;
  }
};
actionBtns.forEach((aBtn) => {
  aBtn.addEventListener("click", (evt) => {
    const action = evt.target.dataset.action;
    insertAction(action);
  });
});

// action functions
function calc() {
  let ans = 0;
  const divOrMulRange = { start: -1, end: -1 };
  let inRange = false;
  const n = currentFlow.length;
  for (let i = 0; i < n; i++) {
    const operation = currentFlow[i];
    if (operation.type === "operator") {
      if (operation.value === operators.mul || operation.value === operators.div) {
        if (!inRange) {
          divOrMulRange.start = i - 1;
          inRange = true;
        }
      } else {
        if (inRange) {
          divOrMulRange.end = i;
          inRange = false;
        }
      }
    }
  }

  return ans;
}
function eq() {
  const ans = calc();
  console.log({ ans });
  return ans;
}
function del() {
  currentFlow.pop();
  update();
}

// end action functions

const insertNumber = (numAsStr) => {
  const lastOperation = currentFlow[currentFlow.length - 1];
  if (lastOperation && lastOperation.type === "number") {
    if (lastOperation.value === "0") {
      lastOperation.value = "";
    }
    lastOperation.value += numAsStr;
  } else {
    currentFlow.push({
      type: "number",
      value: numAsStr,
    });
  }
  update();
};
numberBtns.forEach((nBtn) => {
  nBtn.addEventListener("click", (evt) => {
    const number = evt.target.dataset.number;
    insertNumber(number);
  });
});

const insertOperator = (op) => {
  const lastOperation = currentFlow[currentFlow.length - 1];
  if (lastOperation && lastOperation.type === "operator") {
    lastOperation.value = op;
  } else {
    currentFlow.push({
      type: "operator",
      value: op,
    });
  }
  update();
};
operatorBtns.forEach((oBtn) => {
  oBtn.addEventListener("click", (evt) => {
    const operator = evt.target.dataset.operator;
    insertOperator(operator);
  });
});

function numFormat(a) {
  const num = parseFloat(a);
  if (Number.isNaN) {
    throw new Error("Not valid input");
  }
  return num;
}
function add(a, b) {
  a = numFormat(a);
  b = numFormat(b);
  return a + b;
}
function sub(a, b) {
  a = numFormat(a);
  b = numFormat(b);
  return a - b;
}
function mul(a, b) {
  a = numFormat(a);
  b = numFormat(b);
  return a * b;
}
function div(a, b) {
  a = numFormat(a);
  b = numFormat(b);
  return a / b;
}
function performOperation(a, b, op) {
  switch (op) {
    case "+":
      return add(a, b);
    case "-":
      return sub(a, b);
    case "*":
      return mul(a, b);
    case "/":
      return div(a, b);
    default:
      return null;
  }
}
