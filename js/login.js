"use strict";

window.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();
    login(
      document.getElementById("txtUsername").value.trim(),
      document.getElementById("txtPassword").value.trim()
    )
      .then((response) => {
        location.href = "./dashboard.html";
      })
      .catch((err) => {
        console.error(err);
        mostraAlert("errore", err);
      });
  });
});
