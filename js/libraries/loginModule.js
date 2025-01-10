"use strict";

/**
 * trova l'hostname, utile per mantenere la funzionalità durante il developing in locale.
 * @returns hostname
 */
function findHostName() {
    if (location.origin == "file://") {
        return (
            location.href.substring(
                0,
                location.href.lastIndexOf("/Vallauri-Orientati-Frontend")
            ) + "/Vallauri-Orientati-Frontend"
        );
    } else {
        return location.hostname + "/Vallauri-Orientati-Frontend";
    }
}

function findUrl() {
    if (location.origin == "file://") {
        return "http://localhost:" + port;
    } else {
        return location.origin.split(":").slice(0, 2).join(":") + ":" + port;
    }
}

window.addEventListener("load", () => {
    if (
        location.pathname.substring(location.pathname.lastIndexOf("/") + 1) !=
        "login.html"
    ) {
        autoReLogin();
    }
});

/**
 * Esegue una richiesta di login come admin all'endpoint /api/v1/login.
 * @param {string} username
 * @param {string} password
 * @returns Nuova PROMISE cona la risposta del server
 */
function login(username, password) {
    return new Promise((res, rej) => {
        const endpointUrl = serverUrl + "login";
        const method = "POST";

        const body = new FormData();
        body.append("username", username);
        body.append("password", password);

        vallauriRequest(endpointUrl, method, {}, body)
            .then((response) => {
                localStorage.setItem("access_token", response.access_token);
                localStorage.setItem("refresh_token", response.refresh_token);
                res(response);
            })
            .catch((error) => {
                rej(semplificaErrore(error));
            });
    });
}

/**
 * Esegue una richiesta di login come utente temporaneo all'endpoint /api/v1/login/temp.
 * @returns Nuova PROMISE cona la risposta del server
 */
function loginTemp() {
    return new Promise((res, rej) => {
        const endpointUrl = serverUrl + "utenti/temp";
        const method = "POST";

        const body = new FormData();

        vallauriRequest(endpointUrl, method, {}, body)
            .then((response) => {
                localStorage.setItem("access_token", response.access_token);
                localStorage.setItem("refresh_token", response.refresh_token);
                res(response);
            })
            .catch((error) => {
                rej(semplificaErrore(error));
            });
    });
}

/**
 * Esegue un controllo per verificare se l'access token è valido
 * @param {string} [access_token=localStorage.getItem("access_token")] access_token
 * @param {string} [urlEndPoint=url + "/api/v1/user   s/me"] url
 * @returns true: access token valido, false: accesso token non valido
 */
function testAccessToken(
    access_token = localStorage.getItem("access_token"),
    endpointUrl = serverUrl + "utenti/me"
) {
    return new Promise((res, rej) => {
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };
        vallauriRequest(endpointUrl, "GET", headers)
            .then((response) => {
                res();
            })
            .catch((error) => {
                if (error == 500) rej("Errore del server, riprova più tardi");
                else rej();
            });
    });
}

/**
 * Richiede un nuovo token di autenticazione dal token di refresh dato
 * @param {string} refresh_token
 * @param {string} endpointUrl
 */
function requestNewToken(
    refresh_token = localStorage.getItem("refresh_token"),
    endpointUrl = serverUrl + "token/refresh"
) {
    return new Promise((res, rej) => {
        const body = {
            refresh_token: refresh_token,
        };

        vallauriRequest(endpointUrl, "POST", {}, body)
            .then((response) => {
                res(response);
            })
            .catch((error) => {
                if (error == 500) rej("Errore del server, riprova più tardi");
                else rej("Errore nella validazione della richiesta");
            });
    });
}

/**
 * gestione dei token: effettua una prova per determinare se l'access token è valido, in caso contrario ne richiede un altro con il session token, in caso anche l'ultimo non sia valido richiede il login per ottenere nuovi token
 */
function autoReLogin() {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");

    if (access_token) {
        testAccessToken(access_token)
            .then(() => {
                console.log("Login sessione effettuato");
                document.dispatchEvent(new CustomEvent("loginSucceded"));
            })
            .catch((err) => {
                if (err) {
                    console.error(err);
                    location.href = "pages/login.html";
                } else if (refresh_token) {
                    requestNewToken(refresh_token)
                        .then((res) => {
                            localStorage.setItem("access_token", res.access_token);
                            localStorage.setItem("refresh_token", res.refresh_token);

                            document.dispatchEvent(new CustomEvent("loginSucceded"));
                        })
                        .catch((err) => {
                            console.error(err);
                            location.href = "pages/login.html";
                        });
                } else {
                    console.error("Nessun refresh token specificato")
                    location.href = "pages/login.html";
                }
            });
    } else {
        console.error("Nessun token di accesso trovato");
        //location.href = "pages/login.html";
    }
}

/**
 * Semplifica il codice di errore passato trasformandolo in un messaggio leggibile dall'utente.
 * @param {int} errorCode
 * @returns Una stringa messaggio generalizzata dell'errore
 */
function semplificaErrore(errorCode) {
    if (errorCode == 401) return "Nessun utente trovato con queste credenziali";
    else return "Errore interno nel server";
}

async function getAdminStatus() {
    const access_token = localStorage.getItem("access_token");
    const endpointUrl = serverUrl + "utenti/me";

    if (!access_token) {
        throw new Error("Access token non trovato");
    }

    const headers = {
        Authorization: `Bearer ${access_token}`,
    };

    try {
        const response = await vallauriRequest(endpointUrl, "GET", headers);
        if (response && response.admin !== undefined) {
            return response.admin;
        } else {
            throw new Error("Campo admin non trovato nella risposta");
        }
    } catch (error) {
        throw new Error(semplificaErrore(error));
    }
}

function checkAdmin() {
    getAdminStatus()
        .then((response) => {
            if (!response) {
                MostraPaginaErrore(
                    null,
                    "Non sei autorizzato ad accedere a questa pagina"
                );
            }
        })
        .catch((error) => {
            console.error(error);
            mostraAlert("errore", error);
        });
}

/**
 * Removes the tokens from the localstorage and redirects to the index
 */
function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    location.href = "index.html";
}
