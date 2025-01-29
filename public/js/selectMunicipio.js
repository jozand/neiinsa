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

/***/ "./src/public/js/selectMunicipio.js":
/*!******************************************!*\
  !*** ./src/public/js/selectMunicipio.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// public/js/dynamicSelects.js\r\n(function() {\r\n\r\n  document.getElementById('departamentoId').addEventListener('change', function () {\r\n      cargaMunicipios(); \r\n  });\r\n  \r\n  async function cargaMunicipios() {\r\n      const departamentoSelect = document.getElementById('departamentoId');\r\n      const municipioSelect = document.getElementById('municipioId');\r\n      \r\n      municipioSelect.innerHTML = '<option value=\"\">- Seleccione -</option>';\r\n      \r\n      if (departamentoId) {\r\n          try {\r\n              // Realizar la petición al servidor para obtener los municipios\r\n              const response = await fetch(`/municipios/porDepartamento/${departamentoSelect.value}`);\r\n              const municipios = await response.json();\r\n              // Rellenar el select de municipios con los datos recibidos\r\n              municipios.forEach(municipio => {\r\n                  const option = document.createElement('option');\r\n                  option.value = municipio.municipioId;\r\n                  option.textContent = municipio.nombre;\r\n                  municipioSelect.appendChild(option);\r\n              });\r\n          } catch (error) {\r\n              console.error('Error al cargar los municipios:', error);\r\n          }\r\n      }\r\n  }\r\n})()\n\n//# sourceURL=webpack://pos-aquateca/./src/public/js/selectMunicipio.js?");

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
/******/ 	__webpack_modules__["./src/public/js/selectMunicipio.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;