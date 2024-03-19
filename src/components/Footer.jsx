import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { ensureConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

import messages from './Footer.messages';
import LanguageSelector from './LanguageSelector';
import { links, social } from '../data/footerLinks';
import FooterLinks from './footer-links/FooterLinks';

ensureConfig([
  'LMS_BASE_URL',
  'LOGO_TRADEMARK_URL',
], 'Footer component');

const EVENT_NAMES = {
  FOOTER_LINK: 'edx.bi.footer.link',
};

const FOOTER_LOGOS = process.env.FOOTER_ADDITIONAL_LOGOS;

const FooterSocial = ({ intl }) => (
  <div className="footer-social d-flex mt-2">
    <a className="footer-social__badge" href={social?.newsletter} target="_blank" rel="noopener noreferrer" title={intl.formatMessage(messages['footer.nau.social.newsletter'])}>
      <FontAwesomeIcon icon={faEnvelope} />
    </a>
    <a className="footer-social__badge" href={social?.facebook} target="_blank" rel="noopener noreferrer" title={intl.formatMessage(messages['footer.nau.social.facebook'])}>
      <FontAwesomeIcon icon={faFacebookF} />
    </a>
    <a className="footer-social__badge" href={social?.linkedin} target="_blank" rel="noopener noreferrer" title={intl.formatMessage(messages['footer.nau.social.linkedin'])}>
      <FontAwesomeIcon icon={faLinkedinIn} />
    </a>
  </div>
);

FooterSocial.propTypes = {
  intl: intlShape.isRequired,
};

const AdditionalLogosSection = () => {
  const parseFooterLogos = () => {
    try {
      return JSON.parse(FOOTER_LOGOS);
    } catch (e) {
      return null;
    }
  };

  const logos = parseFooterLogos();

  if (!logos) { return null; }

  return (
    <section className="footer-additional-logos">
      <div className="d-md-flex justify-content-between px-4">
        {logos.map((logo) => (
          <div className="py-3">
            <a href={logo.url} target="_blank" rel="noopener noreferrer">
              <img src={logo.src} alt={logo.alt} style={{ maxHeight: '45px', maxWidth: '280px' }} />
            </a>
          </div>
        ))}
      </div>
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
          <FooterLinks links={links} intl={intl} />

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
