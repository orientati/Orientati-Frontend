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
const urlEndpoint = "http://109.123.240.145:8001/api/v1/";

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
        if (response.ok) {
          const data = response.json();
          data.users.forEach((studente) => {
            studenti.push(
              new Studente(
                studente.username,
                studente.admin,
                studente.temporaneo,
                studente.connessoAGruppo,
                studente.id
              )
            );
            res(studenti);
          });
        } else {
          rej(semplificaErrore(response.status));
        }
      })
      .catch((err) => {
        rej(semplificaErrore(500));
        console.error(err);
      });
  });
}

/**
 * Ritorna lo studente con l'id specificato. Richiede l'admin
 * @param {int/string} id
 * @returns Nuova classe STUDENTE con i dettagli
 */
function getStudenteById(id) {
  return new Promise((res, rej) => {
    if (id.trim()) {
      const access_token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      vallauriRequest(`${urlEndpoint}admin/users/${id}`, "GET", headers)
        .then((response) => {
          if (response.ok) {
            const data = response.json();
            res(
              new Studente(
                data.username,
                data.admin,
                data.temporaneo,
                data.connessoAGruppo,
                data.id
              )
            );
          } else {
            rej(semplificaErrore(response.status));
          }
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
 * @param {int/string} id
 * @param {string} username
 * @param {string} password
 * @param {boolean} isAdmin
 * @param {boolean} isTemporary
 * @returns Una classe STUDENTE con i dati aggiornati.
 */
function patchStudente(id, username, password, isAdmin, isTemporary) {
  return new Promise((res, rej) => {
    if (
      id.trim() &&
      username.trim() &&
      password.trim() &&
      isAdmin === Boolean &&
      isTemporary === Boolean
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
          if (response.ok) {
            const data = response.json();
            res(
              new Studente(
                data.username,
                data.admin,
                data.temporaneo,
                data.connessoAGruppo,
                data.id
              )
            );
          } else {
            rej(semplificaErrore(response.status));
          }
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
      isAdmin === Boolean &&
      isTemporary === Boolean &&
      connectedToGroup === Boolean
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
          if (response.ok) {
            const data = response.json();
            res(
              new Studente(
                data.username,
                data.admin,
                data.temporaneo,
                data.connessoAGruppo,
                data.id
              )
            );
          } else {
            rej(semplificaErrore(response.status));
          }
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
 * @param {int/string} id
 * @returns Un messaggio di avvenuta cancellazione dello studente.
 */
function delStudente(id) {
  return new Promise((res, rej) => {
    if (id.trim()) {
      const access_token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      vallauriRequest(`${urlEndpoint}admin/users/${id}`, "DELETE", headers)
        .then((response) => {
          if (response.ok) {
            res("Studente rimosso con successo!");
          } else {
            rej(semplificaErrore(response.status));
          }
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
