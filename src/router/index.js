import { createRouter, createWebHistory } from 'vue-router'
// Import delle pagine del sito
import HomePage from '@/pages/Index.vue';
import LoginPage from '@/pages/Login.vue';

// Specifica dei route del sito (che pagina mostrare su url differenti)
const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/login', name: 'Login', component: LoginPage }
];

// Crea l'istanza del router di Vue 3
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
