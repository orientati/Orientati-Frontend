"use strict";
window.addEventListener("load", init);

/**
 * Funzione richiamata al caricamento della pagina
 */
function init() {
    mostraErrore();
}

/**
 * Mostra il messaggio e il codice di errore nella pagina
 */
function mostraErrore() {
    let errorMsg = sessionStorage.getItem("errorMsg");
    let messaggio = "Pagina inesistente",
        codice = 404;

    console.log(errorMsg);

    if (errorMsg) {
        errorMsg = JSON.parse(errorMsg);
        messaggio = errorMsg.msg;
        codice = errorMsg.code;
    }

    document.getElementById("txtMsg").innerText = messaggio;
    document.getElementById("txtCodice").innerText = codice;
    document.title = "Errore " + codice;
}
