"use strict";

let orientati = [];
const urlEndpoint = "http://localhost/api/v1/";

/**
 * Ritorna tutti gli orientati registrati sul server. Richiede l'admin
 * @returns Una LISTA di classe ORIENTATO con i dettagli
 */
function getOrientati() {
  return new Promise((res, rej) => {
    orientati = [];
    const access_token = localStorage.getItem("access_token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    vallauriRequest(`${urlEndpoint}admin/orientati`, "GET", headers)
      .then((response) => {
        response.orientati.forEach((orientato) => {
          orientati.push(
            new Orientato(
              orientato.nome,
              orientato.cognome,
              orientato.scuoladiprovenienza_id,
              orientato.nomeScuolaDiProvenienza,
              orientato.id
            )
          );
          res(orientati);
        });
      })
      .catch((err) => {
        rej(semplificaErrore(500));
        console.error(err);
      });
  });
}

/**
 * Ritorna l'orientato con l'id specificato. Richiede l'admin'
 * @param {int} id
 * @returns Nuova classe ORIENTATO con i dettagli
 */
function getOrientatoById(id) {
  return new Promise((res, rej) => {
    if (id) {
      const access_token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      vallauriRequest(`${urlEndpoint}admin/orientati/${id}`, "GET", headers)
        .then((response) => {
          res(
            new Orientato(
              response.nome,
              response.cognome,
              response.scuoladiprovenienza_id,
              response.nomeScuolaDiProvenienza,
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
 * Aggiorna l'orientato con l'id specificato con i dati passati. Richiede l'admin
 * @param {int} id 
 * @param {string} nome 
 * @param {string} cognome 
 * @param {int} scuolaProvenienzaId 
 * @returns Una classe ORIENTATO con i dettagli
 */
function patchOrientato(id, nome, cognome, scuolaProvenienzaId) {
  return new Promise((res, rej) => {
    if (
      id &&
      nome.trim() &&
      cognome.trim() &&
      scuolaProvenienzaId
    ) {
      const access_token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };
      const body = {
        nome: nome,
        cognome: cognome,
        scuoladiprovenienza_id: scuolaProvenienzaId,
      };

      vallauriRequest(`${urlEndpoint}admin/orientati/${id}`, "PUT", headers, body)
        .then((response) => {
          res(
            new Orientato(
              response.nome,
              response.cognome,
              response.scuoladiprovenienza_id,
              response.nomeScuolaDiProvenienza,
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
 * Aggiunge un nuovo Orientato con i dati passati. Richiede l'admin
 * @param {int} id 
 * @param {string} nome 
 * @param {string} cognome 
 * @param {int} scuolaProvenienzaId 
 * @returns Una classe ORIENTATO con i dettagli
 */
function addOrientato(
  nome,
  cognome,
  scuolaProvenienzaId
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
        nome: nome,
        cognome: cognome,
        scuoladiprovenienza_id: scuolaProvenienzaId,
      };

      vallauriRequest(`${urlEndpoint}admin/orientati`, "POST", headers, body)
        .then((response) => {
          res(
            new Orientato(
              response.nome,
              response.cognome,
              response.scuoladiprovenienza_id,
              response.nomeScuolaDiProvenienza,
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
 * Rimuove l'orientato con l'id passato dal server
 * @param {int} id
 * @returns Un messaggio di avvenuta cancellazione dell' orientato.
 */
function delOrientato(id) {
  return new Promise((res, rej) => {
    if (id) {
      const access_token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      vallauriRequest(`${urlEndpoint}admin/orientati/${id}`, "DELETE", headers)
        .then((response) => {
          res("Orientato rimosso con successo!");
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
    return "Azione non consentita a questo orientato";
  else return "Errore interno nel server";
}