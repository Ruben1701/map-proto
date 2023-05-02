<template>
  <div id="app">
    <div class="geo-points">
      <h1>Geo Points</h1>
      <ul>
        <!--  @click="centerMapOnMarker(villa)"> -->
        <li v-for="villa in paginatedVillas" :key="villa.id" @mouseover="highlightMarker(villa)" @mouseleave="unhighlightMarker(villa)">
          <strong>{{ villa.name }}</strong><br />
          {{ villa.location.province }}, {{ villa.location.latlng[0] }}, {{ villa.location.latlng[1] }}<br />
          <div class="pool" v-if="villa.amenities.pool">Pool</div>
          <div class="wifi" v-if="villa.amenities.wifi">Wifi</div>
          <div class="air-conditioning" v-if="villa.amenities.airConditioning">Air conditioning</div>
          <div class="parking" v-if="villa.amenities.parking">Parking</div>
          <p>{{ villa.price }}$</p>
          <p>{{ villa.description }}</p>
        </li>
      </ul>
      <div class="pagination">
        <button v-if="currentPage > 1" @click="currentPage--, this.filterVillas()">Previous</button>
        <button v-for="page in pages" :key="page" @click="currentPage = page, this.filterVillas() ">{{ page }}</button>
        <button v-if="currentPage < pageCount" @click="currentPage++, this.filterVillas()">Next</button>
      </div>
    </div>
    <div id="map"></div>
  </div>
</template>
<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import villas from '@/assets/villas.json'
import '@/assets/style.css'


export default {
  name: 'VillaMap',
  data() {
    return {
      villas,
      filteredVillas: [],
      itemsPerPage: 15,
      currentPage: 1
    }
  },
  computed: {
    paginatedVillas() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredVillas.slice(startIndex, endIndex);
    },
    pageCount() {
      return Math.ceil(this.filteredVillas.length / this.itemsPerPage);
    },
    pages() {
      const pages = [];
      for (let i = 1; i <= this.pageCount; i++) {
        pages.push(i);
      }
      return pages;
    }
  },
  mounted() {
    this.initMap()
    this.addMarkers()
  },
  methods: {
    initMap() {
      this.map = L.map('map').setView([42.5, 12.5], 7.5)
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this.map)

      this.map.on('moveend zoomend', () => {
        this.filterVillas()
      })
    },
    addMarkers() {
      this.paginatedVillas.forEach(point => {
        const marker = L.circleMarker(point.location.latlng, {
          radius: 8,
          fillColor: "black",
          fillOpacity: 1,
          stroke: false
        });
        marker.bindPopup(point.name);

        marker.on('click', () => {
          this.map.setView([42.5, 12.5], 7.5);
          marker.openPopup();
          marker.setStyle({
            radius: 10,
            fillColor: "red",
            fillOpacity: 1,
            stroke: false
          });
        });

        marker.on('mouseover', () => {
          // this.map.setView([42.5, 12.5], 7.5);
          marker.openPopup();
          marker.setStyle({
            radius: 10,
            fillColor: "red",
            fillOpacity: 1,
            stroke: false
          });
        });

        marker.on('mouseleave', () => {
          // this.map.setView([42.5, 12.5], 7.5);
          marker.openPopup();
          marker.setStyle({
            radius: 10,
            fillColor: "black",
            fillOpacity: 1,
            stroke: false
          });
        });

        marker.addTo(this.map);
        point.marker = marker;
      });
    },

    getBoundingbox() {
      // Define the bounding box
      var bounds = null
      if (this.map) {
        bounds = this.map.getBounds();
        // console.log(bounds);
      }
      return bounds
    },
    filterVillas() {
      const bounds = this.getBoundingbox()
      this.filteredVillas = []
      this.villas.forEach(villa => {
        // Check if the point is within the bounding box
        if (bounds.contains(villa.location.latlng)) {
          this.filteredVillas.push(villa)
        }
      })
      // Sort the filtered villas based on some criteria (e.g., price, rating, etc.)
      this.filteredVillas.sort((a, b) => b.rating - a.rating)
      // Slice the first 15 items from the sorted array
      // this.filteredVillas = this.filteredVillas.slice(0, 15)
    },
    highlightMarker(point) {
      point.marker.fire('mouseover'); // Trigger the click event on the marker associated with the geopoint
    },
    unhighlightMarker(point) {
      point.marker.fire('mouseleave'); // Trigger the click event on the marker associated with the geopoint
    },
    centerMapOnMarker(villa) {
      // Get the marker associated with the villa
      const marker = villa.marker;

      // Center the map on the marker's location
      this.map.setView(marker.getLatLng(), 20);
    }
  },
  watch: {
    filteredVillas: {
      handler: function () {
        this.addMarkers();
      },
      immediate: true
    }
  },
}
</script>
