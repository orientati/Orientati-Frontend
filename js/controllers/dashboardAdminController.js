"use strict";
let gruppi;
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
                        gruppi[i] = undefined;
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
