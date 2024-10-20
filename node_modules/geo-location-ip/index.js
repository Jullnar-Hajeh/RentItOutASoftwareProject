const fetch = require('node-fetch');

async function getGeolocationInfo(ipAddress) {
  try {
    console.log(process.env)
    console.log(geoCodeApiKey)
    const apiUrl = `https://apiip.net/api/check?ip=${ipAddress}&accessKey=${geoLocationApiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

async function getAddressFromCoordinates(latitude, longitude) {
  try {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}%2C${longitude}&key=${geoCodeApiKey}`;
    const response = await fetch(url);
    const result = await response.json();

    if (result && result.results && result.results.length > 0) {
      const address = result.results[0].formatted;
      return address;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

module.exports = {
  getGeolocationInfo,
  getAddressFromCoordinates,
};
