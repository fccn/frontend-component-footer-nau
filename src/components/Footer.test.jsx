/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import renderer from 'react-test-renderer';
import {
  render, waitFor,
} from '@testing-library/react';
import { initializeMockApp } from '@edx/frontend-platform';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';
import '@testing-library/jest-dom';

import Footer from './Footer';
import FooterSlot from '../plugin-slots/FooterSlot';
import StudioFooterHelpSectionSlot from '../plugin-slots/StudioFooterHelpSectionSlot';

import { patchPreferences, postSetLang } from './data/api';

jest.mock('./data/api', () => ({
  patchPreferences: jest.fn(),
  postSetLang: jest.fn(),
}));

const FooterWithContext = ({ locale = 'pt-pt' }) => {
  const contextValue = useMemo(() => ({
    authenticatedUser: null,
    config: {
      LOGO_TRADEMARK_URL: process.env.LOGO_TRADEMARK_URL,
      LMS_BASE_URL: process.env.LMS_BASE_URL,
      SITE_NAME: process.env.SITE_NAME,
    },
  }), []);

  return (
    <IntlProvider locale={locale}>
      <AppContext.Provider
        value={contextValue}
      >
        <FooterSlot />
      </AppContext.Provider>
    </IntlProvider>
  );
};

const FooterWithLanguageSelector = () => {
  const contextValue = useMemo(() => ({
    authenticatedUser: { username: 'user123' },
    config: {
      LOGO_TRADEMARK_URL: process.env.LOGO_TRADEMARK_URL,
      LMS_BASE_URL: process.env.LMS_BASE_URL,
      SITE_NAME: process.env.SITE_NAME,
      ENABLE_FOOTER_LANG_SELECTOR: true,
      SITE_SUPPORTED_LANGUAGES: [
        { label: 'English', value: 'en' },
        { label: 'Português', value: 'pt-pt' },
      ],
    },
  }), []);

  return (
    <IntlProvider locale="en">
      <AppContext.Provider
        value={contextValue}
      >
        <Footer />
      </AppContext.Provider>
    </IntlProvider>
  );
};

describe('<Footer />', () => {
  describe('renders correctly', () => {
    it('renders without a language selector', () => {
      const tree = renderer
        .create(<FooterWithContext locale="en" />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('renders without a language selector in pt-pt', () => {
      const tree = renderer
        .create(<FooterWithContext locale="pt-pt" />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('renders with a language selector', () => {
      const tree = renderer
        .create(<FooterWithLanguageSelector />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('handles language switching', () => {
    it('calls patchPreferences and postSetLang when a language is changed', async () => {
      initializeMockApp();
      render(<FooterWithLanguageSelector />);

      await waitFor(() => {
        document.querySelector('.language-selector');
      });
      expect(document.querySelectorAll('.language-selector').length).toBe(1);

      document.querySelector('.language-selector>button').click();

      Array.from(document.querySelectorAll('.dropdown-menu.show a')).filter((e) => e.innerHTML === 'Português')[0].click();

      await waitFor(() => {
        expect(patchPreferences).toHaveBeenCalledWith('user123', { prefLang: 'pt-pt' });
      });
      await waitFor(() => {
        expect(postSetLang).toHaveBeenCalledWith('pt-pt');
      });
    });
  });
});

describe('<StudioFooterHelpSectionSlot />', () => {
  const SectionWithContext = ({ locale = 'es' }) => {
    const contextValue = useMemo(() => ({
      authenticatedUser: null,
      config: {
        LOGO_TRADEMARK_URL: process.env.LOGO_TRADEMARK_URL,
        LMS_BASE_URL: process.env.LMS_BASE_URL,
      },
    }), []);

    return (
      <IntlProvider locale={locale}>
        <AppContext.Provider
          value={contextValue}
        >
          <StudioFooterHelpSectionSlot />
        </AppContext.Provider>
      </IntlProvider>
    );
  };

  it('renders correctly', () => {
    const tree = renderer
      .create(<SectionWithContext />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
