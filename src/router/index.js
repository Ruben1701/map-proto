import { createWebHistory, createRouter } from 'vue-router'
import VillaDetails from '@/components/VillaDetails.vue'
import VillaList from '@/components/VillaList.vue'


const routes = [
  {
    path: "/",
    alias: ['/home', '/dashboard'],
    name: "Home",
    component: VillaList,
  },
  {
    path: '/villa/:id',
    name: 'villa-details',
    component: VillaDetails,
    props: true
  }  
];

let router = new createRouter({
  history: createWebHistory(),
  routes,
});

export default router;