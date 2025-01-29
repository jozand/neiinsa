/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/public/js/filtroClientes.js":
/*!*****************************************!*\
  !*** ./src/public/js/filtroClientes.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function() {\r\n  document.addEventListener('DOMContentLoaded', function () {\r\n      const filterInput = document.getElementById('filterInput');\r\n      const clientesTable = document.getElementById('clientesTable');\r\n  \r\n      filterInput.addEventListener('keyup', function () {\r\n          const filterValue = filterInput.value.toLowerCase();\r\n          const rows = clientesTable.getElementsByTagName('tr');\r\n  \r\n          for (let i = 0; i < rows.length; i++) {\r\n              const row = rows[i];\r\n              const cells = row.getElementsByTagName('td');\r\n              let match = false;\r\n  \r\n              for (let j = 0; j < cells.length; j++) {\r\n                  const cellValue = cells[j].innerText.toLowerCase();\r\n                  if (cellValue.includes(filterValue)) {\r\n                      match = true;\r\n                      break;\r\n                  }\r\n              }\r\n  \r\n              if (match) {\r\n                  row.style.display = '';\r\n              } else {\r\n                  row.style.display = 'none';\r\n              }\r\n          }\r\n      });\r\n  })\r\n})()\n\n//# sourceURL=webpack://pos-aquateca/./src/public/js/filtroClientes.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/public/js/filtroClientes.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;