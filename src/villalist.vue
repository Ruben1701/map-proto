<!-- TODO -->
<template>
    <div>
      <h2>Top Rated Villas</h2>
      <ul>
        <li v-for="villa in visibleVillas" :key="villa.id">
          {{ villa.name }} - {{ villa.rating }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue'
  
  export default {
    name: 'VillaList',
    props: {
      villas: {
        type: Array,
        required: true
      },
      visibleBounds: {
        type: Object,
        required: true
      }
    },
    setup(props) {
      const visibleVillas = computed(() => {
        return props.villas
          .filter(villa => {
            // check if villa is within visible bounds
            const lat = villa.lat
            const lng = villa.lng
            const ne = props.visibleBounds.getNorthEast()
            const sw = props.visibleBounds.getSouthWest()
            return lat >= sw.lat && lat <= ne.lat && lng >= sw.lng && lng <= ne.lng
          })
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 15)
      })
  
      return { visibleVillas }
    }
  }
  </script>
  