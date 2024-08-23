import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from '@edx/frontend-platform/i18n';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getConfig } from '@edx/frontend-platform';
import { faFacebookF, faLinkedinIn, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import parseEnvSettings from '../../utils/parseData';
import messages from '../Footer.messages';

const FooterSocialUrl = ({ intl, social }) => {
  const icons = {
    facebook: faFacebookF,
    linkedin: faLinkedinIn,
    instagram: faInstagram,
    newsletter: faEnvelope,
  };

  return (
    <a id={`${social.platform}-link`} className="footer-social__badge" href={social.url} target="_blank" rel="noopener noreferrer" title={intl.formatMessage(messages[social.title])}>
      <FontAwesomeIcon icon={icons[social.platform]} />
    </a>
  );
};

FooterSocialUrl.propTypes = {
  intl: intlShape.isRequired,
  social: PropTypes.shape({
    platform: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

const FooterSocial = ({ intl }) => {
  const FOOTER_SOCIAL_LINKS = getConfig().FOOTER_SOCIAL_LINKS || process.env.FOOTER_SOCIAL_LINKS;

  const socialLinks = parseEnvSettings(FOOTER_SOCIAL_LINKS);

  if (!socialLinks) { return null; }

  return (
    <div className="footer-social d-flex mt-2">
      {socialLinks.map(social => (

        <FooterSocialUrl intl={intl} social={social} />
      ))}
    </div>
  );
};

FooterSocial.propTypes = {
  intl: intlShape.isRequired,
};

export default FooterSocial;
