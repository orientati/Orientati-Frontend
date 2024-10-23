"use strict";
const port = 8001;
const path = findHostName();
let url = findUrl();
const htmlpage = window.location.href.split("/")[window.location.href.split("/").length - 1];

/**
 * trova l'hostname, utile per mantenere la funzionalità durante il developing in locale.
 * @returns hostname
 */
function findHostName() {
  if (location.origin == "file://") {
    return (
      location.href.substring(
        0,
        location.href.lastIndexOf("/Vallauri-Orientati-Frontend")
      ) + "/Vallauri-Orientati-Frontend"
    );
  } else {
    return host + "/Vallauri-Orientati-Frontend";
  }
}

function findUrl() {
  if (location.origin == "file://") {
    return "http://109.123.240.145:" + port;
  } else {
    return location.hostname + ":" + port;
  }
}

window.addEventListener("load", () => {
  if (
    location.pathname.substring(location.pathname.lastIndexOf("/") + 1) !=
    "login.html"
  ) {
    autoReLogin();
  }
});

/**
 * Esegue una richiesta di login come admin all'endpoint /api/v1/login.
 * @param {string} username
 * @param {string} password
 * @returns Nuova PROMISE cona la risposta del server
 */
function login(username, password) {
  return new Promise((res, rej) => {
    const endpointUrl = url + "/api/v1/login";
    const method = "POST";

    const body = new FormData();
    body.append("username", username);
    body.append("password", password);

    vallauriRequest(endpointUrl, method, {}, body)
      .then((response) => {
        res(response);
        if (
          !sessionStorage.getItem("path") &&
          sessionStorage
            .getItem("path")
            .substring(sessionStorage.getItem("path").lastIndexOf("/") + 1) !=
            "login.html"
        ) {
          location.href = sessionStorage.getItem("path");
        } else {
          location.href = path + "/index.html";
        }
      })
      .catch((error) => {
        rej(error);
      });
  });
}

/**
 * Esegue un controllo per verificare se l'access token è valido
 * @param {string} [access_token=localStorage.getItem("access_token")] access_token
 * @param {string} [urlEndPoint=url + "/api/v1/users/me"] url
 * @returns true: access token valido, false: accesso token non valido
 */
function testAccessToken(
  access_token = localStorage.getItem("access_token"),
  endpointUrl = url + "/api/v1/users/me"
) {
  let bool;
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };
  vallauriRequest(endpointUrl, "GET", headers)
    .then((response) => {
      bool = true;
    })
    .catch((error) => {
      bool = false;
    });
  return bool;
}

/**
 * gestione dei token: effettua una prova per determinare se l'access token è valido, in caso contrario ne richiede un altro con il session token, in caso anche l'ultimo non sia valido richiede il login per ottenere nuovi token
 */
function autoReLogin() {
  const access_token = localStorage.getItem("access_token");
  const refresh_token = localStorage.getItem("refresh_token");

  const endpointUrl = url + "/api/v1/users/me";

  const headers = {
    Authorization: `Bearer ${access_token}`,
  };
  vallauriRequest(endpointUrl, "GET", headers)
    .then((response) => {})
    .catch((error) => {
      if (error.response) {
        console.log("Errore con status code:", error.response.status);
      } else if (error.message && error.message.includes("status:")) {
        const statusCode = error.message.match(/status:\s*(\d+)/)?.[1];
        if (statusCode == 401) {
          console.log("access token non valido invio richiesta refresh token");

          const body = { refresh_token: refresh_token };
          vallauriRequest(url + "/api/v1/token/refresh", "POST", {}, body)
            .then((response) => {
              localStorage.setItem("access_token", response.access_token);
              location.reload();
            })
            .catch((error) => {
              if (error.message && error.message.includes("status:")) {
                sessionStorage.setItem(
                  "loginMessage",
                  "Login scaduto, reinserisci le tue credenziali"
                );
                sessionStorage.setItem("path", location.pathname);
                location.href = path + "/html/login.html";
              } else {
                console.error("errore sconosciuto");
                // Reinderizza solo se non in index.html o login.html. In caso contrario, mostra un alert
                if(htmlpage === "" || htmlpage === "index.html" || htmlpage === "login.html"){
                  // Mostra alert
                }
                else{
                  MostraPaginaErrore("errore nel server, ritenta a breve", 500);
                }              
              }
              console.warn(error);
            });
        } else {
          console.log("Errore con status code:", statusCode);
        }
      } else {
        const htmlpage =
        window.location.href.split("/")[window.location.href.split("/").length - 1];

        // Reinderizza solo se non in index.html o login.html. In caso contrario, mostra un alert
        if(htmlpage === "" || htmlpage === "index.html" || htmlpage === "login.html"){
          // Mostra alert
        }
        else{
          MostraPaginaErrore("errore nel server, ritenta a breve", 500);
        }
      }
    });
}
