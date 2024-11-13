"use strict";

let utenti = [];
const urlEndpoint = "http://localhost:8000/api/v1/";



function changePassword() {
  return new Promise((res, rej) => {
    const access_token = localStorage.getItem("access_token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    vallauriRequest(`${urlEndpoint}admin/utenti/me`, "GET", headers)
      .then((response) => {
        response.users.forEach((user) => {
          res(new User(
            user.username,
            user.admin,
            user.temporaneo,
            user.connessoAGruppo === true
          ));
        });
      })
      .catch((err) => {
        rej(semplificaErrore(500));
        console.error(err);
      });
  });
}

/**
 * Ritorna i dati dell'utente corrente
 * @returns classe USER con i dettagli dell'utente corrente
 */
function getMe() {
  return new Promise((res, rej) => {
    const access_token = localStorage.getItem("access_token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    vallauriRequest(`${urlEndpoint}admin/utenti/me`, "GET", headers)
      .then((response) => {
        response.users.forEach((user) => {
          res(new User(
            user.username,
            user.admin,
            user.temporaneo,
            user.connessoAGruppo === true
          ));
        });
      })
      .catch((err) => {
        rej(semplificaErrore(500));
        console.error(err);
      });
  });
}

/**
 * Ritorna tutti gli utenti registrati sul server. Richiede l'admin
 * @returns Una LISTA di classe USER con i dettagli
 */
function getUsers() {
  return new Promise((res, rej) => {
    utenti = [];
    const access_token = localStorage.getItem("access_token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    vallauriRequest(`${urlEndpoint}admin/utenti`, "GET", headers)
      .then((response) => {
        response.users.forEach((user) => {
          utenti.push(
            new User(
              user.username,
              user.admin,
              user.temporaneo,
              user.connessoAGruppo === true,
              user.id
            )
          );
          res(utenti);
        });
      })
      .catch((err) => {
        rej(semplificaErrore(500));
        console.error(err);
      });
  });
}

/**
 * Ritorna l'utente con l'id specificato. Richiede l'admin
 * @param {int} id
 * @returns Nuova classe USER con i dettagli
 */
function getUserById(id) {
  return new Promise((res, rej) => {
    if (id) {
      const access_token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      vallauriRequest(`${urlEndpoint}admin/utenti/${id}`, "GET", headers)
        .then((response) => {
          res(
            new User(
              response.username,
              response.admin,
              response.temporaneo,
              response.connessoAGruppo === true,
              response.id
            )
          );
        })
        .catch((err) => {
          rej(semplificaErrore(500));
          console.error(err);
        });
    } else rej("Nessun id utente selezionato");
  });
}

/**
 * Modifica i dati del'user con l'id passato.
 * @param {int} id
 * @param {string} username
 * @param {string} password
 * @param {boolean} isAdmin
 * @param {boolean} isTemporary
 * @returns Una classe USER con i dati aggiornati.
 */
function patchUser(id, username, password, isAdmin, isTemporary) {
  return new Promise((res, rej) => {
    if (
      id &&
      username.trim() &&
      password.trim() &&
      typeof isAdmin === Boolean &&
      typeof isTemporary === Boolean
    ) {
      const access_token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };
      const body = {
        username: username,
        password: password,
        admin: isAdmin,
        temporaneo: isTemporary,
      };

      vallauriRequest(`${urlEndpoint}admin/utenti/${id}`, "PUT", headers, body)
        .then((response) => {
          res(
            new User(
              response.username,
              response.admin,
              response.temporaneo,
              response.connessoAGruppo === true,
              response.id
            )
          );
        })
        .catch((err) => {
          rej(semplificaErrore(500));
          console.error(err);
        });
    } else rej("Dati aggiornati immessi non validi");
  });
}

/**
 * Aggiunge l'utente con i dati passati al server
 * @param {string} username
 * @param {string} password
 * @param {boolean} isAdmin
 * @param {boolean} isTemporary
 * @param {boolean} connectedToGroup
 * @returns Un messaggio di avvenuta modifica dei dati sul server
 */
function addUser(username, password, isAdmin, isTemporary, connectedToGroup) {
  return new Promise((res, rej) => {
    if (
      username.trim() &&
      password.trim() &&
      typeof isAdmin === "boolean" &&
      typeof isTemporary === "boolean" &&
      typeof connectedToGroup === "boolean"
    ) {
      const access_token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };
      const body = {
        username: username,
        password: password,
        admin: isAdmin,
        temporaneo: isTemporary,
        connessoAGruppo: connectedToGroup,
      };

      vallauriRequest(`${urlEndpoint}admin/utenti`, "POST", headers, body)
        .then((response) => {
          res(
            new User(
              response.username,
              response.admin,
              response.temporaneo,
              response.connessoAGruppo === true,
              response.id
            )
          );
        })
        .catch((err) => {
          rej(semplificaErrore(500));
          console.error(err);
        });
    } else rej("Dati immessi non validi");
  });
}

/**
 * Rimuove l'user con l'id passato dal server
 * @param {int} id
 * @returns Un messaggio di avvenuta cancellazione del'user.
 */
function delUser(id) {
  return new Promise((res, rej) => {
    if (id) {
      const access_token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      vallauriRequest(`${urlEndpoint}admin/utenti/${id}`, "DELETE", headers)
        .then((response) => {
          res("Utente rimosso con successo!");
        })
        .catch((err) => {
          rej(semplificaErrore(500));
          console.error(err);
        });
    } else rej("Nessun id utente selezionato");
  });
}

/**
 * Semplifica il codice di errore passato trasformandolo in un messaggio leggibile dall'utente.
 * @param {int} errorCode
 * @returns Una stringa messaggio generalizzata dell'errore
 */
function semplificaErrore(errorCode) {
  if (errorCode == 401 || errorCode == 403)
    return "Azione non consentita a questo utente";
  else return "Errore interno nel server";
}
