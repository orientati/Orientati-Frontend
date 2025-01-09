"use strict";

const pollingTime = 3000;
let divGruppo;
let reloadPagina;

let gruppo, aula;

window.addEventListener("DOMContentLoaded", function () {
    divGruppo = this.document.getElementById("gruppoSuccessivo");

    getGruppi()
        .then((gruppi) => {
            loadGruppi(gruppi);
            getTappeGruppo(gruppo.id)
                .then((aule) => {
                    loadAule(aule);
                })
                .catch((err) => {
                    console.error(err);
                    mostraAlert("errore", err);
                });
        })
        .catch((err) => {
            console.error(err);
            mostraAlert("errore", err);
        });


    reloadPagina = setInterval(updatePage, pollingTime);
})
;

function loadGruppi(groups) {
    //prendi o il gruppo con numero tappa = 1 o il gruppo con numero tappa = 0
    let gruppoInCorso = groups.find((group) => group.numero_tappa === 1);
    if (gruppoInCorso === undefined) {
        gruppoInCorso = groups.find((group) => group.numero_tappa === 0);
    }
    if (gruppoInCorso !== undefined) {
        gruppo = gruppoInCorso;
    }

}

function creaGruppo(group, aula) {
    divGruppo.innerHTML = "";
    let titolo = document.createElement("h2");
    titolo.textContent = group.nome;
    let orarioPartenza = document.createElement("p");
    orarioPartenza.textContent = "Orario di partenza: " + group.orario_partenza + " Orario di partenza effettivo: " + group.orario_partenza_effettivo;
    let orarioFineTappa = document.createElement("p");

    let orarioFine = new Date();
    orarioFine.setHours(parseInt(group.orario_partenza.split(":")[0]));
    orarioFine.setMinutes(parseInt(group.orario_partenza.split(":")[1]));
    orarioFine.setMinutes(orarioFine.getMinutes() + group.minuti_partenza);

    orarioFineTappa.textContent = "Orario di fine tappa: " + orarioFine.getHours() + ":" + orarioFine.getMinutes();

    divGruppo.appendChild(titolo);
    divGruppo.appendChild(orarioPartenza);
    divGruppo.appendChild(orarioFineTappa);

    let aulaDiv = document.createElement("div");
    aulaDiv.classList.add("aula");
    aulaDiv.textContent = aula.nome;
    let aulaStatus = document.createElement("p");
    aulaStatus.textContent = aula.occupata ? "Occupata" : "Libera";
    divGruppo.appendChild(aulaDiv);
    divGruppo.appendChild(aulaStatus);

}

function loadAule(aule) {
    let tappa
    if (gruppo.numero_tappa === 0)
        tappa = aule.tappe[1];
    else
        tappa = aule.tappe[gruppo.numero_tappa];
    getAule().then(
        (aule) => {
            aula = aule.find((aula) => aula.id === tappa.aula_id);
            creaGruppo(gruppo, aula);
        }
    ).catch(
        (err) => {
            console.error(err);
            mostraAlert("errore", err);
        }
    );
}

function updatePage() {
    getGruppi()
        .then((gruppi) => {
            loadGruppi(gruppi);
            getTappeGruppo(gruppo.id)
                .then((aule) => {
                    loadAule(aule);
                })
                .catch((err) => {
                    console.error(err);
                    mostraAlert("errore", err);
                });
        })
        .catch((err) => {
            console.error(err);
            mostraAlert("errore", err);
        });
}
