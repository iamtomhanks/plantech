webpackHotUpdate(0,{

/***/ 37:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

__webpack_require__(21);

var _Home = __webpack_require__(49);

var _Home2 = _interopRequireDefault(_Home);

var _jquery = __webpack_require__(6);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReservationHomesList = function (_React$Component) {
  _inherits(ReservationHomesList, _React$Component);

  function ReservationHomesList() {
    _classCallCheck(this, ReservationHomesList);

    var _this = _possibleConstructorReturn(this, (ReservationHomesList.__proto__ || Object.getPrototypeOf(ReservationHomesList)).call(this));

    _this.state = {
      homesList: []
    };
    return _this;
  }

  _createClass(ReservationHomesList, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var self = this;
      this.getHomesList(function () {
        self.props.stepLoaded;
      });
    }
  }, {
    key: 'getHomesList',
    value: function getHomesList(stepLoadedFunction) {
      var self = this;
      _jquery2.default.ajax({
        type: 'POST',
        // make sure you respect the same origin policy with this url:
        // http://en.wikipedia.org/wiki/Same_origin_policy
        url: '/getHomes',
        data: {
          'category': this.props.homeCategory
        },
        success: function success(data, status) {
          self.setState({
            homesList: data
          });
          stepLoadedFunction();
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        this.state.homesList.map(function (item, index) {
          var _this2 = this;

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
                history: this.props.history,
                homeID: item.id,
                image: item.renderings,
                onClick: function onClick() {
                  return _this2.props.openHomeDetails(item.marketingName);
                }
              })
            );
          }
        }, this)
      );
    }
  }]);

  return ReservationHomesList;
}(_react2.default.Component);

exports.default = ReservationHomesList;
;

/***/ })

})