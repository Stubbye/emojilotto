/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./src/components/WalletProvider.tsx":
/*!*******************************************!*\
  !*** ./src/components/WalletProvider.tsx ***!
  \*******************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   WalletContextProvider: () => (/* binding */ WalletContextProvider)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @solana/wallet-adapter-react */ \"@solana/wallet-adapter-react\");\n/* harmony import */ var _solana_wallet_adapter_react_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @solana/wallet-adapter-react-ui */ \"@solana/wallet-adapter-react-ui\");\n/* harmony import */ var _solana_wallet_adapter_phantom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @solana/wallet-adapter-phantom */ \"@solana/wallet-adapter-phantom\");\n/* harmony import */ var _solana_wallet_adapter_solflare__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @solana/wallet-adapter-solflare */ \"@solana/wallet-adapter-solflare\");\n/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @solana/web3.js */ \"@solana/web3.js\");\n/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_solana_web3_js__WEBPACK_IMPORTED_MODULE_6__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_2__, _solana_wallet_adapter_react_ui__WEBPACK_IMPORTED_MODULE_3__, _solana_wallet_adapter_phantom__WEBPACK_IMPORTED_MODULE_4__, _solana_wallet_adapter_solflare__WEBPACK_IMPORTED_MODULE_5__]);\n([_solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_2__, _solana_wallet_adapter_react_ui__WEBPACK_IMPORTED_MODULE_3__, _solana_wallet_adapter_phantom__WEBPACK_IMPORTED_MODULE_4__, _solana_wallet_adapter_solflare__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n/* __next_internal_client_entry_do_not_use__ WalletContextProvider auto */ \n\n\n\n\n\n\n__webpack_require__(/*! @solana/wallet-adapter-react-ui/styles.css */ \"./node_modules/@solana/wallet-adapter-react-ui/styles.css\");\nconst NETWORK = \"devnet\" || 0;\nconst RPC_ENDPOINT = \"https://devnet.helius-rpc.com/?api-key=YOUR_HELIUS_KEY\" || 0;\nconst WalletContextProvider = ({ children })=>{\n    const wallets = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(()=>[\n            new _solana_wallet_adapter_phantom__WEBPACK_IMPORTED_MODULE_4__.PhantomWalletAdapter(),\n            new _solana_wallet_adapter_solflare__WEBPACK_IMPORTED_MODULE_5__.SolflareWalletAdapter()\n        ], []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_2__.ConnectionProvider, {\n        endpoint: RPC_ENDPOINT,\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_2__.WalletProvider, {\n            wallets: wallets,\n            autoConnect: true,\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_solana_wallet_adapter_react_ui__WEBPACK_IMPORTED_MODULE_3__.WalletModalProvider, {\n                children: children\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\DELL\\\\Downloads\\\\emojilotto-v2\\\\app\\\\src\\\\components\\\\WalletProvider.tsx\",\n                lineNumber: 29,\n                columnNumber: 9\n            }, undefined)\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\DELL\\\\Downloads\\\\emojilotto-v2\\\\app\\\\src\\\\components\\\\WalletProvider.tsx\",\n            lineNumber: 28,\n            columnNumber: 7\n        }, undefined)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\DELL\\\\Downloads\\\\emojilotto-v2\\\\app\\\\src\\\\components\\\\WalletProvider.tsx\",\n        lineNumber: 27,\n        columnNumber: 5\n    }, undefined);\n};\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tcG9uZW50cy9XYWxsZXRQcm92aWRlci50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQytDO0FBSVQ7QUFDZ0M7QUFDQTtBQUNFO0FBQ3hCO0FBRWhETyxtQkFBT0EsQ0FBQyw2R0FBNEM7QUFFcEQsTUFBTUMsVUFBVSxRQUF1QyxJQUFZLENBQVE7QUFDM0UsTUFBTUksZUFDSkgsd0RBQW9DLElBQUlILENBQXNCRTtBQUV6RCxNQUFNTSx3QkFBcUQsQ0FBQyxFQUNqRUMsUUFBUSxFQUNUO0lBQ0MsTUFBTUMsVUFBVWhCLDhDQUFPQSxDQUNyQixJQUFNO1lBQUMsSUFBSUksZ0ZBQW9CQTtZQUFJLElBQUlDLGtGQUFxQkE7U0FBRyxFQUMvRCxFQUFFO0lBR0oscUJBQ0UsOERBQUNKLDRFQUFrQkE7UUFBQ2dCLFVBQVVMO2tCQUM1Qiw0RUFBQ1Ysd0VBQWNBO1lBQUNjLFNBQVNBO1lBQVNFLFdBQVc7c0JBQzNDLDRFQUFDZixnRkFBbUJBOzBCQUFFWTs7Ozs7Ozs7Ozs7Ozs7OztBQUk5QixFQUFFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZW1vamlsb3R0by1hcHAvLi9zcmMvY29tcG9uZW50cy9XYWxsZXRQcm92aWRlci50c3g/ZTEzNCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBjbGllbnRcIjtcbmltcG9ydCB7IEZDLCBSZWFjdE5vZGUsIHVzZU1lbW8gfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7XG4gIENvbm5lY3Rpb25Qcm92aWRlcixcbiAgV2FsbGV0UHJvdmlkZXIsXG59IGZyb20gXCJAc29sYW5hL3dhbGxldC1hZGFwdGVyLXJlYWN0XCI7XG5pbXBvcnQgeyBXYWxsZXRNb2RhbFByb3ZpZGVyIH0gZnJvbSBcIkBzb2xhbmEvd2FsbGV0LWFkYXB0ZXItcmVhY3QtdWlcIjtcbmltcG9ydCB7IFBoYW50b21XYWxsZXRBZGFwdGVyIH0gZnJvbSBcIkBzb2xhbmEvd2FsbGV0LWFkYXB0ZXItcGhhbnRvbVwiO1xuaW1wb3J0IHsgU29sZmxhcmVXYWxsZXRBZGFwdGVyIH0gZnJvbSBcIkBzb2xhbmEvd2FsbGV0LWFkYXB0ZXItc29sZmxhcmVcIjtcbmltcG9ydCB7IGNsdXN0ZXJBcGlVcmwgfSBmcm9tIFwiQHNvbGFuYS93ZWIzLmpzXCI7XG5cbnJlcXVpcmUoXCJAc29sYW5hL3dhbGxldC1hZGFwdGVyLXJlYWN0LXVpL3N0eWxlcy5jc3NcIik7XG5cbmNvbnN0IE5FVFdPUksgPSAocHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU09MQU5BX05FVFdPUksgYXMgYW55KSB8fCBcImRldm5ldFwiO1xuY29uc3QgUlBDX0VORFBPSU5UID1cbiAgcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfUlBDX0VORFBPSU5UIHx8IGNsdXN0ZXJBcGlVcmwoTkVUV09SSyk7XG5cbmV4cG9ydCBjb25zdCBXYWxsZXRDb250ZXh0UHJvdmlkZXI6IEZDPHsgY2hpbGRyZW46IFJlYWN0Tm9kZSB9PiA9ICh7XG4gIGNoaWxkcmVuLFxufSkgPT4ge1xuICBjb25zdCB3YWxsZXRzID0gdXNlTWVtbyhcbiAgICAoKSA9PiBbbmV3IFBoYW50b21XYWxsZXRBZGFwdGVyKCksIG5ldyBTb2xmbGFyZVdhbGxldEFkYXB0ZXIoKV0sXG4gICAgW11cbiAgKTtcblxuICByZXR1cm4gKFxuICAgIDxDb25uZWN0aW9uUHJvdmlkZXIgZW5kcG9pbnQ9e1JQQ19FTkRQT0lOVH0+XG4gICAgICA8V2FsbGV0UHJvdmlkZXIgd2FsbGV0cz17d2FsbGV0c30gYXV0b0Nvbm5lY3Q+XG4gICAgICAgIDxXYWxsZXRNb2RhbFByb3ZpZGVyPntjaGlsZHJlbn08L1dhbGxldE1vZGFsUHJvdmlkZXI+XG4gICAgICA8L1dhbGxldFByb3ZpZGVyPlxuICAgIDwvQ29ubmVjdGlvblByb3ZpZGVyPlxuICApO1xufTtcbiJdLCJuYW1lcyI6WyJ1c2VNZW1vIiwiQ29ubmVjdGlvblByb3ZpZGVyIiwiV2FsbGV0UHJvdmlkZXIiLCJXYWxsZXRNb2RhbFByb3ZpZGVyIiwiUGhhbnRvbVdhbGxldEFkYXB0ZXIiLCJTb2xmbGFyZVdhbGxldEFkYXB0ZXIiLCJjbHVzdGVyQXBpVXJsIiwicmVxdWlyZSIsIk5FVFdPUksiLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfU09MQU5BX05FVFdPUksiLCJSUENfRU5EUE9JTlQiLCJORVhUX1BVQkxJQ19SUENfRU5EUE9JTlQiLCJXYWxsZXRDb250ZXh0UHJvdmlkZXIiLCJjaGlsZHJlbiIsIndhbGxldHMiLCJlbmRwb2ludCIsImF1dG9Db25uZWN0Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/components/WalletProvider.tsx\n");

