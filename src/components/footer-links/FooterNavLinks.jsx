import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import messages from '../Footer.messages';
import parseEnvSettings from '../../utils/parseData';

const FooterLinkItem = ({ intl, link }) => {
  const getLocaleCode = (intl.locale.split('-')[0] === 'pt') ? 'pt' : 'en';

  const renderUrl = (url) => {
    if (typeof url === 'object') { return url[getLocaleCode]; }
    return url;
  };

  return (
    <li>
      <a href={renderUrl(link.url)}>{intl.formatMessage(messages[link.title])}</a>
    </li>
  );
};

const FooterLinks = ({ intl }) => {
  const FOOTER_NAV_LINKS = getConfig().FOOTER_NAV_LINKS || process.env.FOOTER_NAV_LINKS;
  const footerLinks = parseEnvSettings(FOOTER_NAV_LINKS);

  if (!footerLinks) { return null; }

  return (
    <nav className="footer-links d-md-flex justify-content-between px-4">
      {footerLinks.map((link) => (
        <div className="footer-links-navigation py-3">
          <span>{intl.formatMessage(messages[link.title])}</span>
          <ul>
            {link.menus.map((menu) => (
              <FooterLinkItem intl={intl} link={menu} />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
};

FooterLinkItem.propTypes = {
  intl: intlShape.isRequired,
  link: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]).isRequired,
  }).isRequired,
};

FooterLinks.propTypes = {
  intl: intlShape.isRequired,
};

export default FooterLinks;
