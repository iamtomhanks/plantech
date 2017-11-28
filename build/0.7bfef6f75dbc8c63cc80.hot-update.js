webpackHotUpdate(0,{

/***/ 313:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _Nav = __webpack_require__(65);

var _Nav2 = _interopRequireDefault(_Nav);

__webpack_require__(314);

var _reactRouterDom = __webpack_require__(34);

var _jquery = __webpack_require__(12);

var _jquery2 = _interopRequireDefault(_jquery);

var _Home = __webpack_require__(80);

var _Home2 = _interopRequireDefault(_Home);

var _HomeDetails = __webpack_require__(77);

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
      activeStep: 1,
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
      var self = this;
      this.getHomes(function (homeData) {
        handleReturn(homeData.map(function (item, index) {
          if (item.elevation == 'A') {
            return _react2.default.createElement(
              'div',
              { className: 'col-xs-12 col-sm-4 col-md-4 ' },
              _react2.default.createElement(_Home2.default, {
                Name: item.marketingName,
                SquareFootage: item.sqFtMarketing,
                MinPrice: item.price,
                NumBath: item.baths,
                NumBed: item.beds,
                history: self.props.history,
                homeID: item.id,
                image: item.renderings
              })
            );
          }
        }, this));
      }, "town");
    }
  }, {
    key: 'renderStep',
    value: function renderStep() {
      var self = this;
      switch (this.state.activeStep) {
        case 2:
          this.renderStep2(function (returnData) {
            self.setState({
              homesData: returnData
            });
            (0, _jquery2.default)(".homeLoadingGif").hide();
          });
          break;
        case 1:
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

/***/ })

})