<template>
    <nav :class="['navbar']">
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <!-- Mostra il link Login solo se NON sei già sulla pagina di login -->
        <li v-if="!isLoginPage"><router-link to="/login">Login</router-link></li>
      </ul>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'Navbar',
    computed: {
      isLoginPage() {
        // Controlla se la rotta corrente è '/login'
        return this.$route.path === '/login';
      }
    }
  };
  </script>
  
  <style scoped>
  /* Stili di base per la navbar */
  .navbar {
    background-color: #333;
    color: white;
    padding: 20px;
  }
  
  /* Stili per la navbar su desktop */
  @media (min-width: 1024px) {
    .navbar {
      position: fixed; /* Fissa la navbar a sinistra */
      left: 0;
      top: 0;
      height: 100%; /* Altezza 100% per coprire tutta l'altezza della finestra */
      width: 100px; /* Larghezza fissa per la navbar */
      display: flex;
      flex-direction: column; /* Disposizione verticale degli elementi */
      justify-content: flex-start; /* Allineamento verticale */
    }
  
    .navbar ul {
      list-style: none; /* Rimuove i punti dall'elenco */
      padding: 0; /* Rimuove il padding */
      margin: 0; /* Rimuove il margine */
    }
  
    .navbar li {
      margin: 20px 0; /* Margine verticale tra i link */
    }
  
    .navbar a {
      color: white;
      text-decoration: none;
      padding: 10px; /* Padding per i link */
      display: block; /* Rende i link a tutta larghezza */
    }
  
    .navbar a:hover {
      background-color: #555; /* Colore di sfondo al passaggio del mouse */
    }
  }
  
  /* Navbar in basso su dispositivi mobili */
  @media (max-width: 1023px) {
    .navbar {
      position: fixed; /* Fissa la navbar in basso */
      left: 0;
      bottom: 0; /* Posizionamento in basso */
      width: 100%; /* Occupa tutta la larghezza */
      height: 60px; /* Altezza fissa per la navbar in basso */
      display: flex;
      justify-content: space-around; /* Spazio uniforme tra gli elementi */
      align-items: center; /* Allineamento verticale al centro */
    }
  
    .navbar ul {
      display: flex; /* Disposizione orizzontale per mobile */
      justify-content: space-around; /* Spazio uniforme tra gli elementi */
      padding: 0; /* Rimuove il padding */
      margin: 0; /* Rimuove il margine */
      list-style: none; /* Rimuove i punti dall'elenco */
      width: 100%; /* Occupa tutta la larghezza */
    }
  
    .navbar li {
      margin: 0; /* Rimuove il margine */
    }
  
    .navbar a {
      color: white;
      text-decoration: none;
      padding: 10px; /* Padding per i link */
      text-align: center; /* Allinea il testo al centro */
    }
  
    .navbar a:hover {
      background-color: #555; /* Colore di sfondo al passaggio del mouse */
    }
  }
  </style>
  