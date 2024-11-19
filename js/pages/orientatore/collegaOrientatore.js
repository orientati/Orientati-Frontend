"use strict";
let user;

window.addEventListener("DOMContentLoaded", ()=>{
    controllaOrientatore();

    document.getElementById("btnLink").addEventListener("click", collegaOrientatore);
}); 

/**
 * Reinderizza al login se non loggato o non orientatore. Manda all'index degli orienatori se è gia loggato come esso
 */
function controllaOrientatore(){
    // Reinderizza se già orientatore
    getMe()
    .then(res => {
        user = res;
        if(user.orientatoreId && user.orientatoreId != 0)
            location.href = "./pages/orientatore/index.html";
        else if(user.isAdmin || user.temporaneo)
            location.href = "./pages/login.html";

    }).catch((err, code) => {
        location.href = "./pages/login.html";
    })
}


function collegaOrientatore(){
    linkOrientatore(document.getElementById("codiceOrientatore").value)
    .then(res => {
        mostraAlert("successo", res, 3);
        location.href = "./pages/orientatore/index.html";
    }) .catch((err, code) => {
        mostraAlert("errore", err);
    })
}