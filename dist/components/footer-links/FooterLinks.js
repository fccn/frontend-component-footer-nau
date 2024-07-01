function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from '@edx/frontend-platform/i18n';
import messages from '../Footer.messages';
var FooterLinkItem = function FooterLinkItem(_ref) {
  var intl = _ref.intl,
    link = _ref.link;
  var getLocaleCode = intl.locale.split('-')[0] === 'pt' ? 'pt' : 'en';
  var renderUrl = function renderUrl(url) {
    if (_typeof(url) === 'object') {
      return url[getLocaleCode];
    }
    return url;
  };
  return /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: renderUrl(link.url)
  }, intl.formatMessage(messages[link.title])));
};
var FooterLinks = function FooterLinks(_ref2) {
  var intl = _ref2.intl,
    links = _ref2.links;
  if (!links) {
    return null;
  }
  return /*#__PURE__*/React.createElement("nav", {
    className: "footer-links d-md-flex justify-content-between px-4"
  }, links.map(function (link) {
    return /*#__PURE__*/React.createElement("div", {
      className: "footer-links-navigation py-3"
    }, /*#__PURE__*/React.createElement("span", null, intl.formatMessage(messages[link.title])), /*#__PURE__*/React.createElement("ul", null, link.menus.map(function (menu) {
      return /*#__PURE__*/React.createElement(FooterLinkItem, {
        intl: intl,
        link: menu
      });
    })));
  }));
};
FooterLinkItem.propTypes = {
  intl: intlShape.isRequired,
  link: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
  }).isRequired
};
FooterLinks.propTypes = {
  intl: intlShape.isRequired,
  links: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    menus: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
    })).isRequired
  }))
};
FooterLinks.defaultProps = {
  links: []
};
export default FooterLinks;
//# sourceMappingURL=FooterLinks.js.map