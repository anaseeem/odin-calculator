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
  let ans = 0;
  const newFlow = [];
  const divOrMulRange = { start: -1, end: -1 };
  let inRange = false;
  const n = currentFlow.length;
  const inRangeFn = (i) => {
    divOrMulRange.end = i;
    inRange = false;

    let sum = 1;
    let j = divOrMulRange.start;
    while (j < divOrMulRange.end) {
      const item = currentFlow[j];
      if (item.value === operators.mul || item.value === operators.div) {
        sum = performOperation(sum, currentFlow[j + 1].value, item.value);
        j = j + 2;
      } else {
        sum = item.value;
        j = j + 1;
      }
    }
    newFlow.push({ type: "number", value: sum });
  };
  for (let i = 0; i < n; i++) {
    const operation = currentFlow[i];

    if ((operation.value === operators.mul || operation.value === operators.div) && !inRange) {
      newFlow.pop();
      inRange = true;
      divOrMulRange.start = i - 1;
    } else if (operation.value === operators.add || operation.value === operators.sub) {
      if (inRange) {
        inRangeFn(i);
      }
      newFlow.push(currentFlow[i]);
    } else {
      if (!inRange) {
        newFlow.push(currentFlow[i]);
      } else if (inRange && i === n - 1) {
        inRangeFn(i);
      }
    }
  }

  for (let i = 0; i < newFlow.length - 1; i++) {
    const item = newFlow[i];
    if (item.type === "number") {
      ans = item.value;
    } else if (item.value === operators.add) {
      ans = add(ans, newFlow[i + 1].value);
      i++;
    } else {
      ans = sub(ans, newFlow[i + 1].value);
      i++;
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
