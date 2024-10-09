import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { ensureConfig, getConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';

import messages from './Footer.messages';
import LanguageSelector from './LanguageSelector';
import FooterLinks from './footer-links/FooterNavLinks';
import FooterSocial from './footer-links/FooterSocialLinks';
import parseEnvSettings from '../utils/parseData';

ensureConfig([
  'LMS_BASE_URL',
  'LOGO_TRADEMARK_URL',
], 'Footer component');

const EVENT_NAMES = {
  FOOTER_LINK: 'edx.bi.footer.link',
};

const AdditionalLogosSection = () => {
  const FOOTER_ADDITIONAL_LOGOS = getConfig().FOOTER_ADDITIONAL_LOGOS || process.env.FOOTER_ADDITIONAL_LOGOS;

  const logos = parseEnvSettings(FOOTER_ADDITIONAL_LOGOS);

  if (!logos) { return null; }

  return (
    <section className="footer-additional-logos">
      {logos.map(line => (
        <div className="footer-additional-logos__line">
          {Array.isArray(line) && line.map(logo => (
            <a href={logo.url} target="_blank" rel="noopener noreferrer">
              <img src={logo.src} alt={logo.alt} />
            </a>
          ))}
        </div>
      ))}
    </section>
  );
};

const FooterCopyrightSection = ({ intl }) => (
  <section className="footer-copyright py-3 px-4">
    <div className="footer-copyright__logo">
      <span>&copy; {new Date().getFullYear()} - FCT|FCCN
        <br />
        {intl.formatMessage(messages['footer.copyright.message'])}
      </span>
    </div>
  </section>
);

FooterCopyrightSection.propTypes = {
  intl: intlShape.isRequired,
};

class SiteFooter extends React.Component {
  constructor(props) {
    super(props);
    this.externalLinkClickHandler = this.externalLinkClickHandler.bind(this);
  }

  externalLinkClickHandler(event) {
    const label = event.currentTarget.getAttribute('href');
    const eventName = EVENT_NAMES.FOOTER_LINK;
    const properties = {
      category: 'outbound_link',
      label,
    };
    sendTrackEvent(eventName, properties);
  }

  render() {
    const {
      supportedLanguages,
      onLanguageSelected,
      logo,
      intl,
    } = this.props;
    const showLanguageSelector = supportedLanguages.length > 0 && onLanguageSelected;
    const { config } = this.context;

    return (
      <footer
        role="contentinfo"
      >
        <section className="footer-navigation container-fluid d-md-flex justify-content-between py-3 px-4">
          <div className="footer-navigation__brand d-flex flex-column justify-content-between">
            <a
              className="d-block"
              href={config.LMS_BASE_URL}
              aria-label={intl.formatMessage(messages['footer.logo.ariaLabel'])}
            >
              <img
                style={{ maxHeight: 45 }}
                src={logo || config.LOGO_TRADEMARK_URL}
                alt={intl.formatMessage(messages['footer.logo.altText'])}
              />
            </a>
            <FooterSocial intl={intl} />
          </div>
          <FooterLinks intl={intl} />

          {showLanguageSelector && (
            <LanguageSelector
              options={supportedLanguages}
              onSubmit={onLanguageSelected}
            />
          )}
        </section>
        <AdditionalLogosSection />
        <FooterCopyrightSection intl={intl} />
      </footer>
    );
  }
}

SiteFooter.contextType = AppContext;

SiteFooter.propTypes = {
  intl: intlShape.isRequired,
  logo: PropTypes.string,
  onLanguageSelected: PropTypes.func,
  supportedLanguages: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),
};

SiteFooter.defaultProps = {
  logo: undefined,
  onLanguageSelected: undefined,
  supportedLanguages: [],
};

export default injectIntl(SiteFooter);
export { EVENT_NAMES };
