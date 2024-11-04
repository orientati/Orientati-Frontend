"use strict";
let orientatori = [];
const urlEndpoint = "http://localhost/api/v1/";

/**
 * Ritorna tutti gli orientatori registrati sul server. Richiede l'admin
 * @returns Una LISTA di classe ORIENTATORE con i dettagli
 */
function getOrientatori() {
  return new Promise((res, rej) => {
    orientatori = [];
    const access_token = localStorage.getItem("access_token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    vallauriRequest(`${urlEndpoint}admin/orientatori`, "GET", headers)
      .then((response) => {
        response.orientatori.forEach((orientatore) => {
          orientatori.push(
            new Orientatore(
              orientatore.nome,
              orientatore.cognome,
              orientatore.email,
              orientatore.classe,
              orientatore.indirizzo_id,
              orientatore.nomeIndirizzo,
              orientatore.gruppi,
              orientatore.id
            )
          );
        });
        res(orientatori);
      })
      .catch((err) => {
        rej(semplificaErrore(500));
        console.error(err);
      });
  });
}

/**
 * Ritorna l'orientatore con l'id specificato. Richiede l'admin
 * @param {int} id
 * @returns Nuova classe ORIENTATORE con i dettagli
 */
function getOrientatoreById(id) {
  return new Promise((res, rej) => {
    if (id) {
      const access_token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      vallauriRequest(`${urlEndpoint}admin/orientatori/${id}`, "GET", headers)
        .then((response) => {
          res(
            new Orientatore(
                orientatore.nome,
                orientatore.cognome,
                orientatore.email,
                orientatore.classe,
                orientatore.indirizzo_id,
                orientatore.nomeIndirizzo,
                orientatore.gruppi,
                orientatore.id
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
 * Aggiorna l'orientatore con l'id specificato con i dati passati. Richiede l'admin
 * @param {int} id
 * @param {string} name
 * @param {string} surname
 * @param {string} email
 * @param {string} schoolSection
 * @param {int} schoolAddressId
 * @param {string[]} groupsIn
 * @returns Una classe ORIENTATORE con i dettagli
 */
function patchOrientatore(id, name, surname, email, schoolSection, schoolAddressId, groupsIn) {
  return new Promise((res, rej) => {
    if (
      id &&
      name.trim() &&
      surname.trim() &&
      email.trim() &&
      schoolSection.trim() &&
      schoolAddressId &&
      Array.isArray(groupsIn)
    ) {
      const access_token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };
      const body = {
        nome: name,
        cognome: surname,
        email: email,
        classe: schoolSection,
        indirizzo_id: schoolAddressId,
      };

      vallauriRequest(`${urlEndpoint}admin/orientatori/${id}`, "PUT", headers, body)
        .then((response) => {
          res(
            new Orientatore(
                response.nome,
                response.cognome,
                response.email,
                response.classe,
                response.indirizzo_id,
                response.nomeIndirizzo,
                response.gruppi,
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
 * Aggiunge un nuovo Orientatore con i dati passati. Richiede l'admin
 * @param {string} name
 * @param {string} surname
 * @param {string} email
 * @param {string} schoolSection
 * @param {int} schoolAddressId
 * @param {string[]} groupsIn
 * @returns Una classe ORIENTATORE con i dettagli
 */
function addOrientatore(name, surname, email, schoolSection, schoolAddressId, groupsIn) {
  return new Promise((res, rej) => {
    if (
      name.trim() &&
      surname.trim() &&
      email.trim() &&
      schoolSection.trim() &&
      schoolAddressId &&
      Array.isArray(groupsIn)
    ) {
      const access_token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };
      const body = {
        nome: name,
        cognome: surname,
        email: email,
        classe: schoolSection,
        indirizzo_id: schoolAddressId,
      };

      vallauriRequest(`${urlEndpoint}admin/orientatori`, "POST", headers, body)
        .then((response) => {
          res(
            new Orientatore(
                response.nome,
                response.cognome,
                response.email,
                response.classe,
                response.indirizzo_id,
                response.nomeIndirizzo,
                response.gruppi,
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
 * Rimuove l'orientatore con l'id passato dal server
 * @param {int} id
 * @returns Un messaggio di avvenuta cancellazione dell' orientatore.
 */
function delOrientatore(id) {
  return new Promise((res, rej) => {
    if (id) {
      const access_token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      vallauriRequest(`${urlEndpoint}admin/orientatori/${id}`, "DELETE", headers)
        .then((response) => {
          res("Orientatore rimosso con successo!");
        })
        .catch((err) => {
          rej(semplificaErrore(500));
          console.error(err);
        });
    } else rej("Nessun id orientatore selezionato");
  });
}

/**
 * Semplifica il codice di errore passato trasformandolo in un messaggio leggibile dall'utente.
 * @param {int} errorCode
 * @returns Una stringa messaggio generalizzata dell'errore
 */
function semplificaErrore(errorCode) {
  if (errorCode == 401 || errorCode == 403)
    return "Azione non consentita a questo orientatore";
  else return "Errore interno nel server";
}
