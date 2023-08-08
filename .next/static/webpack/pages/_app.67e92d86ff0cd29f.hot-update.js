/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/_app",{

/***/ "./. sync recursive ^\\.\\/.*\\.json$":
/*!********************************!*\
  !*** ././ sync ^\.\/.*\.json$ ***!
  \********************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var map = {
	"./dev.json": "./dev.json",
	"./package-lock.json": "./package-lock.json",
	"./package.json": "./package.json",
	"./public/manifest.json": "./public/manifest.json"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./. sync recursive ^\\.\\/.*\\.json$";

/***/ }),

/***/ "./public/manifest.json":
/*!******************************!*\
  !*** ./public/manifest.json ***!
  \******************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = JSON.parse('{"short_name":"Digital Vaults","name":"Digital Vaults","icons":[{"src":"favicon.ico","sizes":"64x64 32x32 24x24 16x16","type":"image/x-icon"},{"src":"logo192.png","type":"image/png","sizes":"192x192"},{"src":"logo512.png","type":"image/png","sizes":"512x512"}],"start_url":".","display":"standalone","theme_color":"#000000","background_color":"#ffffff"}');

/***/ })

});