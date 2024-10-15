<template>
    <div>
      <h1>Login Page</h1>
      <p>Pagina de login</p>
      <form>
        <label for="username">Username:</label>
        <input type="text" id="username" />
        <label for="password">Password:</label>
        <input type="password" id="password" />
        <button type="submit">Login</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoginPage'
  };
  </script>
  