/***/ }),

/***/ "./src/pages/_app.tsx":
/*!****************************!*\
  !*** ./src/pages/_app.tsx ***!
  \****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _components_WalletProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/WalletProvider */ \"./src/components/WalletProvider.tsx\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../styles/globals.css */ \"./src/styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_2__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_components_WalletProvider__WEBPACK_IMPORTED_MODULE_1__]);\n_components_WalletProvider__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n__webpack_require__(/*! @solana/wallet-adapter-react-ui/styles.css */ \"./node_modules/@solana/wallet-adapter-react-ui/styles.css\");\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_WalletProvider__WEBPACK_IMPORTED_MODULE_1__.WalletContextProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\DELL\\\\Downloads\\\\emojilotto-v2\\\\app\\\\src\\\\pages\\\\_app.tsx\",\n            lineNumber: 9,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\DELL\\\\Downloads\\\\emojilotto-v2\\\\app\\\\src\\\\pages\\\\_app.tsx\",\n        lineNumber: 8,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvX2FwcC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUNxRTtBQUN0QztBQUMvQkMsbUJBQU9BLENBQUMsNkdBQTRDO0FBRXJDLFNBQVNDLElBQUksRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQVk7SUFDNUQscUJBQ0UsOERBQUNKLDZFQUFxQkE7a0JBQ3BCLDRFQUFDRztZQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7O0FBRzlCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZW1vamlsb3R0by1hcHAvLi9zcmMvcGFnZXMvX2FwcC50c3g/ZjlkNiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEFwcFByb3BzIH0gZnJvbSBcIm5leHQvYXBwXCI7XG5pbXBvcnQgeyBXYWxsZXRDb250ZXh0UHJvdmlkZXIgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9XYWxsZXRQcm92aWRlclwiO1xuaW1wb3J0IFwiLi4vc3R5bGVzL2dsb2JhbHMuY3NzXCI7XG5yZXF1aXJlKFwiQHNvbGFuYS93YWxsZXQtYWRhcHRlci1yZWFjdC11aS9zdHlsZXMuY3NzXCIpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9OiBBcHBQcm9wcykge1xuICByZXR1cm4gKFxuICAgIDxXYWxsZXRDb250ZXh0UHJvdmlkZXI+XG4gICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgPC9XYWxsZXRDb250ZXh0UHJvdmlkZXI+XG4gICk7XG59XG4iXSwibmFtZXMiOlsiV2FsbGV0Q29udGV4dFByb3ZpZGVyIiwicmVxdWlyZSIsIkFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/pages/_app.tsx\n");

/***/ }),

/***/ "./src/styles/globals.css":
/*!********************************!*\
  !*** ./src/styles/globals.css ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "@solana/web3.js":
/*!**********************************!*\
  !*** external "@solana/web3.js" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@solana/web3.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "@solana/wallet-adapter-phantom":
/*!*************************************************!*\
  !*** external "@solana/wallet-adapter-phantom" ***!
  \*************************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@solana/wallet-adapter-phantom");;

/***/ }),

/***/ "@solana/wallet-adapter-react":
/*!***********************************************!*\
  !*** external "@solana/wallet-adapter-react" ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@solana/wallet-adapter-react");;

/***/ }),

/***/ "@solana/wallet-adapter-react-ui":
/*!**************************************************!*\
  !*** external "@solana/wallet-adapter-react-ui" ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@solana/wallet-adapter-react-ui");;

/***/ }),

/***/ "@solana/wallet-adapter-solflare":
/*!**************************************************!*\
  !*** external "@solana/wallet-adapter-solflare" ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@solana/wallet-adapter-solflare");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/@solana"], () => (__webpack_exec__("./src/pages/_app.tsx")));
module.exports = __webpack_exports__;

})();