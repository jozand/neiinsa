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

/***/ "./src/public/js/selectDepartamentos.js":
/*!**********************************************!*\
  !*** ./src/public/js/selectDepartamentos.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function() {\r\n    document.getElementById('departamentoSelect').addEventListener('change', function () {\r\n        cargarMunicipios(1);  // Cargar la primera página cuando se selecciona un departamento\r\n    });\r\n    \r\n    async function cargarMunicipios(page) {\r\n        const departamentoId = document.getElementById('departamentoSelect').value;\r\n    \r\n        if (departamentoId) {\r\n            try {\r\n                const response = await fetch(`/municipios/por-departamento/${departamentoId}?page=${page}&limit=5`);\r\n                const data = await response.json();\r\n    \r\n                const tbody = document.getElementById('municipiosTable');\r\n                tbody.innerHTML = '';\r\n    \r\n                data.municipios.forEach(municipio => {\r\n                    const row = document.createElement('tr');\r\n                    row.classList.add('border-b', 'border-indigo-200', 'hover:bg-indigo-100');\r\n                    row.innerHTML = `\r\n                        <td class=\"py-3 px-6 text-left border-b border-gray-200\">${municipio.municipioId}</td>\r\n                        <td class=\"py-3 px-6 text-left border-b border-gray-200\">${municipio.nombre}</td>\r\n                        <td class=\"py-3 px-6 text-left border-b border-gray-200\">${municipio.lat}</td>\r\n                        <td class=\"py-3 px-6 text-left border-b border-gray-200\">${municipio.lng}</td>\r\n                        <td class=\"py-3 px-6 text-center border-b border-gray-200\">\r\n                            <a href=\"/municipios/editar/${municipio.municipioId}\" class=\"text-blue-500 hover:text-blue-700 mr-2 flex items-center\">\r\n                                <i class=\"fas fa-pencil-alt mr-1\"></i> Editar\r\n                            </a>\r\n                            <a href=\"/municipios/cargaEliminar/${municipio.municipioId}\" class=\"text-red-500 hover:text-red-700 flex items-center\">\r\n                                <i class=\"fas fa-trash-alt mr-1\"></i> Eliminar\r\n                            </a>\r\n                        </td>`;\r\n                    tbody.appendChild(row);\r\n                });\r\n    \r\n                actualizarControlesPaginacion(data.totalPages, data.currentPage);\r\n            } catch (error) {\r\n                console.error('Error al cargar los municipios:', error);\r\n            }\r\n        }\r\n    }\r\n    \r\n    function actualizarControlesPaginacion(totalPages, currentPage) {\r\n        const paginacion = document.getElementById('paginacion');\r\n        paginacion.innerHTML = '';\r\n    \r\n        // Botón \"Anterior\"\r\n        const prevPage = document.createElement('button');\r\n        prevPage.textContent = 'Anterior';\r\n        prevPage.classList.add('py-2', 'px-3', 'ml-0', 'leading-tight', 'text-gray-500', 'bg-white', 'rounded-l-lg', 'border', 'border-gray-300');\r\n        if (currentPage === 1) {\r\n            prevPage.classList.add('pointer-events-none', 'opacity-50'); // Deshabilitar\r\n            prevPage.disabled = true;\r\n        } else {\r\n            prevPage.classList.add('hover:bg-gray-100', 'hover:text-gray-700');\r\n            prevPage.addEventListener('click', () => cargarMunicipios(currentPage - 1));\r\n        }\r\n        paginacion.appendChild(prevPage);\r\n    \r\n        // Botones de página\r\n        for (let i = 1; i <= totalPages; i++) {\r\n            const pageButton = document.createElement('button');\r\n            pageButton.textContent = i;\r\n            pageButton.classList.add('py-2', 'px-3', 'leading-tight', 'text-gray-500', 'bg-white', 'border', 'border-gray-300');\r\n            if (i === currentPage) {\r\n                pageButton.classList.add('text-blue-600', 'bg-blue-50', 'hover:bg-blue-100', 'hover:text-blue-700');\r\n            } else {\r\n                pageButton.classList.add('hover:bg-gray-100', 'hover:text-gray-700');\r\n                pageButton.addEventListener('click', () => cargarMunicipios(i));\r\n            }\r\n            paginacion.appendChild(pageButton);\r\n        }\r\n    \r\n        // Botón \"Siguiente\"\r\n        const nextPage = document.createElement('button');\r\n        nextPage.textContent = 'Siguiente';\r\n        nextPage.classList.add('py-2', 'px-3', 'leading-tight', 'text-gray-500', 'bg-white', 'rounded-r-lg', 'border', 'border-gray-300');\r\n        if (currentPage === totalPages) {\r\n            nextPage.classList.add('pointer-events-none', 'opacity-50'); // Deshabilitar\r\n            nextPage.disabled = true;\r\n        } else {\r\n            nextPage.classList.add('hover:bg-gray-100', 'hover:text-gray-700');\r\n            nextPage.addEventListener('click', () => cargarMunicipios(currentPage + 1));\r\n        }\r\n        paginacion.appendChild(nextPage);\r\n    }\r\n    \r\n})();\n\n//# sourceURL=webpack://pos-aquateca/./src/public/js/selectDepartamentos.js?");

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
/******/ 	__webpack_modules__["./src/public/js/selectDepartamentos.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;