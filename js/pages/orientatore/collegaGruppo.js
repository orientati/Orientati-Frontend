"use strict";
let user;

document.addEventListener("loginSucceded", controllaOrientatore);

window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btnLink").addEventListener("click", collegaGruppo);
});

/**
 * Reinderizza al login se non loggato o non orientatore. Manda all'index degli orienatori se è gia loggato come esso
 */
function controllaOrientatore() {
    // Reinderizza se già orientatore
    getMe()
        .then(res => {
            user = res;
            if (user.orientatoreId != null && user.orientatoreId != 0)
                location.href = "./pages/orientatore/index.html";
            else if (user.isAdmin)
                location.href = "./pages/login.html";

        }).catch((err, code) => {
        location.href = "./pages/login.html";
    })
}


function collegaGruppo() {
    linkGruppo(document.getElementById("codiceGruppo").value.toUpperCase())
        .then(res => {
            mostraAlert("successo", res, 3);
            location.href = "./pages/orientatore/index.html";
        }).catch((err, code) => {
        mostraAlert("errore", err);
    })
}