<template>
    <div>
      <h1>Login Page</h1>
      <p>Pagina de login</p>
      <form @submit.prevent="login">  
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username"/>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password"/>
        <button type="submit">Login</button>
      </form>
    </div>
  </template>
  
  <script>
  import { mapMutations } from 'vuex';

  export default {
    name: 'LoginPage',
    
    data: () => {
      return {
        username: "",
        password: "",
      };
    },

    methods: {
      ...mapMutations(["setUser", "setToken"]),
      async login() {
        const url = 'http://127.0.0.1:8000/api/v1/login';
        const data = new FormData();
        data.append('username', username.value);
        data.append('password', password.value);

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: data
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Login successful:', result);
            // DA FARE SALVATAGGIO NELLO STORE
            //this.setAuth(result.access_token);
            //this.setRefresh(result.refresh_token);
        } catch (error) {
            console.error('There was a problem with the login request:', error);
        }
      }
    }
  };
  </script>
  