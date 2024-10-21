"use strict";
const url = "http://109.123.240.145:8001";

/**
 * Esegue una richiesta di login come admin all'endpoint /api/v1/login.
 * @param {string} username 
 * @param {string} password 
 * @returns Nuova PROMISE cona la risposta del server
 */
function adminLogin(username, password) {
    return new Promise((res, rej) =>{
        const endpointUrl = url + "/api/v1/login";
        const method = "POST";
    
        const body = new FormData();
        body.append("username", username);
        body.append("password", password);
    
        vallauriRequest(endpointUrl, method, {}, body)
        .then((response) => {
            res(response);
        })
        .catch((error) => {
            rej(error);
        });
    })
}