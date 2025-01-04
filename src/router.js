import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/home.vue';
import Info from './views/info.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/info',
    name: 'Info',
    component: Info
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
