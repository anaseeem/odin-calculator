"use strict";

/**
 * Selects element matching a selector and returns it.
 * @template {Element} T
 * @param {string} selector
 * @returns {T}
 */
const sel = (q) => document.querySelector(q);
/**
 * Selects all elements matching a selector and returns them as an array.
 * @template {Element} T
 * @param {string} selector
 * @returns {T[]}
 */
const selA = (q) => Array.from(document.querySelectorAll(q));

const currentFlow = [];

const previousDisplay = sel("#previous-operand");
const currentDisplay = sel("#current-operand");

const actionBtns = selA("button[data-action]");
const numberBtns = selA("button[data-number]");
const operatorBtns = selA("button[data-operator]");

actionBtns.forEach((aBtn) => {
  aBtn.addEventListener("click", (evt) => {});
});

console.log(operatorBtns);
