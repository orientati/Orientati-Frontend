"use strict";

window.addEventListener("DOMContentLoaded", function () {
  getUsers()
    .then((data) => {
      
    })
    .catch((err) => {
      mostraAlert("errore", err);
    });
});
