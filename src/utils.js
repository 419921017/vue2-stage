/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: power_840
 * @Date: 2021-06-17 21:35:20
 * @LastEditors: power_840
 * @LastEditTime: 2021-06-21 20:45:23
 */
export const isFunction = (fn) => typeof fn === "function";
export const isObject = (obj) => typeof obj === "object" && obj !== null;
export const isArray = (arr) => Array.isArray(arr);
