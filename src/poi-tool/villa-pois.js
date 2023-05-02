const fs = require('fs');
const turf = require('@turf/turf');

// Read the villa data from file
const villas = JSON.parse(fs.readFileSync('./map-proto/src/poi-tool/data/villas2.json'));

// Read the beach data from file
const beaches = JSON.parse(fs.readFileSync('./map-proto/src/poi-tool/data/beaches.geojson'));

//Read the city data from file
const cities = JSON.parse(fs.readFileSync('./map-proto/src/poi-tool/data/beaches.cities'));

// Calculate the nearest beach for a villa
function findNearestBeach(villa, beaches) {
  const villaCoords = turf.point([villa.location.latlng[1], villa.location.latlng[0]]);
  
  // Filter out invalid polygons for each villa
  const validBeaches = beaches.features.filter(feature => {
    if (feature.geometry.type !== 'Polygon') {
      return false;
    }
    const ring = feature.geometry.coordinates[0];
    // return ring.length >= 4 && turf.area(turf.polygon([ring])) > 0;
    return turf.area(turf.polygon([ring])) > 0;

  });
  
  let nearestBeach = null;
  let nearestDistance = Infinity;
  
  validBeaches.forEach((beach, index) => {
    const beachCoords = turf.centroid(beach);
    const distance = turf.distance(villaCoords, beachCoords, {units: 'kilometers'});
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestBeach = {
        id: beach.properties['@id'],
        name: beach.properties.name,
        distance: distance,
        surface: beach.properties.surface,
        coordinates: beach.geometry.coordinates
      };
    }
  });

  return nearestBeach;
}

const results = villas.map(villa => {
  const nearestBeach = findNearestBeach(villa, beaches);
  // const nearestCity = 
  return {
    ...villa,
    nearest_beach: nearestBeach
  };
});

// Output the results
console.log(results);

// Write results to file
fs.writeFileSync('./results.json', JSON.stringify(results));

// Output success message
console.log('Results written to file!');
