"use strict";

window.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formLogin");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();
    login(
      document.getElementById("txtUsername").value.trim(),
      document.getElementById("txtPassword").value.trim()
    )
      .then((response) => {
        getMe().then((u) => {
          if (u.isAdmin) location.href = "pages/admin/dashboard.html";
          else location.href = "pages/orientatore/index.html";
        }).catch(err =>{
            mostraAlert("Errore nel recupero di informazioni dall'account... Riprova il login");
        });
      })
      .catch((err) => {
        console.error(err);
        mostraAlert("errore", err);
      });
  });
  const aUtenteTemporaneo = document.getElementById("ALoginUtenteTemporaneo");
  aUtenteTemporaneo.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    loginTemp()
      .then((response) => {
        location.href = "pages/orientatore/index.html";
      })
      .catch((err) => {
        console.error(err);
        mostraAlert("errore", err);
      });
  });
});
