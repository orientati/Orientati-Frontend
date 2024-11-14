"use strict";
let currentUser;

window.addEventListener("DOMContentLoaded", () => {
  checkTemporaneo();

  document.getElementById("formData").addEventListener("submit", (e) => {
    e.preventDefault();
    requestChangePassword(
      document.getElementById("password").value,
      document.getElementById("newPassword").value,
      document.getElementById("newPasswordCheck").value
    );
  });
});

function checkTemporaneo() {
  getMe()
    .then((user) => {
      if (user.temporaneo)
        MostraPaginaErrore(
          "L'utente è temporaneo. Non ci sono impostazioni.",
          401
        );
      else {
        currentUser = user;
        document.getElementById("username").value = currentUser.username;
        document.getElementById("role").innerText = currentUser.isAdmin
          ? "Admin"
          : "Accompagnatore";
      }
    })
    .catch((err, msg) => {
      MostraPaginaErrore(msg, err);
      console.error(msg + "CODE: "+err);
    });
}

function loadData() {
  document.getElementById("username").value = currentUser.username;
  document.getElementById("role").innerText = currentUser.isAdmin
    ? "Admin"
    : "Accompagnatore";
}

function requestChangePassword(currentPassword, newPassword, newPasswordCheck) {
  if (newPassword != newPasswordCheck) {
    mostraAlert("errore", "Le password non coincidono...");
  } else {
    changePassword(currentPassword, newPassword)
      .then((response) => {
        mostraAlert("successo", response, 3);
        document.getElementById("password").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("newPasswordCheck").value = "";
      })
      .catch((err) => {
        mostraAlert("errore", err);
      });
  }

  return false;
}
