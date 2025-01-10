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

function putGruppo(gruppoId, numeroTappa, arrivato) {
    return new Promise((res, rej) => {
        vallauriRequest(serverUrl + `orientatore/gruppo/imposta_tappa/${gruppoId}?tappa=${numeroTappa}&arrivato=${arrivato}`, "PUT", headers).then((result) => {
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

function getTappa(idGruppo, numeroTappa) {
    return new Promise((res, rej) => {
        vallauriRequest(serverUrl + `orientatore/gruppo/tappa/${idGruppo}/${numeroTappa}`, "GET", headers).then((result) => {
            res(result);
        }).catch((err) => {
            rej(err);
        });
    });
}