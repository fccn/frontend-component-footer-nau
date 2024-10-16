import React from 'react';
import { mergeConfig } from '@edx/frontend-platform';
import { IntlProvider, getLocale } from '@edx/frontend-platform/i18n';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import '@testing-library/jest-dom';

import {
  render, fireEvent, screen, waitFor, act,
} from '@testing-library/react';
import { getUserTOSPreference, updateUserTOSPreference } from './data/api';

import ModalToS from '.';

jest.mock('./data/api');
jest.mock('@edx/frontend-platform/i18n', () => ({
  ...jest.requireActual('@edx/frontend-platform/i18n'),
  getLocale: jest.fn(),
}));
jest.mock('@edx/frontend-platform/auth', () => ({
  ...jest.requireActual('@edx/frontend-platform/auth'),
  getAuthenticatedUser: jest.fn(),
}));

const mockUser = {
  username: 'test_user',
  dateJoined: '2023-10-01T00:00:00Z',
};

const messagesPt = {
  'modalToS.dataAuthorization.checkbox.label': 'Li e compreendi a&nbsp;<a>Política de Privacidade</a>',
  'modalToS.termsOfService.checkbox.label': 'Li e compreendi o {platformName}&nbsp;<a>Termos e Condições</a>',
  'modalToS.honorCode.checkbox.label': 'Li e compreendi o {platformName}&nbsp;<a>Honor Code</a>',
  'modalToS.acceptance.button': 'Aceito os novos termos de serviço',
};
// eslint-disable-next-line react/prop-types
const Component = ({ locale = 'en', messages }) => (<IntlProvider locale={locale} messages={messages}><ModalToS /></IntlProvider>);

describe('ModalTOS Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    getAuthenticatedUser.mockReturnValue(mockUser);

    mergeConfig({
      MODAL_UPDATE_TERMS_OF_SERVICE: {
        title: {
          'pt-pt': 'Atenção',
          en: 'Attention',
        },
        body: {
          'pt-pt': 'A informação legal para uso do serviço foi atualizada.',
          en: 'The legal information for using the service has been updated.',
        },
        date_iso_8601: '2023-11-10',
        data_authorization: true,
        terms_of_service: true,
        honor_code: false,
      },
      TERMS_OF_SERVICE_URL: '/terms',
      PRIVACY_POLICY_URL: '/privacy',
      TOS_AND_HONOR_CODE: '/honor-code',
    });
  });

  test('does not render the modal if MODAL_UPDATE_TERMS_OF_SERVICE is not configured', async () => {
    mergeConfig({
      MODAL_UPDATE_TERMS_OF_SERVICE: '',
    });

    getUserTOSPreference.mockResolvedValue(null); // Simulate user hasn't accepted yet

    render(<Component />);

    // Wait for any possible modal render (if it were to render)
    await waitFor(() => {
      expect(screen.queryByText(/Attention/i)).toBeNull();
    });

    // Assert that the modal does not appear
    expect(screen.queryByText(/Attention/i)).toBeNull();
  });

  test('renders the modal with configured checkboxes when user have not accept the new terms of service', async () => {
    getUserTOSPreference.mockResolvedValue(null);
    render(<Component />);

    await waitFor(() => screen.getByText(/Attention/i));

    // Check if the modal is rendered with the correct checkboxes
    expect(screen.getByText(/Attention/i)).toBeInTheDocument();
    expect(document.querySelectorAll('input[type="checkbox"]').length).toBe(2);
  });

  test('renders the modal in the correct language based on the user’s cookie', async () => {
    getUserTOSPreference.mockResolvedValue(null);
    getLocale.mockReturnValue('pt-pt');

    render(<Component locale="pt-pt" messages={messagesPt} />);

    // Wait until the modal renders
    await waitFor(() => screen.getByText(/Atenção/i));

    // Check that the title and body are rendered in Portuguese
    expect(screen.getByText(/Atenção/i)).toBeInTheDocument();
    expect(screen.getByText(/Aceito os novos termos de serviço/i)).toBeInTheDocument();
  });

  test('disables the button until all checkboxes are checked', async () => {
    getUserTOSPreference.mockResolvedValue(null);

    render(<Component />);

    await waitFor(() => screen.getByText(/Attention/i));

    const button = screen.getByRole('button', { name: /Accept new terms of service/i });
    expect(button).toBeDisabled();

    const privacyCheckbox = screen.getByLabelText(/Privacy Policy/i);
    const termsCheckbox = screen.getByLabelText(/Terms of Service/i, { selector: 'input' });

    fireEvent.click(privacyCheckbox); // Click first checkbox
    expect(button).toBeDisabled(); // Button should still be disabled

    fireEvent.click(termsCheckbox); // Click second checkbox
    expect(button).toBeEnabled(); // Button should now be enabled
  });

  test('calls updateUserTOSPreference and closes modal when clicking Accept', async () => {
    getUserTOSPreference.mockResolvedValue(null);

    render(<Component />);

    await waitFor(() => screen.getByText(/Attention/i));

    const privacyCheckbox = screen.getByLabelText(/Privacy Policy/i);
    const termsCheckbox = screen.getByLabelText(/Terms of Service/i, { selector: 'input' });

    // Check all checkboxes
    fireEvent.click(privacyCheckbox);
    fireEvent.click(termsCheckbox);

    const button = screen.getByRole('button', { name: /Accept new terms of service/i });
    fireEvent.click(button); // Click the "Accept" button

    // Check that the API call is made with the correct arguments
    expect(updateUserTOSPreference).toHaveBeenCalledWith(mockUser.username, 'update_terms_of_service_2023_11_10');

    // Wait until modal closes (assert that the modal content is removed from the DOM)
    await waitFor(() => expect(screen.queryByText(/Attention/i)).not.toBeInTheDocument());
  });

  it('does not render the modal if the user already accept the terms of service', async () => {
    getUserTOSPreference.mockResolvedValue('True'); // Simulate user has already accepted TOS

    await act(async () => {
      render(<Component />);
    });

    // Assert that the modal does not appear
    expect(screen.queryByText(/Attention/i)).toBeNull();
  });
});
