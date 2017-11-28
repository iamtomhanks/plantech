webpackHotUpdate(0,{

/***/ 250:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MainApp = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MainHome = __webpack_require__(251);

var _MainHome2 = _interopRequireDefault(_MainHome);

var _HomeDetails = __webpack_require__(84);

var _HomeDetails2 = _interopRequireDefault(_HomeDetails);

var _Reservation = __webpack_require__(324);

var _Reservation2 = _interopRequireDefault(_Reservation);

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

__webpack_require__(139);

var _reactRouterDom = __webpack_require__(35);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // import React { Component } from 'react';
// import Contact from './Contact';
// import Map from './Map';
// import Registration from './Registration';
// import Sliderbox from './Sliderbox';

// import Dropdown from './Dropdown';
// import '../fonts/Gotham-Medium.ttf';


var MainApp = exports.MainApp = function (_React$Component) {
  _inherits(MainApp, _React$Component);

  function MainApp() {
    _classCallCheck(this, MainApp);

    return _possibleConstructorReturn(this, (MainApp.__proto__ || Object.getPrototypeOf(MainApp)).apply(this, arguments));
  }

  _createClass(MainApp, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          _reactRouterDom.Switch,
          null,
          _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/', component: _MainHome2.default }),
          _react2.default.createElement(_reactRouterDom.Route, { path: '/homedetails/:marketingName', component: _HomeDetails2.default }),
          _react2.default.createElement(_reactRouterDom.Route, { path: '/reservation', component: _Reservation2.default })
        )
      );
    }
  }]);

  return MainApp;
}(_react2.default.Component);

exports.default = MainApp;

/***/ })

})