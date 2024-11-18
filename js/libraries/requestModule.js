"use strict";

/**
 * Effettua una richiesta all'url spcificato con la possibilità di passare i dati sotto forma di FormData
 * @param {string} url
 * @param {string = "GET" o "POST"} method
 * @param {json = {}} headers
 * @param {json = null} body
 * @param {bool = false} negation - se true, in caso di errore 401, esegue il relogin
 * @returns Nuova PROMISE
 */
function vallauriRequest(url, method = "GET", headers = {}, body = null, neg = false) {
    return new Promise((res, rej) => {
        try {
            const options = {
                method: method,
                headers: headers,
                body: null,
            };

            if (method !== "GET" && body) {
                options.body = body instanceof FormData ? body : JSON.stringify(body);

                if (!(body instanceof FormData)) {
                    options.headers["Content-Type"] = "application/json";
                }
            }

            fetch(url, options)
                .then((response) => {
                    if (!response.ok) {
                        if(response.status === 401 && !neg){
                            autoReLogin();
                        }
                        rej(response.status);
                    }

                    res(response.json());
                })
                .catch((err) => {
                    console.error(err);
                    rej(500);
                });
        } catch (error) {
            rej(error);
        }
    });
}
