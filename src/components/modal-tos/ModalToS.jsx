import React, { useEffect, useState } from 'react';

import { convertKeyNames, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { FormattedMessage, getLocale, injectIntl } from '@edx/frontend-platform/i18n';
import {
  Button, Form, Hyperlink, ModalDialog, useToggle, useCheckboxSetValues,
  ActionRow,
} from '@openedx/paragon';

import { getUserTOSPreference, updateUserTOSPreference } from './data/api';
import { CAMEL_CASE_KEYS } from './data/constants';
import parseEnvSettings from '../../utils/parseData';

const createTOSLink = (chunks, url) => (
  <Hyperlink
    destination={url}
    target="_blank"
  >{chunks}
  </Hyperlink>
);

const ModalToS = () => {
  const [tosPreference, setTosPreference] = useState(undefined);
  const [isOpen, open, close] = useToggle(false);

  const {
    MODAL_UPDATE_TERMS_OF_SERVICE,
    PRIVACY_POLICY_URL,
    SITE_NAME,
    TERMS_OF_SERVICE_URL,
    TOS_AND_HONOR_CODE,
  } = getConfig();

  const modalSettings = parseEnvSettings(MODAL_UPDATE_TERMS_OF_SERVICE) || MODAL_UPDATE_TERMS_OF_SERVICE || {};
  const {
    body = {},
    title = {},
    dateIso8601,
    dataAuthorization = false,
    honorCode = false,
    termsOfService = false,
  } = convertKeyNames(modalSettings, CAMEL_CASE_KEYS);

  const {
    dateJoined,
    username,
  } = getAuthenticatedUser();

  const lang = getLocale() || 'en';
  const tosKey = `update_terms_of_service_${dateIso8601?.replaceAll('-', '_')}`;
  const [checkboxValues, { add, remove }] = useCheckboxSetValues([]);

  useEffect(() => {
    if (username && dateIso8601) {
      getUserTOSPreference(username, tosKey).then(userTos => {
        setTosPreference(userTos);
        if (userTos === null) {
          open();
        }
      });
    }
  }, [dateIso8601, tosKey, username, open]);

  const setAcceptance = () => {
    updateUserTOSPreference(username, tosKey);
    close();
  };

  const numCheckBox = [dataAuthorization, termsOfService, honorCode]
    .reduce((prev, curr) => (curr ? prev + 1 : prev), 0);

  const handleChange = e => {
    if (e.target.checked) {
      add(e.target.value);
    } else {
      remove(e.target.value);
    }
  };

  if (tosPreference || !dateIso8601 || !username
    || new Date(dateIso8601) < new Date(dateJoined)) {
    return null;
  }

  return (
    <ModalDialog
      title="Modal Terms of Service"
      isBlocking
      isOpen={isOpen}
      onClose={close}
      hasCloseButton={false}
    >
      {title[lang] && (
      <ModalDialog.Header>
        <ModalDialog.Title>
          {title[lang]}
        </ModalDialog.Title>
      </ModalDialog.Header>
      )}
      <ModalDialog.Body>
        {body[lang]}
        <Form className="my-4">
          <Form.CheckboxSet
            name="TOSCheckbox"
            onChange={handleChange}
            value={checkboxValues}
          >
            {dataAuthorization
              && (
                <Form.Checkbox value="dataAuthorization">
                  <FormattedMessage
                    id="modalToS.dataAuthorization.checkbox.label"
                    description="The label for the data authorization checkbox inside the TOS modal."
                    defaultMessage="I have read and understood the&nbsp;<a>Privacy Policy</a>"
                    values={{
                      a: chunks => createTOSLink(chunks, PRIVACY_POLICY_URL),
                    }}
                  />
                </Form.Checkbox>
              )}
            {termsOfService
              && (
                <Form.Checkbox value="termsOfService">
                  <FormattedMessage
                    id="modalToS.termsOfService.checkbox.label"
                    description="The label for the terms of service checkbox inside the TOS modal."
                    defaultMessage="I agree to the {platformName}&nbsp;<a>Terms of Service</a>"
                    values={{
                      a: chunks => createTOSLink(chunks, TERMS_OF_SERVICE_URL),
                      platformName: SITE_NAME,
                    }}
                  />
                </Form.Checkbox>
              )}
            {honorCode
              && (
                <Form.Checkbox value="honorCode">
                  <FormattedMessage
                    id="modalToS.honorCode.checkbox.label"
                    description="The label for the honor code checkbox inside the TOS modal."
                    defaultMessage="I agree to the {platformName}&nbsp;<a>Honor Code</a>"
                    values={{
                      a: chunks => createTOSLink(chunks, TOS_AND_HONOR_CODE),
                      platformName: SITE_NAME,
                    }}
                  />
                </Form.Checkbox>
              )}
          </Form.CheckboxSet>
        </Form>
        <ActionRow isStacked>
          <Button
            variant="primary"
            disabled={numCheckBox !== checkboxValues.length}
            onClick={setAcceptance}
            data-testid="modalToSButton"
          >
            <FormattedMessage
              id="modalToS.acceptance.button"
              description="The label for the button inside the TOS modal."
              defaultMessage="Accept new terms of service"
            />
          </Button>
        </ActionRow>
      </ModalDialog.Body>
    </ModalDialog>
  );
};

export default injectIntl(ModalToS);
