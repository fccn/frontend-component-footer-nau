const parseEnvSettings = (setting) => {
  try {
    if (Array.isArray(setting)) {
      return setting;
    }
    return JSON.parse(setting);
  } catch (e) {
    return null;
  }
};

export default parseEnvSettings;
