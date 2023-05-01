<template>
    <div id="app">
      <div class="geo-points">
        <h3>Geo Points</h3>
        <ul>
          <li v-for="(point, index) in geoPoints" :key="index" @mouseover="highlightMarker(point)">
            <strong>{{ point.name }}</strong><br />
            {{ point.latlng[0] }}, {{ point.latlng[1] }}
          </li>
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
        geoPoints: [
          {
            name: 'Rome',
            latlng: [41.9028, 12.4964]
          },
          {
            name: 'Florence',
            latlng: [43.7696, 11.2558]
          },
          {
            name: 'Venice',
            latlng: [45.4408, 12.3155]
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
        this.geoPoints.forEach(point => {
          const marker = L.marker(point.latlng, { icon })
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
  