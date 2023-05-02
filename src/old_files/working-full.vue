<template>
    <div id="app">
        <div class="geo-points">
            <h1>Geo Points</h1>
            <ul>
                <li v-for="(villa, index) in paginatedVillas" :key="index" @mouseover="highlightMarker(villa)"
                    @mouseleave="unhighlightMarker(villa)" @click="centerMapOnMarker(villa)">
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
                <button v-if="currentPage > 1" @click="currentPage--">Previous</button>
                <button v-for="page in pages" :key="page" @click="currentPage = page">{{ page }}</button>
                <button v-if="currentPage < pageCount" @click="currentPage++">Next</button>
            </div>
        </div>
        <div id="map"></div>
    </div>
</template>
<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import villas from '@/assets/villas.json'


export default {
    name: 'VillaMap',
    data() {
        return {
            villas,
            itemsPerPage: 6,
            currentPage: 1
        }
    },
    computed: {
        paginatedVillas() {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage
            const endIndex = startIndex + this.itemsPerPage
            return this.filteredVillas.slice(startIndex, endIndex)
        },
        pageCount() {
            return Math.ceil(this.villas.length / this.itemsPerPage)
        },
        pages() {
            const pages = []
            for (let i = 1; i <= this.pageCount; i++) {
                pages.push(i)
            }
            return pages
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
        },
        addMarkers() {
            this.villas.forEach(point => {
                const marker = L.circleMarker(point.location.latlng, {
                    radius: 8,
                    fillColor: "black",
                    fillOpacity: 1,
                    stroke: false
                });
                marker.bindPopup(point.name) // Add a popup with the name of the geopoint to each marker

                marker.on('click', () => {
                    this.map.setView([42.5, 12.5], 7.5);
                    marker.openPopup(); // Open the popup when the marker is clicked
                    marker.setStyle({
                        radius: 10,
                        fillColor: "red",
                        fillOpacity: 1,
                        stroke: false
                    });
                });

                marker.on('mouseover', () => {
                    this.map.setView([42.5, 12.5], 7.5);
                    marker.openPopup(); // Open the popup when the marker is clicked
                    marker.setStyle({
                        radius: 10,
                        fillColor: "red",
                        fillOpacity: 1,
                        stroke: false
                    });
                });

                marker.on('mouseleave', () => {
                    this.map.setView([42.5, 12.5], 7.5);
                    marker.openPopup(); // Open the popup when the marker is clicked
                    marker.setStyle({
                        radius: 10,
                        fillColor: "black",
                        fillOpacity: 1,
                        stroke: false
                    });
                });

                marker.on('mouse')

                marker.addTo(this.map)
                point.marker = marker // Store the marker associated with each geopoint
            })
        },
        boundingbox() {
            // Define the bounding box
            if (map) {
                const bounds = map.getBounds();
                console.log(bounds);
            }
            return bounds
        },
        currentVillas() {
            bounds = boundingbox()
            const filteredVillas = []
            this.villas.forEach(villa => {
                // Check if the point is within the bounding box
                if (bounds.contains(villa.location.latlng)) {
                    filteredVillas.push(villa)
                }
            })
            return filteredVillas
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
    }
}
</script>
  
  
<style> #app {
     display: flex;
     flex-direction: row;
 }


 #map {
     height: 100vh;
     width: 33vw;
     position: relative;
 }

 .geo-points {
     background-color: #fff;
     border: 1px solid #ddd;
     padding: 10px;
     border-radius: 5px;
     width: 66vw;
 }

 .geo-points h1 {
     font-size: 4em;
     margin-top: 0;
     margin-bottom: 10px;
 }

 .geo-points ul {
     list-style: none;
     padding-left: 0;
     margin: 0;
 }

 .geo-points li {
     padding: 10px;
     border-bottom: 1px solid #ddd;
     cursor: pointer;
     font-size: 2em;
 }

 .geo-points li:hover {
     background-color: #eee;
 }

 .geo-points li.active {
     background-color: #ddd;
 }

 .geo-points li div {
     display: inline-block;
     margin-right: 10px;
     padding: 5px;
     border-radius: 5px;
     background-color: #f1f1f1;
 }

 .geo-points li div.pool {
     background-color: #a6c5d6;
 }

 .geo-points li div.wifi {
     background-color: #d6a6a6;
 }

 .geo-points li div.air-conditioning {
     background-color: #a6d6b9;
 }

 .geo-points li div.parking {
     background-color: #d6cca6;
 }

 .geo-points p {
     margin: 10px 0 0;
 }
</style>
  