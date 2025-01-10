"use strict"

let tappe = [];

document.addEventListener("DOMContentLoaded", function () {

    getGruppo()
        .then((gruppo) => {
                console.log(gruppo);
                getTappe(gruppo.id)
                    .then((tappeGruppo) => {
                        console.log(tappeGruppo);
                        tappe = tappeGruppo;
                        caricaGruppo(gruppo);
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
        ).catch((err) => {
        if (err === 401) {
            console.log("Non autorizzato");
            location.href = "pages/login.html";
        } else if (err === 404) {
            console.log("Nessun gruppo trovato");
            location.href = "pages/orientatore/collegaGruppo.html";
        } else {
            console.log(err);
        }
    });
});

function feedback() {
    location.href = "https://forms.gle/GYVu66aoP1y7AF45A";
}

function caricaGruppo(gruppo) {
    document.getElementById("nome-gruppo").textContent = gruppo.nome;
    if (gruppo.numero_tappa === 0 && !gruppo.arrivato) {
        // Se il gruppo non è ancora partito
        document.getElementById("aula-attuale").textContent = "NON PARTITO";

    } else if (gruppo.numero_tappa === 0 && gruppo.arrivato) {
        // Se il gruppo è uscito
        document.getElementById("aula-attuale").textContent = "PERCORSO FINITO";
    } else {
        // Se il gruppo è in giro
        document.getElementById("azione-in-corso").textContent = gruppo.arrivato ? "Arrivato" : "In viaggio";
    }


}
