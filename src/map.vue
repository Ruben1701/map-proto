<template>
    <div id="map"></div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import L from 'leaflet'
  
  export default {
    name: 'Map',
    setup() {
      const map = ref(null)
      const markers = ref([])
  
      onMounted(() => {
        // initialize Leaflet map
        map.value = L.map('map').setView([51.505, -0.09], 13)
  
        // add TileLayer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map.value)
  
        // add markers to the map
        markers.value.forEach(marker => marker.addTo(map.value))
      })
  
      return { map, markers }
    }
  }
  </script>
  
  <style>
  #map {
    height: 100vh;
  }
  </style>
  