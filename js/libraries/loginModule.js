"use strict";
const port = 8000;
let url = findUrl();
const htmlpage =
  window.location.href.split("/")[window.location.href.split("/").length - 1];

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
    return location.hostname + "/Vallauri-Orientati-Frontend";
  }
}

function findUrl() {
  if (location.origin == "file://") {
    return "http://localhost:" + port;
  } else {
    return location.origin.split(":").slice(0, 2).join(":") + ":" + port;
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
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);
        res(response);
        location.href = "index.html";
      })
      .catch((error) => {
        rej(semplificaErrore(error));
      });
  });
}

/**
 * Esegue una richiesta di login come utente temporaneo all'endpoint /api/v1/login/temp.
 * @returns Nuova PROMISE cona la risposta del server
 */
function loginTemp() {
  return new Promise((res, rej) => {
    const endpointUrl = url + "/api/v1/utenti/temp";
    const method = "POST";

    const body = new FormData();

    vallauriRequest(endpointUrl, method, {}, body)
      .then((response) => {
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);
        res(response);
        location.href = "index.html";
      })
      .catch((error) => {
        rej(semplificaErrore(error));
      });
  });
}

/**
 * Esegue un controllo per verificare se l'access token è valido
 * @param {string} [access_token=localStorage.getItem("access_token")] access_token
 * @param {string} [urlEndPoint=url + "/api/v1/user   s/me"] url
 * @returns true: access token valido, false: accesso token non valido
 */
function testAccessToken(
  access_token = localStorage.getItem("access_token"),
  endpointUrl = url + "/api/v1/utenti/me"
) {
  let bool;
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };
  vallauriRequest(endpointUrl, "GET", headers)
    .then((response) => {
      bool = true;
      s;
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

  const endpointUrl = url + "/api/v1/utenti/me";

  if (access_token && refresh_token) {
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
            console.log(
              "access token non valido invio richiesta refresh token"
            );

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
                  if (
                    !(
                      htmlpage === "" ||
                      htmlpage === "index.html" ||
                      htmlpage === "login.html"
                    )
                  )
                    location.href = "pages/login.html";
                } else {
                  console.error("errore sconosciuto");
                  // Reinderizza solo se non in index.html o login.html.
                  if (
                    !(
                      htmlpage === "" ||
                      htmlpage === "index.html" ||
                      htmlpage === "login.html"
                    )
                  ) {
                    MostraPaginaErrore(
                      "Errore con la sessione in corso, rifare il login",
                      500
                    );
                  }
                }
                console.warn(error);
              });
          } else {
            console.log("Errore con status code:", statusCode);
          }
        } else {
          // Reinderizza solo se non in index.html o login.html. In caso contrario, mostra un alert
          if (
            !(
              htmlpage === "" ||
              htmlpage === "index.html" ||
              htmlpage === "login.html"
            )
          ) {
            // Reindirizza al login
            window.location.href = "pages/login.html";
          }
        }
      });
  } else {
    // Reindirizza al login se non trovo un token di accesso
    if (
      !(
        htmlpage === "" ||
        htmlpage === "index.html" ||
        htmlpage === "login.html"
      )
    )
      location.href = "pages/login.html";
  }
}

/**
 * Semplifica il codice di errore passato trasformandolo in un messaggio leggibile dall'utente.
 * @param {int} errorCode
 * @returns Una stringa messaggio generalizzata dell'errore
 */
function semplificaErrore(errorCode) {
  if (errorCode == 401) return "Nessun utente trovato con queste credenziali";
  else return "Errore interno nel server";
}

async function getAdminStatus() {
  const access_token = localStorage.getItem("access_token");
  const endpointUrl = url + "/api/v1/utenti/me";

  if (!access_token) {
    throw new Error("Access token non trovato");
  }

  const headers = {
    Authorization: `Bearer ${access_token}`,
  };

  try {
    const response = await vallauriRequest(endpointUrl, "GET", headers);
    if (response && response.admin !== undefined) {
      return response.admin;
    } else {
      throw new Error("Campo admin non trovato nella risposta");
    }
  } catch (error) {
    throw new Error(semplificaErrore(error));
  }
}

function checkAdmin() {
  getAdminStatus()
    .then((response) => {
      if (!response) {
        MostraPaginaErrore(null, "Non sei autorizzato ad accedere a questa pagina");
      }
    })
    .catch((error) => {
      console.error(error);
      mostraAlert("errore", error);
    });
}

/**
 * Removes the tokens from the localstorage and redirects to the index
 */
function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  location.href = "index.html";
}
