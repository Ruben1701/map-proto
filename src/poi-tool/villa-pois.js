const fs = require('fs');
const turf = require('@turf/turf');

// Read the villa data from file
const villas = JSON.parse(fs.readFileSync('./map-proto/src/poi-tool/data/villas2.json'));

// Read the beach data from file
const beaches = JSON.parse(fs.readFileSync('./map-proto/src/poi-tool/data/beaches.geojson'));
// Filter out invalid polygons
const validBeaches = beaches.features.filter(feature => {
  if (feature.geometry.type !== 'Polygon') {
    return false;
  }
  const ring = feature.geometry.coordinates[0];
  // return ring.length >= 4 && turf.area(turf.polygon([ring])) > 0;
  return turf.area(turf.polygon([ring])) > 0;

});

//Read the city data from file
const cities = JSON.parse(fs.readFileSync('./map-proto/src/poi-tool/data/cities.geojson'));

// Read the wine region data from file
const wineRegions = JSON.parse(fs.readFileSync('./map-proto/src/poi-tool/data/wine-regions.geojson'));


// Calculate the nearest beach, wine region, and city for a villa
function findNearest(villa, pointOfInterest) {
  const villaCoords = turf.point([villa.location.latlng[1], villa.location.latlng[0]]);

  let nearest = null;
  let nearestDistance = Infinity;

  switch(pointOfInterest) {

    case 'beaches':
      validBeaches.forEach(beach => {
        const beachCoords = turf.centroid(beach);
        const distance = turf.distance(villaCoords, beachCoords, { units: 'kilometers' });
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = {
            id: beach.properties['@id'],
            name: beach.properties.name,
            distance: distance,
            surface: beach.properties.surface,
            coordinates: beach.geometry.coordinates
          };
        }
      });

      return nearest;

      case 'wine-region':
        wineRegions.features.forEach(region => {
          const regionCoords = turf.centroid(region);
          const distance = turf.distance(villaCoords, regionCoords, { units: 'kilometers' });
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearest = {
              name: region.properties.region_name,
              grapes: region.properties.grapes,
              distance: distance,
              // You can add more properties of the wine region as needed
              // based on the structure of your wine region GeoJSON file
              coordinates: region.geometry.coordinates
            };
          }
        });
        
        return nearest;


    case 'cities':
      cities.features.forEach(city => {
        const cityCoords = turf.centroid(city);
        const distance = turf.distance(villaCoords, cityCoords, { units: 'kilometers' });
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = {
            id: city.properties['@id'],
            name: city.properties.name,
            distance: distance,
            population: city.properties.population,
            coordinates: city.geometry.coordinates
          };
        }
      });
    
      return nearest;

  }

  
}

// findNearest(villa, POI){

// }

const results = villas.map(villa => {
  const nearestBeach = findNearest(villa, 'beaches');
  const nearestCity = findNearest(villa, 'cities')
  const nearestWineRegion = findNearest(villa, 'wine-region');
  // const nearestCity = 
  return {
    ...villa,
    nearest_City: nearestCity,
    nearest_beach: nearestBeach,
    nearest_wine_region: nearestWineRegion
  };
});

// Output the results
console.log(results);

// Write results to file
fs.writeFileSync('./results.json', JSON.stringify(results));

// Output success message
console.log('Results written to file!');
