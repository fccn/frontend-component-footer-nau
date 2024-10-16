import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { ACCEPTANCE_TOS } from './constants';

const preferencesUrl = () => `${getConfig().LMS_BASE_URL}/api/user/v1/preferences/`;

export const getUserTOSPreference = async (username, tosKey) => {
  try {
    const { data } = await getAuthenticatedHttpClient().get(`${preferencesUrl()}${username}/${tosKey}`);
    return data;
  } catch (error) {
    if (error.customAttributes.httpErrorStatus === 404) { return null; }
    throw error;
  }
};

export const updateUserTOSPreference = async (username, tosKey) => {
  try {
    const response = await getAuthenticatedHttpClient().put(`${preferencesUrl()}${username}/${tosKey}`, ACCEPTANCE_TOS, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    return null;
  }
};
