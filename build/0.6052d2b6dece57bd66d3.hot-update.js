webpackHotUpdate(0,{

/***/ 77:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HomeDetails = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

__webpack_require__(282);

var _Nav = __webpack_require__(65);

var _Nav2 = _interopRequireDefault(_Nav);

var _Siteplan = __webpack_require__(133);

var _Siteplan2 = _interopRequireDefault(_Siteplan);

var _Features = __webpack_require__(134);

var _Features2 = _interopRequireDefault(_Features);

var _SimilarAvailableHomes = __webpack_require__(283);

var _SimilarAvailableHomes2 = _interopRequireDefault(_SimilarAvailableHomes);

var _jquery = __webpack_require__(12);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HomeDetails = exports.HomeDetails = function (_React$Component) {
  _inherits(HomeDetails, _React$Component);

  function HomeDetails(props) {
    _classCallCheck(this, HomeDetails);

    var _this = _possibleConstructorReturn(this, (HomeDetails.__proto__ || Object.getPrototypeOf(HomeDetails)).call(this));

    _this.state = {
      marketingName: props.match.params.marketingName,
      elevationSelected: 'A',
      homeChanged: false,
      optShowing: false,
      optCopy: "",
      optOriginalElevation: 'A'
    };
    return _this;
  }

  _createClass(HomeDetails, [{
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      if (this.state.marketingName != nextProps.match.params.marketingName) {
        this.setState({
          marketingName: this.props.match.params.marketingName
        });
        (0, _jquery2.default)('html, body').animate({ scrollTop: 0 }, '2000');
      }
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      (0, _jquery2.default)('html, body').animate({ scrollTop: 0 }, '0');
      //hard coding for Meadow, show opt first
      if (this.state.marketingName == "Meadow" && this.state.elevationSelected == 'A') {
        this.setState({
          elevationSelected: 'A OPT',
          optCopy: 'OPT. 1 Bedroom Plan'
        });
      }

      alert(this.props.history);
    }
  }, {
    key: 'updateActiveElevation',
    value: function updateActiveElevation(elevation) {
      var optOriginalElevation = elevation;
      //hard coding for showing Meadow OPT first
      if (this.state.marketingName == "Meadow" && elevation == "A OPT") {
        elevation = 'A';
      } else if (this.state.marketingName == "Meadow" && elevation == "A") {
        elevation = 'A OPT';
        optOriginalElevation = 'A';
      } else if (this.state.marketingName == "Meadow" && elevation == "B") {
        elevation = 'B OPT';
        optOriginalElevation = 'B';
      } else if (this.state.marketingName == "Meadow" && elevation == "B OPT") {
        elevation = 'B';
      }
      this.setState({
        elevationSelected: elevation,
        optOriginalElevation: optOriginalElevation,
        optShowing: false
      });
    }
  }, {
    key: 'toggleOptElevation',
    value: function toggleOptElevation(elevation, optPlans) {
      var optCopy;
      if (optPlans == "n/a") {
        optCopy = this.state.optCopy;
      } else {
        optCopy = optPlans;
      }
      //hard coding for showing Meadow OPT first
      if (this.state.marketingName == "Meadow" && elevation == "A OPT") {
        elevation = 'A';
      } else if (this.state.marketingName == "Meadow" && elevation == "A") {
        elevation = 'A OPT';
      } else if (this.state.marketingName == "Meadow" && elevation == "B") {
        elevation = 'B OPT';
      } else if (this.state.marketingName == "Meadow" && elevation == "B OPT") {
        elevation = 'B';
      }
      this.setState({
        elevationSelected: elevation,
        optShowing: !this.state.optShowing,
        optCopy: optCopy
      });
    }
  }, {
    key: 'renderElevationToggleButtons',
    value: function renderElevationToggleButtons() {
      var data = __webpack_require__(26);

      return data.map(function (item, index) {
        var _this2 = this;

        if (this.state.marketingName == item.marketingName && item.elevation.indexOf('OPT') == -1) {
          var activeClass;
          //change style of active and inactive buttons
          if (item.elevation == this.state.optOriginalElevation) {
            activeClass = 'elevationToggleButtonActive';
          } else {
            activeClass = 'elevationToggleButtonInactive';
          }
          return _react2.default.createElement(
            'div',
            { className: "elevationToggleButton " + item.category + "-backgroundColor " + activeClass, onClick: function onClick() {
                return _this2.updateActiveElevation(item.elevation);
              } },
            ' Elevation ',
            item.elevation
          );
        }
      }, this);
    }
  }, {
    key: 'renderOptButton',
    value: function renderOptButton(marketingName, optPlans) {
      var viewOrHide;

      var optCopy;
      if (optPlans == "n/a") {
        optCopy = this.state.optCopy;
      } else {
        optCopy = optPlans;
      }

      var optClass = this.state.optOriginalElevation + ' OPT';

      var data = __webpack_require__(26);
      return data.map(function (item, index) {
        var _this3 = this;

        if (marketingName == item.marketingName && item.elevation == optClass) {
          var optLink;

          if (this.state.optShowing) {
            viewOrHide = "Hide";
            optLink = this.state.optOriginalElevation;
          } else {
            viewOrHide = "View";
            optLink = item.elevation;
          }

          return _react2.default.createElement(
            'div',
            { className: 'optButton', onClick: function onClick() {
                return _this3.toggleOptElevation(optLink, optPlans);
              } },
            viewOrHide,
            ' ',
            optCopy
          );
        }
      }, this);
    }
  }, {
    key: 'navigateFloorplans',
    value: function navigateFloorplans(direction) {
      if (direction == 'left') {
        (0, _jquery2.default)(".floorplansContainerInner").animate({ "right": "0%" }, "slow");
        (0, _jquery2.default)(".floorplanIndicatorRight").removeClass("floorplanIndicatorActive");
        (0, _jquery2.default)(".floorplanIndicatorLeft").addClass("floorplanIndicatorActive");
        (0, _jquery2.default)(".floorplanNavigatorLeft").hide();
        (0, _jquery2.default)(".floorplanNavigatorRight").show();
      } else {
        (0, _jquery2.default)(".floorplansContainerInner").animate({ "right": "89%" }, "slow");
        (0, _jquery2.default)(".floorplanIndicatorLeft").removeClass("floorplanIndicatorActive");
        (0, _jquery2.default)(".floorplanIndicatorRight").addClass("floorplanIndicatorActive");
        (0, _jquery2.default)(".floorplanNavigatorLeft").show();
        (0, _jquery2.default)(".floorplanNavigatorRight").hide();
      }
    }
  }, {
    key: 'renderCalloutContainer',
    value: function renderCalloutContainer() {
      return _react2.default.createElement(
        'div',
        { className: 'calloutContainer' },
        _react2.default.createElement(
          'div',
          { className: 'calloutContainerInner' },
          _react2.default.createElement(
            'div',
            { className: 'calloutImage' },
            _react2.default.createElement('img', null)
          ),
          _react2.default.createElement('p', { className: 'calloutText' })
        ),
        _react2.default.createElement(
          'div',
          { className: 'calloutBottomSliver' },
          _react2.default.createElement('img', { src: "../images/callouts/calloutBottomSliver.png" })
        )
      );
    }
  }, {
    key: 'calloutClicked',
    value: function calloutClicked(e, calloutID, x, y, floorplanType) {
      var data = __webpack_require__(143);
      var top = (0, _jquery2.default)(e.target).parent().css("top");
      var left = (0, _jquery2.default)(e.target).parent().css("left");
      return data.map(function (item, index) {
        if (item.id == calloutID) {
          (0, _jquery2.default)(".calloutContainer").hide();

          var imageURL = "../images/callouts/" + item.img;
          (0, _jquery2.default)(".calloutImage img").attr("src", imageURL);
          (0, _jquery2.default)(".calloutText").html(item.text);
          (0, _jquery2.default)(".calloutContainer").css("top", top);
          (0, _jquery2.default)(".calloutContainer").css("left", left);
          (0, _jquery2.default)("." + floorplanType + " .calloutContainer").show();
          (0, _jquery2.default)("." + floorplanType + " .calloutContainer").css("opacity", "0");
          (0, _jquery2.default)("." + floorplanType + " .calloutContainer").animate({ opacity: 1 }, '2000');
        }
      }, this);
    }
  }, {
    key: 'renderCallouts',
    value: function renderCallouts(floorplan, floorplanType) {
      var data = __webpack_require__(143);

      return data.map(function (item, index) {
        var _this4 = this;

        if (item.floorplan == floorplan) {
          var style = {
            top: item.y + "%",
            left: item.x + "%"
          };
          return _react2.default.createElement(
            'div',
            { className: 'calloutIcon', style: style, onClick: function onClick(e) {
                return _this4.calloutClicked(e, item.id, item.x, item.y, floorplanType);
              }, 'data-id': 'calloutIcon' },
            _react2.default.createElement('img', { src: "../images/callouts/calloutIcon.png", 'data-id': 'calloutIcon' })
          );
        }
      }, this);
    }
  }, {
    key: 'closeCalloutContainer',
    value: function closeCalloutContainer(e) {
      if ((0, _jquery2.default)(e.target).attr("data-id") != "calloutIcon") {
        (0, _jquery2.default)(".calloutContainer").hide();
      }
    }
  }, {
    key: 'renderElevation',
    value: function renderElevation() {
      var data = __webpack_require__(26);

      return data.map(function (item, index) {
        var _this5 = this;

        if (this.state.marketingName == item.marketingName && this.state.elevationSelected == item.elevation) {
          var floorplans = item.floorplans.split(",");

          return _react2.default.createElement(
            'div',
            { className: 'renderedElevation', onClick: function onClick(e) {
                return _this5.closeCalloutContainer(e);
              } },
            _react2.default.createElement(
              'div',
              { className: 'elevationImageContainer' },
              _react2.default.createElement('img', { src: "../images/homes/" + item.renderings })
            ),
            _react2.default.createElement(
              'div',
              { className: "infoContainer " + item.category + "-backgroundColor" },
              _react2.default.createElement(
                'div',
                { className: 'elevationToggleButtonContainer' },
                this.renderElevationToggleButtons()
              ),
              _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                  'nav',
                  null,
                  _react2.default.createElement(
                    'ul',
                    null,
                    _react2.default.createElement(
                      'li',
                      { onClick: function onClick() {
                          return _this5.props.history.push('/');
                        }, className: 'productDetailsIcon backbutton' },
                      _react2.default.createElement('img', { src: "../images/homes/productBackButton.png" })
                    ),
                    _react2.default.createElement(
                      'li',
                      { className: 'productDetailsIcon productName' },
                      item.category,
                      ': '
                    ),
                    _react2.default.createElement(
                      'li',
                      { className: 'productStyle' },
                      item.marketingName,
                      ' style ',
                      item.elevation
                    ),
                    _react2.default.createElement(
                      'li',
                      { className: 'productDetailsIcon productPrice' },
                      '$',
                      item.price
                    ),
                    _react2.default.createElement(
                      'li',
                      { className: 'productDetailsIcon productSquareFoot' },
                      item.sqFtMarketing,
                      ' sq. ft.'
                    ),
                    _react2.default.createElement(
                      'li',
                      { className: 'productDetailsIcon productBedroom' },
                      _react2.default.createElement('img', { className: 'productIcon', src: "../images/homes/bedroomIcon.png" }),
                      " ",
                      item.beds
                    ),
                    _react2.default.createElement(
                      'li',
                      { className: 'productDetailsIcon productBathroom' },
                      _react2.default.createElement('img', { className: 'productIcon', src: "../images/homes/productBathroomIcon.png" }),
                      " ",
                      item.baths
                    ),
                    _react2.default.createElement(
                      'li',
                      { className: 'productDetailsIcon productSignupBtn' },
                      _react2.default.createElement('img', { className: 'signupBtn', onClick: function onClick() {
                          return _this5.props.history.push('/');
                        }, src: "../images/homes/productSignupBtn.png" })
                    )
                  )
                )
              )
            ),
            _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement('img', { className: 'mobileSignupBtn', src: "../images/homes/productSignupBtn.png" })
            ),
            _react2.default.createElement(
              'div',
              { className: 'floorplansContainer' },
              _react2.default.createElement(
                'div',
                { className: 'floorplansContainerInner' },
                _react2.default.createElement(
                  'div',
                  { className: 'floorplan ground' },
                  _react2.default.createElement('img', { src: "../images/floorplans/" + floorplans[1] + "" }),
                  this.renderCallouts(floorplans[1], "ground"),
                  this.renderCalloutContainer()
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'floorplan basement' },
                  _react2.default.createElement('img', { src: "../images/floorplans/" + floorplans[0] + "" }),
                  this.renderCallouts(floorplans[0], "basement"),
                  this.renderCalloutContainer()
                )
              ),
              _react2.default.createElement(
                'div',
                { className: 'floorplanNavigator floorplanNavigatorLeft', onClick: function onClick() {
                    return _this5.navigateFloorplans("left");
                  } },
                _react2.default.createElement('img', { src: "../images/left-arrow.png" })
              ),
              _react2.default.createElement(
                'div',
                { className: 'floorplanNavigator floorplanNavigatorRight', onClick: function onClick() {
                    return _this5.navigateFloorplans("right");
                  } },
                _react2.default.createElement('img', { src: "../images/right-arrow.png" })
              ),
              this.renderOptButton(item.marketingName, item.optPlans),
              _react2.default.createElement('div', { className: 'spacerForFloats' })
            ),
            _react2.default.createElement(
              'div',
              { className: 'floorplanIndicator floorplanIndicatorLeft floorplanIndicatorActive', onClick: function onClick() {
                  return _this5.navigateFloorplans("left");
                } },
              _react2.default.createElement('div', { className: 'floorplanIndicatorInner' })
            ),
            _react2.default.createElement(
              'div',
              { className: 'floorplanIndicator floorplanIndicatorRight', onClick: function onClick() {
                  return _this5.navigateFloorplans("right");
                } },
              _react2.default.createElement('div', { className: 'floorplanIndicatorInner' })
            )
          );
        }
      }, this);
    }
  }, {
    key: 'render',
    value: function render() {
      var infoContainerColor = '';
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_Nav2.default, null),
        this.renderElevation(),
        _react2.default.createElement(_Siteplan2.default, null),
        _react2.default.createElement(_SimilarAvailableHomes2.default, { history: this.props.history, currentProduct: this.state.marketingName }),
        _react2.default.createElement(_Features2.default, null)
      );
    }
  }]);

  return HomeDetails;
}(_react2.default.Component);

;

exports.default = HomeDetails;

/***/ })

})