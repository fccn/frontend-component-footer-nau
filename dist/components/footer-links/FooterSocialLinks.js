import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from '@edx/frontend-platform/i18n';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getConfig } from '@edx/frontend-platform';
import { faFacebookF, faLinkedinIn, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import parseEnvSettings from '../../utils/parseData';
const FooterSocialUrl = _ref => {
  let {
    locale,
    social
  } = _ref;
  const icons = {
    facebook: faFacebookF,
    linkedin: faLinkedinIn,
    instagram: faInstagram,
    newsletter: faEnvelope
  };
  return /*#__PURE__*/React.createElement("a", {
    id: `${social.platform}-link`,
    className: "footer-social__badge",
    href: social.url,
    target: "_blank",
    rel: "noopener noreferrer",
    title: social.title[locale]
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: icons[social.platform]
  }));
};
FooterSocialUrl.propTypes = {
  locale: PropTypes.string.isRequired,
  social: PropTypes.shape({
    platform: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }).isRequired
};
const FooterSocial = _ref2 => {
  let {
    intl
  } = _ref2;
  const getLocaleCode = intl.locale.split('-')[0] === 'pt' ? 'pt' : 'en';
  const FOOTER_SOCIAL_LINKS = getConfig().FOOTER_SOCIAL_LINKS || process.env.FOOTER_SOCIAL_LINKS;
  const socialLinks = parseEnvSettings(FOOTER_SOCIAL_LINKS);
  if (!socialLinks) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "footer-social d-flex mt-2"
  }, socialLinks.map(social => /*#__PURE__*/React.createElement(FooterSocialUrl, {
    locale: getLocaleCode,
    social: social
  })));
};
FooterSocial.propTypes = {
  intl: intlShape.isRequired
};
export default FooterSocial;
//# sourceMappingURL=FooterSocialLinks.js.map