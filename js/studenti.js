"use strict";

window.addEventListener("DOMContentLoaded", function () {
  getStudenti()
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      mostraAlert("errore", err);
    });
});
