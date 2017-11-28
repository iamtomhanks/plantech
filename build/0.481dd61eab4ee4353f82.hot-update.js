webpackHotUpdate(0,{

/***/ 312:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _Nav = __webpack_require__(123);

var _Nav2 = _interopRequireDefault(_Nav);

__webpack_require__(314);

var _reactRouterDom = __webpack_require__(44);

var _jquery = __webpack_require__(14);

var _jquery2 = _interopRequireDefault(_jquery);

var _Home = __webpack_require__(133);

var _Home2 = _interopRequireDefault(_Home);

var _HomeDetails = __webpack_require__(132);

var _HomeDetails2 = _interopRequireDefault(_HomeDetails);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// var someProperty = {...this.state.someProperty}
// somePrperty.flag = true;
// this.setState({someProperty})

var Reservation = function (_React$Component) {
  _inherits(Reservation, _React$Component);

  function Reservation() {
    _classCallCheck(this, Reservation);

    var _this = _possibleConstructorReturn(this, (Reservation.__proto__ || Object.getPrototypeOf(Reservation)).call(this));

    _this.state = {
      activeStep: 2,
      step1Data: { complete: false },
      step2Data: { complete: false, data: {} },
      step3Data: { complete: false },
      activeStepData: {},
      homesData: ""
    };
    return _this;
  }

  _createClass(Reservation, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.renderStep();
    }
  }, {
    key: 'renderStep2',
    value: function renderStep2(handleReturn) {
      this.getHomes(function (homeData) {
        handleReturn();
      }, "town");
    }
  }, {
    key: 'renderStep',
    value: function renderStep() {
      var self = this;
      switch (this.state.activeStep) {
        case 2:
          var step2Data = "step2Data";
          this.renderStep2(function (returnData) {
            self.setState({
              homesData: returnData
            });
            (0, _jquery2.default)(".homeLoadingGif").hide();
          });
          break;
      }
    }
  }, {
    key: 'getHomes',
    value: function getHomes(handleHomeData, homeCategory) {
      _jquery2.default.ajax({
        type: 'POST',
        // make sure you respect the same origin policy with this url:
        // http://en.wikipedia.org/wiki/Same_origin_policy
        url: '/getHomes',
        data: {
          'category': 'town'
        },
        success: function success(data, status) {
          handleHomeData(data);
        }
      });
    }
  }, {
    key: 'renderStepIndicator',
    value: function renderStepIndicator(step) {
      var activeClass = '';

      if (this.state["step" + step + "Data"].complete) {} else if (step == this.state.activeStep) {
        activeClass = 'stepIndicatorActive';
      }
      return _react2.default.createElement(
        'div',
        { className: "stepIndicator " + activeClass },
        'Step ',
        step
      );
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_Nav2.default, null),
        _react2.default.createElement(
          'div',
          { className: 'reservationContainer' },
          _react2.default.createElement(
            'div',
            { className: 'stepIndicatorBar' },
            this.renderStepIndicator(1),
            this.renderStepIndicator(2),
            this.renderStepIndicator(3)
          ),
          _react2.default.createElement(
            'div',
            { className: 'stepContainer' },
            this.state.homesData,
            _react2.default.createElement(
              'div',
              { className: 'homeLoadingGif' },
              _react2.default.createElement('img', { src: "/images/homeLoading.gif" })
            )
          )
        )
      );
    }
  }]);

  return Reservation;
}(_react2.default.Component);

exports.default = Reservation;
;

/***/ }),

/***/ 313:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(10)(undefined);
// imports


// module
exports.push([module.i, ".stepIndicatorBar {\n  width: 100%;\n  height: 15rem;\n  background: #1d2b02;\n}\n.stepIndicator {\n  color: #a5aa9a;\n  width: 30%;\n  margin-left: 2.5%;\n  font-size: 10rem;\n  line-height: 15rem;\n  float: left;\n  text-align: center;\n}\n.stepIndicatorActive {\n  color: #FFF;\n}\n.homeLoadingGif {\n  width: 10%;\n  margin: 5% 45%;\n}", ""]);

// exports


/***/ }),

/***/ 314:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(313);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(11)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(313, function() {
			var newContent = __webpack_require__(313);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ })

})