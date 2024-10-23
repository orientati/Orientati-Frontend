"use strict";

/**
 * Effettua una richiesta all'url spcificato con la possibilità di passare i dati sotto forma di FormData
 * @param {string} url
 * @param {string = "GET" o "POST"} method
 * @param {json = {}} headers
 * @param {json = null} body
 * @returns Nuova PROMISE
 */
function vallauriRequest(url, method = "GET", headers = {}, body = null) {
  return new Promise((res, rej) => {
    try {
      console.log(headers);
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
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          res(response.json());
        })
        .catch((err) => {
          rej(err);
        });
    } catch (error) {
      rej(error);
    }
  });
}
