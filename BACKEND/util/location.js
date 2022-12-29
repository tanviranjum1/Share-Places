const API_KEY = '';

async function getCoordsForAddress(address) {
  // if no credit card.
  return {
    lat: 40.7484474,
    lng: -73.9871516,
  };
}

module.exports = getCoordsForAddress;
