"use strict";
let percorsiDiStudio = [];
let urlEndpoint = "http://localhost:8000/api/v1/";

/**
 * Ritorna tutti i percorsi di studio registrati sul server. Richiede l'admin
 * @returns Una LISTA di classe PERCORSODISTUDIO con i dettagli
 */
function getPercorsiDiStudio() {
  return new Promise((res, rej) => {
    percorsiDiStudio = [];
    const access_token = localStorage.getItem("access_token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    vallauriRequest(`${urlEndpoint}admin/percorsiDiStudi`, "GET", headers)
      .then((response) => {
        response.percorsiDiStudi.forEach((percorso) => {
          percorsiDiStudio.push(
            new PercorsoDiStudi(
              percorso.nome,
              percorso.id
            )
          );
        });
        res(percorsiDiStudio);
      })
      .catch((err) => {
        rej(semplificaErrore(500));
        console.error(err);
      });
  });
}

/**
 * Ritorna il percorso di studio con l'id specificato. Richiede l'admin
 * @param {int} id
 * @returns Nuova classe PERCORSODISTUDIO con i dettagli
 */
function getPercorsoDiStudioById(id) {
  return new Promise((res, rej) => {
    if (id) {
      const access_token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      vallauriRequest(`${urlEndpoint}admin/percorsiDiStudi/${id}`, "GET", headers)
        .then((response) => {
          res(
            new PercorsoDiStudi(
              response.nome,
              response.id
            )
          );
        })
        .catch((err) => {
          rej(semplificaErrore(500));
          console.error(err);
        });
    } else rej("Nessun id percorso di studio selezionato");
  });
}

/**
 * Aggiorna il percorso di studio con l'id specificato con i dati passati. Richiede l'admin
 * @param {int} id
 * @param {string} name
 * @returns Una classe PERCORSODISTUDIO con i dettagli
 */
function patchPercorsoDiStudio(id, name) {
  return new Promise((res, rej) => {
    if (id && name.trim()) {
      const access_token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };
      const body = {
        nome: name
      };

      vallauriRequest(`${urlEndpoint}admin/percorsiDiStudi/${id}`, "PUT", headers, body)
        .then((response) => {
          res(
            new PercorsoDiStudi(
              response.nome,
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
 * Aggiunge un nuovo Percorso di Studio con i dati passati. Richiede l'admin
 * @param {string} name
 * @returns Una classe PERCORSODISTUDIO con i dettagli
 */
function addPercorsoDiStudio(name) {
  return new Promise((res, rej) => {
    if (name.trim()) {
      const access_token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };
      const body = {
        nome: name
      };

      vallauriRequest(`${urlEndpoint}admin/percorsiDiStudi`, "POST", headers, body)
        .then((response) => {
          res(
            new PercorsoDiStudi(
              response.nome,
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
 * Rimuove il percorso di studio con l'id passato dal server
 * @param {int} id
 * @returns Un messaggio di avvenuta cancellazione del percorso di studio.
 */
function delPercorsoDiStudio(id) {
  return new Promise((res, rej) => {
    if (id) {
      const access_token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      vallauriRequest(`${urlEndpoint}admin/percorsiDiStudi/${id}`, "DELETE", headers)
        .then((response) => {
          res("Percorso di studio rimosso con successo!");
        })
        .catch((err) => {
          rej(semplificaErrore(500));
          console.error(err);
        });
    } else rej("Nessun id percorso di studio selezionato");
  });
}

/**
 * Semplifica il codice di errore passato trasformandolo in un messaggio leggibile dall'utente.
 * @param {int} errorCode
 * @returns Una stringa messaggio generalizzata dell'errore
 */
function semplificaErrore(errorCode) {
  if (errorCode == 401 || errorCode == 403)
    return "Azione non consentita per questo percorso di studio";
  else return "Errore interno nel server";
}
