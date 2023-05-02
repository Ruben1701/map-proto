<template>
  <div>
    <h1>{{ villa.name }}</h1>
    <p>{{ villa.description }}</p>
    <p>{{ villa.price }}$</p>
    <div class="pool" v-if="villa.amenities.pool">Pool</div>
    <div class="wifi" v-if="villa.amenities.wifi">Wifi</div>
    <div class="air-conditioning" v-if="villa.amenities.airConditioning">Air conditioning</div>
    <div class="parking" v-if="villa.amenities.parking">Parking</div>
  </div>
</template>

<script>
export default {
  props: {
    villa: {
      type: Object,
      required: true
    }
  }
}
</script>
