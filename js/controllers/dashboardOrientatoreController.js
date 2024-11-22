"use strict";

const access_token = localStorage.getItem("access_token");
const headers = {
    Authorization: `Bearer ${access_token}`,
};

function getGruppo() {
    return new Promise((res, rej) => {
        vallauriRequest(serverUrl + "orientatore/gruppo/", "GET", headers).then((result) => {
            res(result);
        }).catch((err) => {
            rej(err);
        });
    });
}

function putGruppo(gruppo) {
    return new Promise((res, rej) => {
        vallauriRequest(serverUrl + `orientatore/gruppo/imposta_tappa/${gruppo.id}?tappa=${gruppo.numero_tappa}&arrivato=${gruppo.arrivato}`, "PUT", headers).then((result) => {
            res(result);
        }).catch((err) => {
            rej(err);
        });
    });
}

function getTappe(id) {
    return new Promise((res, rej) => {
        vallauriRequest(serverUrl + "orientatore/gruppo/tappe/" + id, "GET", headers).then((result) => {
            res(result);
        }).catch((err) => {
            rej(err);
        });
    });
}
