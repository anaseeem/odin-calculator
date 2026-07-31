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
  mul: "*",
  div: "/",
};

const previousDisplay = sel("#previous-operand");
const currentDisplay = sel("#current-operand");

const actionBtns = selA("button[data-action]");
const numberBtns = selA("button[data-number]");
const operatorBtns = selA("button[data-operator]");

let currentFlow = [
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
    value: "6",
  },
  {
    type: "operator",
    value: "/",
  },
  {
    type: "number",
    value: "8",
  },
  {
    type: "operator",
    value: "-",
  },
  {
    type: "number",
    value: "5",
  },
  {
    type: "operator",
    value: "+",
  },
  {
    type: "number",
    value: "9",
  },
  {
    type: "operator",
    value: "-",
  },
  {
    type: "number",
    value: "4",
  },
  {
    type: "operator",
    value: "+",
  },
  {
    type: "number",
    value: "8",
  },
  {
    type: "operator",
    value: "*",
  },
  {
    type: "number",
    value: "6",
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
    case "ac":
      ac();
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
  const newFlow = [currentFlow[0].value];
  const n = currentFlow.length;

  for (let i = 1; i < n; i += 2) {
    const operator = currentFlow[i].value;
    const nextNum = currentFlow[i + 1].value;
    const isMulOrDiv = operator === operators.mul || operator === operators.div;
    if (isMulOrDiv) {
      const prevNum = newFlow.pop();
      const result = performOperation(prevNum, nextNum, operator);
      newFlow.push(result);
    } else {
      newFlow.push(operator, nextNum);
    }
  }

  let ans = newFlow[0];

  for (let i = 1; i < newFlow.length; i += 2) {
    const operator = newFlow[i];
    const nextNum = newFlow[i + 1];
    ans = performOperation(ans, nextNum, operator);
  }

  return ans;
}
function eq() {
  const ans = calc();
  currentFlow = [{ type: "number", value: ans.toString() }];
  update();
  console.log({ ans });
  return ans;
}
function del() {
  currentFlow.pop();
  if (currentFlow.length === 0) {
    currentFlow = [{ type: "number", value: "0" }];
  }
  update();
  return;
}
function ac() {
  currentFlow = [{ type: "number", value: "0" }];
  update();

  return;
}

// end action functions

const insertNumber = (numAsStr) => {
  const lastOperation = currentFlow[currentFlow.length - 1];

  if (lastOperation && lastOperation.type === "number") {
    if (lastOperation.value === "0") {
      lastOperation.value = "";
    }

    if (numAsStr === ".") {
      const lastDecIdx = lastOperation.value.lastIndexOf(".");

      if (lastDecIdx === -1) {
        numAsStr = lastOperation.value.length === 0 ? "0." : ".";
      } else {
        numAsStr = "";
      }
    }

    lastOperation.value += numAsStr;
  } else {
    currentFlow.push({
      type: "number",

      value: numAsStr === "." ? "0." : numAsStr,
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
    if (lastOperation && lastOperation.type === "number" && lastOperation.value === "0.") {
      lastOperation.value = "0";
    }
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
  if (Number.isNaN(num)) {
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
  console.log("mul", { a, b });
  a = numFormat(a);
  b = numFormat(b);
  return a * b;
}
function div(a, b) {
  console.log("div", { a, b });

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
