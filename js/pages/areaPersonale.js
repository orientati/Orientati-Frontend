"use strict";
let currentUser;

window.addEventListener("DOMContentLoaded", () => {
  checkTemporaneo();

  document.getElementById("formData").addEventListener("submit", (e) => {
    e.preventDefault();
    changePassword(document.getElementById("newPassword").value);
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
        document.getElementById("passwordLabel").value = "banano";
      }
    })
    .catch((err) => {
      //MostraPaginaErrore(err, 500);
    });
}

function loadData() {
  document.getElementById("username").value = currentUser.username;
  document.getElementById("role").innerText = currentUser.isAdmin
    ? "Admin"
    : "Accompagnatore";
  document.getElementById("password").value = "banano";
}

function changePassword(newPassword) {}
