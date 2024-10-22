"use strict";
const port = 8000;
let url;
const path = findHostName();


/**
 * trova l'hostname, utile per mantenere la funzionalità durante il developing in locale.
 * @returns hostname
 */
function findHostName(){
    if(location.origin == "file://")
        return location.href.substring(0, location.href.lastIndexOf("/Vallauri-Orientati-Frontend"))+"/Vallauri-Orientati-Frontend";
    else{
        if(location.hostname == "localhost" || location.hostname == "127.0.0.1"){
            url = "http://127.0.0.1:"+port;
        }else{
            url = location.hostname + ":" + port;
        }
        return host+"/Vallauri-Orientati-Frontend"
    }

}

window.addEventListener("load", ()=>{
    if(location.pathname.substring(location.pathname.lastIndexOf("/") + 1)!="login.html"){
        console.log("cdscds")
        autoReLogin();
    }
    console.log(location.origin);
});

/**
 * Esegue una richiesta di login come admin all'endpoint /api/v1/login.
 * @param {string} username 
 * @param {string} password 
 * @returns Nuova PROMISE cona la risposta del server
 */
function login(username, password) {
    return new Promise((res, rej) =>{
        const endpointUrl = url + "/api/v1/login";
        const method = "POST";
    
        const body = new FormData();
        body.append("username", username);
        body.append("password", password);
    
        vallauriRequest(endpointUrl, method, {}, body)
        .then((response) => {
            res(response);
            if(!sessionStorage.getItem("path") && sessionStorage.getItem("path").substring(sessionStorage.getItem("path").lastIndexOf("/") + 1) != "login.html"){
                location.href = sessionStorage.getItem("path");
            }else{
                location.href = path+"/index.html";
            }
        })
        .catch((error) => {
            rej(error);
        });
    })
}

/**
 * Esegue una richiesta di login come admin all'endpoint /api/v1/login.
 * @param {string} [access_token] access_token 
 * @param {string} url 
 * @returns Nuova PROMISE cona la risposta del server
 */
function testAccessToken(access_token = localStorage.getItem("access_token"), endpointUrl =url + "/api/v1/users/me"){
    const headers = {
        "Authorization": `Bearer ${access_token}`
    };
    vallauriRequest(endpointUrl,"GET",headers).then((response) =>{
        return true;
    }).catch((error)=>{
        return false;
    });
}

/**
 * gestione dei token: effettua una prova per determinare se l'access token è valido, in caso contrario ne richiede un altro con il session token, in case anche l'ultimo non sia valido richiede il login per ottenere nuovi token
 */

function autoReLogin(){
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");

    console.log(access_token + "---" + refresh_token);

    const endpointUrl = url + "/api/v1/users/me";

    const headers = {
        "Authorization": `Bearer ${access_token}`
    };
    vallauriRequest(endpointUrl,"GET",headers).then((response) =>{
        console.log(response);
    }).catch((error)=>{
        if (error.response) {
            console.log("Errore con status code:", error.response.status);
        } else if (error.message && error.message.includes("status:")) {
            const statusCode = error.message.match(/status:\s*(\d+)/)?.[1];
            if(statusCode == 401){
                console.log("access token non valido invio richiesta refresh token")
                
                const body = {"refresh_token":refresh_token}
                vallauriRequest(url+"/api/v1/token/refresh", "POST", {}, body).then((response)=> {
                    localStorage.setItem("access_token", response.access_token);
                    location.reload();
                }).catch((error)=>{
                    if (error.message && error.message.includes("status:")) {
                        sessionStorage.setItem("loginMessage","Login scaduto, reinserisci le tue credenziali");
                        sessionStorage.setItem("path",location.pathname);
                        location.href = path+"/html/login.html";
                    }else{
                        console.error("errore sconosciuto");
                        //creazione di una pagina di errore
                    }
                    console.warn(error);
                });
            }else{
            console.log("Errore con status code:", statusCode);
            }
        } else {
            console.error("Errore sconosciuto:", error);
        }
    });
}