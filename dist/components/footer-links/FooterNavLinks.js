import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import parseEnvSettings from '../../utils/parseData';
const FooterLinkItem = _ref => {
  let {
    link,
    locale
  } = _ref;
  const renderUrl = url => {
    if (typeof url === 'object') {
      return url[locale];
    }
    return url;
  };
  return /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: renderUrl(link.url)
  }, link.title[locale]));
};
const FooterLinks = _ref2 => {
  let {
    intl
  } = _ref2;
  const getLocaleCode = intl.locale.split('-')[0] === 'pt' ? 'pt' : 'en';
  const FOOTER_NAV_LINKS = getConfig().FOOTER_NAV_LINKS || process.env.FOOTER_NAV_LINKS;
  const footerLinks = parseEnvSettings(FOOTER_NAV_LINKS);
  if (!footerLinks) {
    return null;
  }
  return /*#__PURE__*/React.createElement("nav", {
    className: "footer-links d-md-flex justify-content-between px-4"
  }, footerLinks.map(link => /*#__PURE__*/React.createElement("div", {
    className: "footer-links-navigation py-3"
  }, /*#__PURE__*/React.createElement("span", null, link.title[getLocaleCode]), /*#__PURE__*/React.createElement("ul", null, link.menus.map(menu => /*#__PURE__*/React.createElement(FooterLinkItem, {
    locale: getLocaleCode,
    link: menu
  }))))));
};
FooterLinkItem.propTypes = {
  locale: PropTypes.string.isRequired,
  link: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
  }).isRequired
};
FooterLinks.propTypes = {
  intl: intlShape.isRequired
};
export default FooterLinks;
//# sourceMappingURL=FooterNavLinks.js.map