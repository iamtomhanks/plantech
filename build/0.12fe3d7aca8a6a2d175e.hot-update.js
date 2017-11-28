webpackHotUpdate(0,{

/***/ 311:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

__webpack_require__(135);

var _reactRouterDom = __webpack_require__(34);

var _Home = __webpack_require__(80);

var _Home2 = _interopRequireDefault(_Home);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Homes = function (_React$Component) {
  _inherits(Homes, _React$Component);

  function Homes() {
    _classCallCheck(this, Homes);

    return _possibleConstructorReturn(this, (Homes.__proto__ || Object.getPrototypeOf(Homes)).apply(this, arguments));
  }

  _createClass(Homes, [{
    key: 'renderTowns',
    value: function renderTowns() {
      var data = __webpack_require__(26);

      return data.map(function (item, index) {
        var _this2 = this;

        if (item.elevation == 'A' && item.category == 'town' && item.open == "1") {
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
                return _this2.props.history.push('/homedetails/' + _this2.props.Name);
              }
            })
          );
        }
      }, this);
    }
  }, {
    key: 'renderSemis',
    value: function renderSemis() {
      var data = __webpack_require__(26);

      return data.map(function (item, index) {
        if (item.elevation == 'A' && item.category == 'semi' && item.open == "1") {
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
              image: item.renderings
            })
          );
        }
      }, this);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'row homesDesigns_container' },
        _react2.default.createElement(
          'div',
          { className: 'col-md-12 col-sm-12 features_style' },
          _react2.default.createElement(
            'div',
            { className: 'homesDesigns_Heading' },
            _react2.default.createElement(
              'h1',
              { id: 'features1' },
              'HOME DESIGNS'
            ),
            _react2.default.createElement(
              'div',
              { className: 'row homesTextcontainer' },
              _react2.default.createElement(
                'p',
                { id: 'homesText' },
                'The Breeze community offers smartly designed and appointed townhomes and semis with generous sized windows, quaint covered porches and beautiful landscaping front and rear, maintained year round for you to enjoy. All the homes also feature their own backyard deck, perfect for unwinding with a book or entertaining on a warm summer\u2019s eve. With Breeze\u2019s picturesque architecture, harmonious streetscapes and carefree lifestyle, all you have to do is move in and relax.'
              )
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: ' row parallelogram_container' },
          _react2.default.createElement(
            'div',
            { className: 'col-md-4 col-sm-4 parallelogram_style' },
            _react2.default.createElement(
              'div',
              { className: 'parallelogram' },
              _react2.default.createElement(
                'h1',
                { id: 'townsheading' },
                'Towns'
              )
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'col-md-8 col-sm-8 townstext_style' },
            _react2.default.createElement(
              'div',
              { className: 'towns_box' },
              _react2.default.createElement(
                'p',
                { id: 'townstext' },
                'Each townhome features maintenance-free landscaping and a backyard deck for relaxing or entertaining.'
              )
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { id: 'products', className: 'row list-group' },
          _react2.default.createElement(
            'div',
            { className: 'item  col-xs-12 col-lg-12' },
            this.renderTowns()
          )
        ),
        _react2.default.createElement(
          'div',
          { className: ' row parallelogram2_container' },
          _react2.default.createElement(
            'div',
            { className: 'col-md-4 col-sm-4 parallelogram_style' },
            _react2.default.createElement(
              'div',
              { className: 'parallelogramtwo' },
              _react2.default.createElement(
                'h1',
                { id: 'semisheading' },
                'Semis'
              )
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'col-md-8 col-sm-8 semistext_style' },
            _react2.default.createElement(
              'div',
              { className: 'semis_box' },
              _react2.default.createElement(
                'p',
                { id: 'semistext' },
                'Each semi also features landscaping and a backyard deck, plus even more space for loving life.'
              )
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { id: 'products', className: 'row list-group' },
          _react2.default.createElement(
            'div',
            { className: 'item  col-xs-12 col-lg-12 productPadding' },
            this.renderSemis()
          )
        )
      );
    }
  }]);

  return Homes;
}(_react2.default.Component);

exports.default = Homes;
;

/***/ })

})