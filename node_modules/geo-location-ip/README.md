# Geo Location IP Package

An npm package to find location using an IP address.

## Installation

Install the package using npm:

```bash
npm install geo-location-ip
```

## Usage
Before using the package, you need to obtain API keys for the geolocation and geocode services. You can get the keys from the following sources:

### Geolocation API Key:
Get the API key from <a href="https://apiip.net/" >apiip.net</a>. Create an account and find the API key in your account settings.

Geocode API Key:
Get the API key from <a href="https://opencagedata.com/">OpenCageData</a>  OpenCage Data. Sign up for an account and obtain the API key from your account dashboard.

## Code Integration
In your code (script.js or any other file), directly set your API keys before using the package:

```bash
const { getGeolocationInfo, getAddressFromCoordinates } = require("geo-location-ip");

// Set your API keys
const geoLocationApiKey = 'your_geolocation_api_key';
const geoCodeApiKey = 'your_geocode_api_key';

// Example: Get Geolocation Information for an IP Address
getGeolocationInfo("8.8.8.8").then((geolocationInfo) => {
  console.log('Geolocation Information:', geolocationInfo);
});

// Example: Get Address from Coordinates
getAddressFromCoordinates(-33, -70).then((address) => {
  console.log('Address:', address);
});
```

Replace 'your_geolocation_api_key' and 'your_geocode_api_key' with your actual API keys. Ensure to keep your API keys secure, and avoid sharing them in public repositories.

Ensure that you have the required dependencies installed by checking your package.json file:
```bash
"dependencies": {
  "node-fetch": "^2.6.1"
}
```

## License
Apache-2.0