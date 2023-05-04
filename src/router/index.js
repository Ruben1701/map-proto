import { createWebHistory, createRouter } from 'vue-router'
import VillaDetails from '@/views/VillaDetails.vue'
import VillaList from '@/views/VillaList.vue'


const routes = [
  {
    path: "/",
    alias: ['/home', '/dashboard'],
    name: "Home",
    component: VillaList,
  },
  {
    path: '/villas/:id',
    name: 'villa-details',
    component: VillaDetails,

  }
];

let router = new createRouter({
  history: createWebHistory(),
  routes,
});

export default router;