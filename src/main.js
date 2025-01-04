import { createApp } from 'vue';
import App from './App.vue';
import './style.css'; 
import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/home.vue';
import Info from './views/info.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/info', component: Info },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).mount('#app');
