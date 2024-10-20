"use strict";

window.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();
    adminLogin();
  });
});

async function vallauriRequest(url, method = "GET", headers = {}, body = null) {
  try {
    const options = {
      method: method,
      headers: headers,
      body: null,
    };

    if (method !== "GET" && body) {
      options.body = body;
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

function adminLogin() {
  const username = document.getElementById("txtUsername").value;
  const password = document.getElementById("txtPassword").value;

  const url = "http://127.0.0.1:8000/api/v1/login";
  const method = "POST";

  const body = new FormData();
  body.append("username", username);
  body.append("password", password);

  vallauriRequest(url, method, {}, body)
    .then((response) => {
      handleResponseRedirect(response);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function handleResponseRedirect(response) {
  const { access_token, refresh_token } = response;

  if (access_token && refresh_token) {
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    location.href = "./dashboard.html";
  } else {
    console.error("Errore nell'acquisizione dei token");
  }
}
