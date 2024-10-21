"use strict";

window.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();
    adminLogin(document.getElementById('txtUsername').value.trim(), document.getElementById('txtPassword').value.trim())
    .then(response => {
      handleResponseRedirect(response);
    })
    .catch(err =>{
      console.err(err);
    })
  });
});


function handleResponseRedirect(response) {
  const { access_token, refresh_token } = response;

  if (access_token && refresh_token) {
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    //location.href = "./dashboard.html";
  } else {
    console.error("Errore nell'acquisizione dei token");
  }
}
