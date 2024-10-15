<template>
  <div id="app" class="app-container">
    <!-- Contenuto principale -->
    <div class="main-content">
      <router-view />
    </div>
    <!-- Navbar -->
    <Navbar />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  components: {
    Navbar
  }
};
</script>

<style>
/* Layout principale con flexbox */
.app-container {
  display: flex; /* Imposta flexbox per il layout */
  min-height: 100vh; /* Altezza minima per coprire tutta la finestra */
}

/* Contenuto principale */
.main-content {
  flex-grow: 1; /* Il contenuto principale si espande */
  padding: 20px; /* Padding per il contenuto */
  margin-left: 120px; /* Spazio a sinistra per la navbar su desktop */
}

/* Stili per mobile */
@media (max-width: 1023px) {
  .app-container {
    flex-direction: column; /* Disposizione verticale su mobile */
  }

  .main-content {
    margin-left: 0; /* Rimuovi margine a sinistra per mobile */
    margin-bottom: 60px; /* Spazio in basso per la navbar */
  }
}
</style>
