function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { ensureConfig, getConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import messages from './Footer.messages';
import LanguageSelector from './LanguageSelector';
import { links, social } from '../data/footerLinks';
import FooterLinks from './footer-links/FooterLinks';
ensureConfig(['LMS_BASE_URL', 'LOGO_TRADEMARK_URL'], 'Footer component');
var EVENT_NAMES = {
  FOOTER_LINK: 'edx.bi.footer.link'
};
var FooterSocial = function FooterSocial(_ref) {
  var intl = _ref.intl;
  return /*#__PURE__*/React.createElement("div", {
    className: "footer-social d-flex mt-2"
  }, /*#__PURE__*/React.createElement("a", {
    className: "footer-social__badge",
    href: social === null || social === void 0 ? void 0 : social.newsletter,
    target: "_blank",
    rel: "noopener noreferrer",
    title: intl.formatMessage(messages['footer.nau.social.newsletter'])
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faEnvelope
  })), /*#__PURE__*/React.createElement("a", {
    className: "footer-social__badge",
    href: social === null || social === void 0 ? void 0 : social.facebook,
    target: "_blank",
    rel: "noopener noreferrer",
    title: intl.formatMessage(messages['footer.nau.social.facebook'])
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faFacebookF
  })), /*#__PURE__*/React.createElement("a", {
    className: "footer-social__badge",
    href: social === null || social === void 0 ? void 0 : social.linkedin,
    target: "_blank",
    rel: "noopener noreferrer",
    title: intl.formatMessage(messages['footer.nau.social.linkedin'])
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faLinkedinIn
  })));
};
FooterSocial.propTypes = {
  intl: intlShape.isRequired
};
var AdditionalLogosSection = function AdditionalLogosSection() {
  var FOOTER_LOGOS = getConfig().FOOTER_ADDITIONAL_LOGOS || process.env.FOOTER_ADDITIONAL_LOGOS;
  var parseFooterLogos = function parseFooterLogos() {
    try {
      if (Array.isArray(FOOTER_LOGOS)) {
        return FOOTER_LOGOS;
      }
      return JSON.parse(FOOTER_LOGOS);
    } catch (e) {
      return null;
    }
  };
  var logos = parseFooterLogos();
  if (!logos) {
    return null;
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "footer-additional-logos"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-md-flex justify-content-between px-4"
  }, logos.map(function (logo) {
    return /*#__PURE__*/React.createElement("div", {
      className: "py-3"
    }, /*#__PURE__*/React.createElement("a", {
      href: logo.url,
      target: "_blank",
      rel: "noopener noreferrer"
    }, /*#__PURE__*/React.createElement("img", {
      src: logo.src,
      alt: logo.alt,
      style: {
        maxHeight: '45px',
        maxWidth: '280px'
      }
    })));
  })));
};
var FooterCopyrightSection = function FooterCopyrightSection(_ref2) {
  var intl = _ref2.intl;
  return /*#__PURE__*/React.createElement("section", {
    className: "footer-copyright py-3 px-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer-copyright__logo"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 ", new Date().getFullYear(), " - FCT|FCCN", /*#__PURE__*/React.createElement("br", null), intl.formatMessage(messages['footer.copyright.message']))));
};
FooterCopyrightSection.propTypes = {
  intl: intlShape.isRequired
};
var SiteFooter = /*#__PURE__*/function (_React$Component) {
  _inherits(SiteFooter, _React$Component);
  var _super = _createSuper(SiteFooter);
  function SiteFooter(props) {
    var _this;
    _classCallCheck(this, SiteFooter);
    _this = _super.call(this, props);
    _this.externalLinkClickHandler = _this.externalLinkClickHandler.bind(_assertThisInitialized(_this));
    return _this;
  }
  _createClass(SiteFooter, [{
    key: "externalLinkClickHandler",
    value: function externalLinkClickHandler(event) {
      var label = event.currentTarget.getAttribute('href');
      var eventName = EVENT_NAMES.FOOTER_LINK;
      var properties = {
        category: 'outbound_link',
        label: label
      };
      sendTrackEvent(eventName, properties);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        supportedLanguages = _this$props.supportedLanguages,
        onLanguageSelected = _this$props.onLanguageSelected,
        logo = _this$props.logo,
        intl = _this$props.intl;
      var showLanguageSelector = supportedLanguages.length > 0 && onLanguageSelected;
      var config = this.context.config;
      return /*#__PURE__*/React.createElement("footer", {
        role: "contentinfo"
      }, /*#__PURE__*/React.createElement("section", {
        className: "footer-navigation container-fluid d-md-flex justify-content-between py-3 px-4"
      }, /*#__PURE__*/React.createElement("div", {
        className: "footer-navigation__brand d-flex flex-column justify-content-between"
      }, /*#__PURE__*/React.createElement("a", {
        className: "d-block",
        href: config.LMS_BASE_URL,
        "aria-label": intl.formatMessage(messages['footer.logo.ariaLabel'])
      }, /*#__PURE__*/React.createElement("img", {
        style: {
          maxHeight: 45
        },
        src: logo || config.LOGO_TRADEMARK_URL,
        alt: intl.formatMessage(messages['footer.logo.altText'])
      })), /*#__PURE__*/React.createElement(FooterSocial, {
        intl: intl
      })), /*#__PURE__*/React.createElement(FooterLinks, {
        links: links,
        intl: intl
      }), showLanguageSelector && /*#__PURE__*/React.createElement(LanguageSelector, {
        options: supportedLanguages,
        onSubmit: onLanguageSelected
      })), /*#__PURE__*/React.createElement(AdditionalLogosSection, null), /*#__PURE__*/React.createElement(FooterCopyrightSection, {
        intl: intl
      }));
    }
  }]);
  return SiteFooter;
}(React.Component);
SiteFooter.contextType = AppContext;
SiteFooter.propTypes = {
  intl: intlShape.isRequired,
  logo: PropTypes.string,
  onLanguageSelected: PropTypes.func,
  supportedLanguages: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  }))
};
SiteFooter.defaultProps = {
  logo: undefined,
  onLanguageSelected: undefined,
  supportedLanguages: []
};
export default injectIntl(SiteFooter);
export { EVENT_NAMES };
//# sourceMappingURL=Footer.js.map