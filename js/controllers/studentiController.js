"use strict";

class Studente {
  constructor(username, isAdmin, isTemporary, connectedToGroup, id) {
    this.username = username;
    this.isAdmin = isAdmin;
    this.isTemporary = isTemporary;
    this.connectedToGroup = connectedToGroup;
    this.id = id;
  }
}

let studenti = [];
const urlEndpoint = "http://127.0.0.1/api/v1/";

/**
 * Ritorna tutti gli studenti registrati sul server. Richiede l'admin
 * @returns Una LISTA di classe STUDENTE con i dettagli
 */
function getStudenti() {
  return new Promise((res, rej) => {
    studenti = [];
    const access_token = localStorage.getItem("access_token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    vallauriRequest(`${urlEndpoint}admin/users`, "GET", headers)
      .then((response) => {
        response.users.forEach((studente) => {
          studenti.push(
            new Studente(
              studente.username,
              studente.admin,
              studente.temporaneo,
              studente.connessoAGruppo === true,
              studente.id
            )
          );
          res(studenti);
        });
      })
      .catch((err) => {
        rej(semplificaErrore(500));
        console.error(err);
      });
  });
}

/**
 * Ritorna lo studente con l'id specificato. Richiede l'admin
 * @param {int} id
 * @returns Nuova classe STUDENTE con i dettagli
 */
function getStudenteById(id) {
  return new Promise((res, rej) => {
    if (id) {
      const access_token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      vallauriRequest(`${urlEndpoint}admin/users/${id}`, "GET", headers)
        .then((response) => {
          res(
            new Studente(
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
    } else rej("Nessun id studente selezionato");
  });
}

/**
 * Modifica i dati dello studente con l'id passato.
 * @param {int} id
 * @param {string} username
 * @param {string} password
 * @param {boolean} isAdmin
 * @param {boolean} isTemporary
 * @returns Una classe STUDENTE con i dati aggiornati.
 */
function patchStudente(id, username, password, isAdmin, isTemporary) {
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

      vallauriRequest(`${urlEndpoint}admin/users/${id}`, "PUT", headers, body)
        .then((response) => {
          res(
            new Studente(
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
 * Aggiunge lo studente con i dati passati al server
 * @param {string} username
 * @param {string} password
 * @param {boolean} isAdmin
 * @param {boolean} isTemporary
 * @param {boolean} connectedToGroup
 * @returns Un messaggio di avvenuta modifica dei dati sul server
 */
function addStudente(
  username,
  password,
  isAdmin,
  isTemporary,
  connectedToGroup
) {
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

      vallauriRequest(`${urlEndpoint}admin/users`, "POST", headers, body)
        .then((response) => {
          res(
            new Studente(
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
 * Rimuove lo studente con l'id passato dal server
 * @param {int} id
 * @returns Un messaggio di avvenuta cancellazione dello studente.
 */
function delStudente(id) {
  return new Promise((res, rej) => {
    if (id) {
      const access_token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      vallauriRequest(`${urlEndpoint}admin/users/${id}`, "DELETE", headers)
        .then((response) => {
          res("Studente rimosso con successo!");
        })
        .catch((err) => {
          rej(semplificaErrore(500));
          console.error(err);
        });
    } else rej("Nessun id studente selezionato");
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
