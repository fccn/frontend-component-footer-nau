import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import parseEnvSettings from '../../utils/parseData';

const FooterLinkItem = ({ link, locale }) => {
  const renderUrl = (url) => {
    if (typeof url === 'object') { return url[locale]; }
    return url;
  };

  return (
    <li>
      <a href={renderUrl(link.url)}>{link.title[locale]}</a>
    </li>
  );
};

const FooterLinks = ({ intl }) => {
  const getLocaleCode = (intl.locale.split('-')[0] === 'pt') ? 'pt' : 'en';

  const FOOTER_NAV_LINKS = getConfig().FOOTER_NAV_LINKS || process.env.FOOTER_NAV_LINKS;
  const footerLinks = parseEnvSettings(FOOTER_NAV_LINKS);

  if (!footerLinks) { return null; }

  return (
    <nav className="footer-links d-md-flex justify-content-between px-4">
      {footerLinks.map(link => (
        <div className="footer-links-navigation py-3">
          <span>{link.title[getLocaleCode]}</span>
          <ul>
            {link.menus.map(menu => (
              <FooterLinkItem locale={getLocaleCode} link={menu} />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
};

FooterLinkItem.propTypes = {
  locale: PropTypes.string.isRequired,
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
