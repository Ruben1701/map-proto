<template>
  <router-link :to="{ name: 'Home' }">
    Back
  </router-link>
  <div v-if="villa">
    <h1>{{ villa.name }}</h1>

    <div class="container">

      <div class="villa-images"></div>
      <div class="description">
        <p>{{ villa.description }}</p>
      </div>
      <div class="amenities">
        <div class="left">
          <div class="pool" v-if="villa.amenities.pool">Pool</div>
          <div class="parking" v-if="villa.amenities.parking">Parking</div>
        </div>
        <div class="middle">
          <div class="wifi" v-if="villa.amenities.wifi">Wifi</div>
        </div>
        <div class="centre">
          <div class="air-conditioning" v-if="villa.amenities.airConditioning">Air conditioning</div>
        </div>
      </div>
      <div class="map"></div>
      <div class="POIs">
        <div class="left">
          <div class="nearest-beach">Nearest beach: {{ villa.nearest_beach.name }} {{ villa.nearest_beach.distance }}km</div>
        </div>
        <div class="middle"></div>
        <div class="centre">
          <div class="wine-region">{{ villa.nearest_wine_region.name }}
            <ul>
              <li v-for="grape in villa.nearest_wine_region.grapes" :key="grape[0]">
                {{ grape[0] }} - {{ grape[1] }}
              </li>
            </ul>
          </div>
          
          
        </div>
      </div>
      <p>{{ villa.price }}$</p>
    </div>
    <div id="map" class="detail-map"></div>
  </div>
  <div v-else>
    <p>Loading villa data...</p>
  </div>
</template>

<script>
import '@/assets/style.css'

import villas from "@/assets/results.json";
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: "VillaDetails",
  data() {
    return {
      villa: null,
    };
  },
  created() {
    const villaId = this.$route.params.id;
    this.villa = villas.find(villa => villa.id.toString() === villaId)
  },
  mounted() {
    this.initMap(),
      this.addMarker()
  },
  methods: {
    initMap() {
      this.map = L.map('map').setView([this.villa.location.latlng[0], this.villa.location.latlng[1]], 16)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }).addTo(this.map)

      this.map.on('moveend zoomend', () => {
        // this.filterVillas()
      })
    },
    addMarker() {
      const marker = L.circleMarker(this.villa.location.latlng, {
        radius: 8,
        fillColor: "black",
        fillOpacity: 1,
        stroke: false
      });
      marker.bindPopup(this.villa.name);

      marker.on('click', () => {
      });

      marker.on('mouseover', () => {
      });

      marker.on('mouseleave', () => {
      });

      marker.addTo(this.map);
      this.villa.marker = marker;
    },
  }
};
</script>
<style>
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "villa-images villa-images villa-images"
    "description description description"
    "amenities amenities amenities"
    "map map map"
    "POIs POIs POIs";
}

.villa-images {
  grid-area: villa-images;
}

.description {
  grid-area: description;
}

.amenities {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "left middle centre"
    "left middle centre"
    "left middle centre";
  grid-area: amenities;
}

.left {
  grid-area: left;
}

.middle {
  grid-area: middle;
}

.centre {
  grid-area: centre;
}

.map {
  grid-area: map;
}

.POIs {
  grid-area: POIs;
}


.detail-map {
  min-width: 100%;
  max-height: 400px;
}
</style>
