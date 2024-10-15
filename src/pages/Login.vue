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
        const response = fetch("http://localhost:8000/api/v1/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });
        
        const { user, token } = await response.json();
        this.setUser(user);
        this.setToken(token);
      },
    },

  };
  </script>
  