"use strict";
let scuoleDiProvenienza = [];

/**
 * Ritorna tutte le scuole di provenienza registrate sul server. Richiede l'admin
 * @returns Una LISTA di classe SCUOLADIPROVENIENZA con i dettagli
 */
function getScuoleDiProvenienza() {
  return new Promise((res, rej) => {
    scuoleDiProvenienza = [];
    const access_token = localStorage.getItem("access_token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    vallauriRequest(`${serverUrl}admin/scuoleDiProvenienza`, "GET", headers)
      .then((response) => {
        response.scuoleDiProvenienza.forEach((scuola) => {
          scuoleDiProvenienza.push(
            new ScuolaDiProvenienza(
              scuola.nome,
              scuola.citta,
              scuola.id
            )
          );
        });
        res(scuoleDiProvenienza);
      })
      .catch((err) => {
        rej(semplificaErrore(500));
        console.error(err);
      });
  });
}

/**
 * Ritorna la scuola di provenienza con l'id specificato. Richiede l'admin
 * @param {int} id
 * @returns Nuova classe SCUOLADIPROVENIENZA con i dettagli
 */
function getScuolaDiProvenienzaById(id) {
  return new Promise((res, rej) => {
    if (id) {
      const access_token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      vallauriRequest(`${serverUrl}admin/scuoleDiProvenienza/${id}`, "GET", headers)
        .then((response) => {
          res(
            new ScuolaDiProvenienza(
              response.nome,
              response.citta,
              response.id
            )
          );
        })
        .catch((err) => {
          rej(semplificaErrore(500));
          console.error(err);
        });
    } else rej("Nessun id scuola di provenienza selezionato");
  });
}

/**
 * Aggiorna la scuola di provenienza con l'id specificato con i dati passati. Richiede l'admin
 * @param {int} id
 * @param {string} name
 * @param {string} city
 * @returns Una classe SCUOLADIPROVENIENZA con i dettagli
 */
function patchScuolaDiProvenienza(id, name, city) {
  return new Promise((res, rej) => {
    if (id && name.trim() && city.trim()) {
      const access_token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };
      const body = {
        nome: name,
        citta: city,
      };

      vallauriRequest(`${serverUrl}admin/scuoleDiProvenienza/${id}`, "PUT", headers, body)
        .then((response) => {
          res(
            new ScuolaDiProvenienza(
              response.nome,
              response.citta,
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
 * Aggiunge una nuova Scuola di Provenienza con i dati passati. Richiede l'admin
 * @param {string} name
 * @param {string} city
 * @returns Una classe SCUOLADIPROVENIENZA con i dettagli
 */
function addScuolaDiProvenienza(name, city) {
  return new Promise((res, rej) => {
    if (name.trim() && city.trim()) {
      const access_token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };
      const body = {
        nome: name,
        citta: city,
      };

      vallauriRequest(`${serverUrl}admin/scuoleDiProvenienza`, "POST", headers, body)
        .then((response) => {
          res(
            new ScuolaDiProvenienza(
              response.nome,
              response.citta,
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
 * Rimuove la scuola di provenienza con l'id passato dal server
 * @param {int} id
 * @returns Un messaggio di avvenuta cancellazione della scuola di provenienza.
 */
function delScuolaDiProvenienza(id) {
  return new Promise((res, rej) => {
    if (id) {
      const access_token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      vallauriRequest(`${serverUrl}admin/scuoleDiProvenienza/${id}`, "DELETE", headers)
        .then((response) => {
          res("Scuola di provenienza rimossa con successo!");
        })
        .catch((err) => {
          rej(semplificaErrore(500));
          console.error(err);
        });
    } else rej("Nessun id scuola di provenienza selezionato");
  });
}

/**
 * Semplifica il codice di errore passato trasformandolo in un messaggio leggibile dall'utente.
 * @param {int} errorCode
 * @returns Una stringa messaggio generalizzata dell'errore
 */
function semplificaErrore(errorCode) {
  if (errorCode == 401 || errorCode == 403)
    return "Azione non consentita per questa scuola di provenienza";
  else return "Errore interno nel server";
}
