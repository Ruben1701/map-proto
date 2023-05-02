<template>
    <div id="app">
      <div class="geo-points">
        <h3>Geo Points</h3>
        <ul>
          <ul>
            <li v-for="(villa, index) in villas" :key="index" @click="highlightMarker(villa)">
              <strong>{{ villa.name }}</strong><br />
              {{ villa.location.province }}, {{ villa.location.latlng[0] }}, {{ villa.location.latlng[1] }}<br />
              <div v-if="villa.amenities.pool">Pool</div>
              <div v-if="villa.amenities.wifi">Wifi</div>
              <div v-if="villa.amenities.airConditioning">Air conditioning</div>
              <div v-if="villa.amenities.parking">Parking</div>
              <p>{{ villa.description }}</p>
            </li>
          </ul>
        </ul>
      </div>
      <div id="map"></div>
    </div>
  </template>
  <script>
  import L from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  
  export default {
    name: 'VillaMap',
    data() {
      return {
        villas: [
          {
            name: 'Villa Amalfi',
            location: {
              province: 'Salerno',
              latlng: [40.6333, 14.6]
            },
            amenities: {
              pool: true,
              wifi: true,
              airConditioning: true,
              parking: true
            },
            description: 'A luxurious villa with stunning views of the Amalfi Coast.'
          },
          {
            name: 'Villa Tuscany',
            location: {
              province: 'Siena',
              latlng: [43.3183, 11.3306]
            },
            amenities: {
              pool: true,
              wifi: true,
              airConditioning: false,
              parking: true
            },
            description: 'A beautiful Tuscan villa surrounded by rolling hills and vineyards.'
          },
          {
            name: 'Villa Lake Como',
            location: {
              province: 'Como',
              latlng: [45.9642, 9.2462]
            },
            amenities: {
              pool: false,
              wifi: true,
              airConditioning: true,
              parking: true
            },
            description: 'A charming villa located on the shores of Lake Como.'
          }
        ]
      }
    },
    mounted() {
      this.initMap()
      this.addMarkers()
    },
    methods: {
      initMap() {
        this.map = L.map('map').setView([42.5, 12.5], 6)
        L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 22
        }).addTo(this.map)
      },
      addMarkers() {
        const icon = L.icon({
          iconUrl: 'https://cdn.jsdelivr.net/leaflet/1.0.0-rc.1/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41]
        })
        this.villas.forEach(point => {
          const marker = L.marker(point.location.latlng, { icon })
          marker.bindPopup(point.name) // Add a popup with the name of the geopoint to each marker
          marker.on('click', () => {
            marker.openPopup(); // Open the popup when the marker is clicked
          })
          marker.addTo(this.map)
          point.marker = marker // Store the marker associated with each geopoint
        })
      },
      highlightMarker(point) {
        point.marker.fire('click'); // Trigger the click event on the marker associated with the geopoint
      }
    }
  }
  </script>
  
  
  <style> #app {
     display: flex;
     flex-direction: row;
   }
  
   #map {
     height: 100vh;
     width: 75vw;
     position: relative;
   }
  
   .geo-points {
     width: 25vw;
     margin-right: 10px;
   }
  </style>
  