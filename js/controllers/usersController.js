"use strict";

let utenti = [];
const urlEndpoint = "http://localhost:8000/api/v1/";

/**
 * Collega l'utente con l'orientatore specificato dal codice
 * @param {string} codiceOrientatore Codice dato dall'amministratore per il collegamento
 * @returns Errore del server o risposta OK
 */
function linkOrientatore(codiceOrientatore) {
  return new Promise((res, rej) => {
    const access_token = localStorage.getItem("access_token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    const body = {
      orientatore_codice: codiceOrientatore,
    };

    vallauriRequest(`${urlEndpoint}utenti/orientatore`, "POST", headers, body)
      .then((response) => {
        res("Utente collegato come Orientatore!");
      })
      .catch((err) => {
        if (err == 422)
          rej("Codice non valido, inserire il codice corretto...", 422);
        else rej(semplificaErrore(err), err);
        console.error(err);
      });
  });
}

/**
 * Modifica la password dell'utente corrente
 * @param {string} currentPassword La password corrente dell'utente
 * @param {string} newPassword La password nuova dell'utente
 * @returns Response con successo o errore da mostrare
 */
function changePassword(currentPassword, newPassword) {
  return new Promise((res, rej) => {
    const access_token = localStorage.getItem("access_token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    const body = {
      old_password: currentPassword,
      new_password: newPassword,
    };

    vallauriRequest(
      `${urlEndpoint}utenti/me/change_password`,
      "POST",
      headers,
      body
    )
      .then((response) => {
        res("Password cambiata con successo!");
      })
      .catch((err) => {
        rej(semplificaErrore(err));
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

    vallauriRequest(`${urlEndpoint}utenti/me`, "GET", headers)
      .then((user) => {
        res(
          new User(
            user.username,
            user.admin,
            user.temporaneo,
            user.orientatore_id
          )
        );
      })
      .catch((err) => {
        rej(semplificaErrore(err), err);
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
              user.orientatore_id,
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
              response.orientatore_id,
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
 * @param {*} idOrientatore Null se inesistente
 * @returns Una classe USER con i dati aggiornati.
 */
function patchUser(
  id,
  username,
  password,
  isAdmin,
  isTemporary,
  idOrientatore
) {
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
        orientatore_id: idOrientatore,
      };

      vallauriRequest(`${urlEndpoint}admin/utenti/${id}`, "PUT", headers, body)
        .then((response) => {
          res(
            new User(
              response.username,
              response.admin,
              response.temporaneo,
              response.orientatore_id,
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
 * @param {*} idOrientatore Null se inesistente
 * @returns Un messaggio di avvenuta modifica dei dati sul server
 */
function addUser(username, password, isAdmin, isTemporary, idOrientatore) {
  return new Promise((res, rej) => {
    if (
      username.trim() &&
      password.trim() &&
      typeof isAdmin === "boolean" &&
      typeof isTemporary === "boolean"
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
        orientatore_id: idOrientatore,
      };

      vallauriRequest(`${urlEndpoint}admin/utenti`, "POST", headers, body)
        .then((response) => {
          res(
            new User(
              response.username,
              response.admin,
              response.temporaneo,
              response.orientatore_id,
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
  else if (errorCode == 422) return "La password corrente è errata";
  else if (errorCode == 400) return "La password corrente è errata";
  else return "Errore interno nel server";
}
