"use strict";
let indirizzi = [];

/**
 * Ritorna tutti gli indirizzi registrati sul server. Richiede l'admin
 * @returns Una LISTA di classe INDIRIZZO con i dettagli
 */
function getIndirizzi() {
    return new Promise((res, rej) => {
        indirizzi = [];
        const access_token = localStorage.getItem("access_token");
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };

        vallauriRequest(`${serverUrl}admin/indirizzi`, "GET", headers)
            .then((response) => {
                response.indirizzi.forEach((indirizzo) => {
                    indirizzi.push(
                        new Indirizzo(
                            indirizzo.nome,
                            indirizzo.percorsoDiStudi_id,
                            indirizzo.nomePercorsoDiStudi,
                            indirizzo.id
                        )
                    );
                });
                res(indirizzi);
            })
            .catch((err) => {
                rej(semplificaErrore(500));
                console.error(err);
            });
    });
}

/**
 * Ritorna tutti i percorsi di studio registrati sul server. Richiede l'admin
 * @returns Una LISTA di classe PERCORSODISTUDIO con i dettagli
 */
function getPercorsiDiStudio() {
    return new Promise((res, rej) => {
        let percorsiDiStudio = [];
        const access_token = localStorage.getItem("access_token");
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };

        vallauriRequest(`${serverUrl}admin/percorsiDiStudi`, "GET", headers)
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
 * Ritorna l'indirizzo con l'id specificato. Richiede l'admin
 * @param {int} id
 * @returns Nuova classe INDIRIZZO con i dettagli
 */
function getIndirizzoById(id) {
    return new Promise((res, rej) => {
        if (id) {
            const access_token = localStorage.getItem("access_token");
            const headers = {
                Authorization: `Bearer ${access_token}`,
            };

            vallauriRequest(`${serverUrl}admin/indirizzi/${id}`, "GET", headers)
                .then((response) => {
                    res(
                        new Indirizzo(
                            response.nome,
                            response.percorsoDiStudi_id,
                            response.nomePercorsoDiStudi,
                            response.id
                        )
                    );
                })
                .catch((err) => {
                    rej(semplificaErrore(500));
                    console.error(err);
                });
        } else rej("Nessun id indirizzo selezionato");
    });
}

/**
 * Aggiorna l'indirizzo con l'id specificato con i dati passati. Richiede l'admin
 * @param {int} id
 * @param {string} name
 * @param {int} percorsoDiStudioId
 * @returns Una classe INDIRIZZO con i dettagli
 */
function patchIndirizzo(id, nome, percorsoDiStudioId) {
    return new Promise((res, rej) => {
        if (
            id &&
            nome.trim() &&
            percorsoDiStudioId
        ) {
            const access_token = localStorage.getItem("access_token");
            const headers = {
                Authorization: `Bearer ${access_token}`,
            };
            const body = {
                nome: nome,
                percorsoDiStudi_id: percorsoDiStudioId,
            };
            vallauriRequest(
                `${serverUrl}admin/indirizzi/${id}`,
                "PUT",
                headers,
                body
            )
                .then((response) => {
                    res(
                        new Indirizzo(
                            response.nome,
                            response.percorsoDiStudi_id,
                            response.nomePercorsoDiStudi,
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
 * Aggiunge un nuovo Indirizzo con i dati passati. Richiede l'admin
 * @param {string} name
 * @param {int} percorsoDiStudioId
 * @param {string} percorsoDiStudioName
 * @returns Una classe INDIRIZZO con i dettagli
 */
function addIndirizzo(name, percorsoDiStudioId, percorsoDiStudioName) {
    return new Promise((res, rej) => {
        if (name.trim() && percorsoDiStudioId && percorsoDiStudioName.trim()) {
            const access_token = localStorage.getItem("access_token");
            const headers = {
                Authorization: `Bearer ${access_token}`,
            };
            const body = {
                name: name,
                percorsoDiStudi_id: percorsoDiStudioId,
            };

            vallauriRequest(`${serverUrl}admin/indirizzi`, "POST", headers, body)
                .then((response) => {
                    res(
                        new Indirizzo(
                            response.nome,
                            response.percorsoDiStudi_id,
                            response.nomePercorsoDiStudi,
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
 * Rimuove l'indirizzo con l'id passato dal server
 * @param {int} id
 * @returns Un messaggio di avvenuta cancellazione dell'indirizzo.
 */
function delIndirizzo(id) {
    return new Promise((res, rej) => {
        if (id) {
            const access_token = localStorage.getItem("access_token");
            const headers = {
                Authorization: `Bearer ${access_token}`,
            };

            vallauriRequest(`${serverUrl}admin/indirizzi/${id}`, "DELETE", headers)
                .then((response) => {
                    res("Indirizzo rimosso con successo!");
                })
                .catch((err) => {
                    rej(semplificaErrore(500));
                    console.error(err);
                });
        } else rej("Nessun id indirizzo selezionato");
    });
}

/**
 * Semplifica il codice di errore passato trasformandolo in un messaggio leggibile dall'utente.
 * @param {int} errorCode
 * @returns Una stringa messaggio generalizzata dell'errore
 */
function semplificaErrore(errorCode) {
    if (errorCode == 401 || errorCode == 403)
        return "Azione non consentita a questo indirizzo";
    else return "Errore interno nel server";
}
