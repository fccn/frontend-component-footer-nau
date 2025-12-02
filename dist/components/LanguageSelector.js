import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { publish } from '@edx/frontend-platform';
import { getLocale, injectIntl, intlShape, FormattedMessage, LOCALE_CHANGED, handleRtl } from '@edx/frontend-platform/i18n';
import { Dropdown } from '@openedx/paragon';
import { logError } from '@edx/frontend-platform/logging';
import { patchPreferences, postSetLang } from './data/api';
const onLanguageSelected = async (username, selectedLanguageCode) => {
  try {
    if (username) {
      await patchPreferences(username, {
        prefLang: selectedLanguageCode
      });
      await postSetLang(selectedLanguageCode);
    }
    publish(LOCALE_CHANGED, getLocale());
    handleRtl();
  } catch (error) {
    logError(error);
  }
};
const LanguageSelector = _ref => {
  let {
    intl,
    options,
    authenticatedUser,
    compact
  } = _ref;
  const languageLabel = languageCode => {
    const option = options.find(_ref2 => {
      let {
        value
      } = _ref2;
      return value === languageCode;
    });
    return option ? option.label : null;
  };
  const handleChange = (languageCode, event) => {
    const previousSiteLanguage = getLocale();
    /* eslint-disable no-console */
    console.debug(previousSiteLanguage, languageCode, authenticatedUser);
    if (previousSiteLanguage !== languageCode) {
      onLanguageSelected(authenticatedUser?.username, languageCode);
    }
    const languageLabelElement = event.target.parentElement.parentElement.querySelector('.languageLabel');
    languageLabelElement.innerHTML = languageLabel(languageCode);
  };
  const currentLangLabel = languageLabel(intl.locale);
  const showLabel = !(compact || false);
  return /*#__PURE__*/React.createElement(Dropdown, {
    className: "language-selector"
  }, /*#__PURE__*/React.createElement(Dropdown.Toggle, {
    variant: "outline-primary"
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faGlobe
  }), showLabel && (currentLangLabel ? /*#__PURE__*/React.createElement("span", {
    className: "pl-1 languageLabel"
  }, currentLangLabel) : /*#__PURE__*/React.createElement("span", {
    className: "pl-1"
  }, /*#__PURE__*/React.createElement(FormattedMessage, {
    id: "footer.languageForm.select.label",
    defaultMessage: "Choose Language",
    description: "The label for the laguage select part of the language selection form."
  })))), /*#__PURE__*/React.createElement(Dropdown.Menu, null, options.map(_ref3 => {
    let {
      value,
      label
    } = _ref3;
    return /*#__PURE__*/React.createElement(Dropdown.Item, {
      key: value,
      eventKey: value,
      onSelect: handleChange
    }, label);
  })));
};
LanguageSelector.propTypes = {
  authenticatedUser: PropTypes.shape({
    username: PropTypes.string
  }).isRequired,
  intl: intlShape.isRequired,
  compact: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string
  })).isRequired
};
LanguageSelector.defaultProps = {
  compact: false
};
export default injectIntl(LanguageSelector);
//# sourceMappingURL=LanguageSelector.js.map