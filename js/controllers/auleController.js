"use strict";

let aule = [];

/**
 * Ritorna tutte le aule registrate sul server. Richiede l'admin
 * @returns Una LISTA di classe AULA con i dettagli
 */
function getAule() {
  return new Promise((res, rej) => {
    aule = [];
    const access_token = localStorage.getItem("access_token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    vallauriRequest(`${serverUrl}admin/aule`, "GET", headers)
      .then((response) => {
        response.aule.forEach((aula) => {
          aule.push(
            new Aula(
              aula.nome,
              aula.posizione,
              aula.materia,
              aula.dettagli,
              aula.id
            )
          );
        });
        res(aule);
      })
      .catch((err) => {
        rej(semplificaErrore(500));
        console.error(err);
      });
  });
}

/**
 * Ritorna l'aula con l'id specificato. Richiede l'admin
 * @param {int} id
 * @returns Nuova classe AULA con i dettagli
 */
function getAulaById(id) {
  return new Promise((res, rej) => {
    if (id) {
      const access_token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      vallauriRequest(`${serverUrl}admin/aule/${id}`, "GET", headers)
        .then((response) => {
          res(
            new Aula(
              response.nome,
              response.posizione,
              response.materia,
              response.dettagli,
              response.id
            )
          );
        })
        .catch((err) => {
          rej(semplificaErrore(500));
          console.error(err);
        });
    } else rej("Nessun id aula selezionato");
  });
}

/**
 * Modifica i dati dell'aula con l'id passato.
 * @param {int} id
 * @param {string} name
 * @param {string} position
 * @param {string} subject
 * @param {string} details
 * @returns Una classe AULA con i dati aggiornati.
 */
function patchAula(id, name, position, subject, details) {
  return new Promise((res, rej) => {
    if (
      id &&
      name.trim() &&
      position.trim() &&
      subject.trim() &&
      details.trim()
    ) {
      const access_token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };
      const body = {
        nome: name,
        posizione: position,
        materia: subject,
        dettagli: details,
      };

      vallauriRequest(`${serverUrl}admin/aule/${id}`, "PUT", headers, body)
        .then((response) => {
          res(
            new Aula(
              response.nome,
              response.posizione,
              response.materia,
              response.dettagli,
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
 * Aggiunge una nuova Aula con i dati passati al server
 * @param {string} name
 * @param {string} position
 * @param {string} subject
 * @param {string} details
 * @returns Una classe AULA con i dettagli
 */
function addAula(name, position, subject, details) {
  return new Promise((res, rej) => {
    if (
      name.trim() &&
      position.trim() &&
      subject.trim() &&
      details.trim()
    ) {
      const access_token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };
      const body = {
        nome: name,
        posizione: position,
        materia: subject,
        dettagli: details,
      };

      vallauriRequest(`${serverUrl}admin/aule`, "POST", headers, body)
        .then((response) => {
          res(
            new Aula(
              response.nome,
              response.posizione,
              response.materia,
              response.dettagli,
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
 * Rimuove l'aula con l'id passato dal server
 * @param {int} id
 * @returns Un messaggio di avvenuta cancellazione dell'aula.
 */
function delAula(id) {
  return new Promise((res, rej) => {
    if (id) {
      const access_token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      vallauriRequest(`${serverUrl}admin/aule/${id}`, "DELETE", headers)
        .then((response) => {
          res("Aula rimossa con successo!");
        })
        .catch((err) => {
          rej(semplificaErrore(500));
          console.error(err);
        });
    } else rej("Nessun id aula selezionato");
  });
}

/**
 * Semplifica il codice di errore passato trasformandolo in un messaggio leggibile dall'utente.
 * @param {int} errorCode
 * @returns Una stringa messaggio generalizzata dell'errore
 */
function semplificaErrore(errorCode) {
  if (errorCode == 401 || errorCode == 403)
    return "Azione non consentita per questa aula";
  else return "Errore interno nel server";
}
