import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import {
  APP_PUBSUB_INITIALIZED, APP_CONFIG_INITIALIZED, ensureConfig, getConfig, mergeConfig, subscribe,
} from '@edx/frontend-platform';
import { loadExternalScripts } from '@edx/frontend-platform/initialize';
import { AppContext } from '@edx/frontend-platform/react';

import { hydrateAuthenticatedUser } from '@edx/frontend-platform/auth';
import messages from './Footer.messages';
import LanguageSelector from './LanguageSelector';
import FooterLinks from './footer-links/FooterNavLinks';
import FooterSocial from './footer-links/FooterSocialLinks';
import parseEnvSettings from '../utils/parseData';
import ModalToS from './modal-tos';
import GoogleTagManagerLoader from '../services/gtmLoader';

ensureConfig([
  'LMS_BASE_URL',
  'LOGO_TRADEMARK_URL',
  'LOGO_POWERED_BY',
], 'Footer component');

subscribe(APP_PUBSUB_INITIALIZED, () => {
  mergeConfig({
    GOOGLE_TAG_MANAGER_ID: process.env.GOOGLE_TAG_MANAGER_ID || '',
    GOOGLE_TAG_MANAGER_ENVIRONMENT: process.env.GOOGLE_TAG_MANAGER_ENVIRONMENT || '',
  }, 'NauFooter');
});

subscribe(APP_CONFIG_INITIALIZED, async () => {
  await hydrateAuthenticatedUser();
  loadExternalScripts([GoogleTagManagerLoader], {
    config: getConfig(),
  });
});

const EVENT_NAMES = {
  FOOTER_LINK: 'edx.bi.footer.link',
};

const LogoItem = ({ logo }) => {

  if (!logo.url) {
    return (
      <img src={logo.src} alt={logo.alt} />
    )
  }

  return (
    <a href={logo.url} target="_blank" rel="noopener noreferrer">
      <img src={logo.src} alt={logo.alt} />
    </a>
  )
};

LogoItem.propTypes = {
  logo: PropTypes.shape({
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    url: PropTypes.string,
  }).isRequired,
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
            <LogoItem logo={logo} />
          ))}
        </div>
      ))}
    </section>
  );
};

const InstitutionalLogosSection = () => {
  const FOOTER_INSTITUTIONAL_LOGOS = getConfig().FOOTER_INSTITUTIONAL_LOGOS || process.env.FOOTER_INSTITUTIONAL_LOGOS;

  const logos = parseEnvSettings(FOOTER_INSTITUTIONAL_LOGOS);

  if (!logos) { return null; }

  return (
    <section className="footer-copyright__institutional-logos">
      {logos.map(logo => (
        <a href={logo.url} target="_blank" rel="noopener noreferrer">
          <img src={logo.src} alt={logo.alt} />
        </a>
      ))}
    </section>
  )
};

const FooterCopyrightSection = ({ intl }) => (
  <div className="footer-copyright__text">
    &copy; {new Date().getFullYear()} - FCT|FCCN {intl.formatMessage(messages['footer.copyright.message'])}
  </div>
);

FooterCopyrightSection.propTypes = {
  intl: intlShape.isRequired,
};

const FooterPoweredBy = ({ intl }) => {
  const POWERED_BY = getConfig().LOGO_POWERED_BY || process.env.LOGO_POWERED_BY;

  const poweredBy = parseEnvSettings(POWERED_BY);

  if (!poweredBy) { return null; }

  return (
    <a className="footer-powered-by" href={poweredBy.url} target="_blank" rel="noopener noreferrer">
      <img
        src={poweredBy.src}
        alt={intl.formatMessage(messages['footer.poweredBy.altText'])}
        style={{ width: '6rem' }}
      />
    </a>
  );
};

FooterPoweredBy.propTypes = {
  intl: intlShape.isRequired,
};

class SiteFooter extends React.Component {
  constructor(props) {
    super(props);
    this.externalLinkClickHandler = this.externalLinkClickHandler.bind(this);
  }

  const showLanguageSelector = supportedLanguages.length > 0 && onLanguageSelected;

  const externalLinkClickHandler = (event) => {
    const label = event.currentTarget.getAttribute('href');
    const eventName = EVENT_NAMES.FOOTER_LINK;
    const properties = {
      category: 'outbound_link',
      label,
    };
    sendTrackEvent(eventName, properties);
  };

  render() {
    const {
      logo,
      intl,
    } = this.props;
    const { config, authenticatedUser } = this.context;

    return (
      <footer
        role="contentinfo"
      >
        <AdditionalLogosSection />
        <section className="footer-navigation">
          <div className="container-xl d-xl-flex justify-content-between py-3">
            <div className="footer-navigation__brand d-flex flex-column justify-content-between px-4">
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
              {config.ENABLE_FOOTER_LANG_SELECTOR && (
                <div className="mb-2">
                  <LanguageSelector
                    options={parseEnvSettings(config.SITE_SUPPORTED_LANGUAGES)}
                    authenticatedUser={authenticatedUser}
                  />
                </div>
              )}
              <FooterSocial intl={intl} />
              <FooterPoweredBy intl={intl} />
            </div>
            <FooterLinks intl={intl} />
          </div>
        </section>
        <section className="footer-copyright">
          <div className="container-xl py-3 px-4">
            <InstitutionalLogosSection />
            <FooterCopyrightSection intl={intl} />
          </div>
        </section>
        {
          config.MODAL_UPDATE_TERMS_OF_SERVICE && <ModalToS intl={intl} />
        }
      </footer>
    );
  }
}

SiteFooter.contextType = AppContext;

SiteFooter.propTypes = {
  logo: PropTypes.string,
};

SiteFooter.defaultProps = {
  logo: undefined,
};

export default injectIntl(SiteFooter);
export { EVENT_NAMES };
