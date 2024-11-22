"use strict";
let gruppi;
let orientati;
let indexGruppo;

function getGruppi() {
    return new Promise((res, rej) => {
        indexGruppo = 0;
        const access_token = localStorage.getItem("access_token");
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };

        vallauriRequest(`${serverUrl}admin/dashboard/gruppi`, "GET", headers)
            .then((response) => {
                gruppi = response.gruppi;
                for (let i = 0; i < gruppi.length; i++) {
                    if (gruppi[i].numero_tappa === 0 && gruppi[i].arrivato === false) {
                        gruppi[i].aula_nome = "Fermo";
                        gruppi[i].aula_posizione = "Fermo";
                        gruppi[i].aula_materia = "Fermo";
                    } else if (gruppi[i].numero_tappa === 0 && gruppi[i].arrivato === true) {
                        gruppi.remove(gruppi[i]);
                    }
                    res(gruppi);
                }
            })
            .catch((err) => {
                console.error(err);
                rej("Errore nella ricezione dei gruppi");
            })
    });
}

function findNextTappa(tappe, tappaId) {
    return new Promise((res, rej) => {
        let i = 0;
        while (i < tappe.length) {
            if (tappe[i].id == tappaId) break;
            i++;
        }

        if (i < tappe.length) {
            getAulaFromTappa(tappe[i].id).then((aulaDet) => {
                tappe[i].aula = aulaDet;
                res(tappe[i]);
            });
        } else res(null);
    });
}

function getAulaFromTappa(idGruppo, numTappa) {
    return new Promise((res, rej) => {
        const access_token = localStorage.getItem("access_token");
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };

        vallauriRequest(`${serverUrl}admin/dashboard/gruppi/tappe/${idGruppo}/${numTappa}`, "GET", headers)
            .then((tappa) => {
                vallauriRequest(
                    `${serverUrl}admin/aule/${tappa.aula_id}`,
                    "GET",
                    headers
                )
                    .then((aula) => {
                        res(aula);
                    })
                    .catch(() => {
                        res(null);
                    });
            })
            .catch(() => {
                res(null);
            });
    });
}

function getOrientati() {
    return new Promise((res, rej) => {
        const access_token = localStorage.getItem("access_token");
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };

        vallauriRequest(`${serverUrl}admin/dashboard/orientati`, "GET", headers)
            .then((response) => {
                orientati = response.orientati;
                res(orientati);
            })
            .catch((err) => {
                console.error(err);
                rej("Errore nella ricezione degli orientati");
            });
    });
}

function changePresenza(orientatoId, presenza) {
    return new Promise((res, rej) => {
        const access_token = localStorage.getItem("access_token");
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };

        vallauriRequest(
            `${serverUrl}admin/dashboard/orientati/${orientatoId}?presente=${presenza}`,
            "PUT",
            headers,
            {}
        )
            .then((response) => {
                res("Presenza cambiata con successo!");
            })
            .catch((err) => {
                console.error(err);
                rej("Errore nel cambiamento della presenza dell'orientato");
            });
    });
}
