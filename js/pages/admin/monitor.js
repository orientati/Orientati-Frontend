"use strict";

const pollingTime = 3000;
let divGruppo;
let reloadPagina;

let gruppo, aula;

window.addEventListener("DOMContentLoaded", function () {
    const time = this.document.getElementById("time");
    time.textContent = new Date().toLocaleTimeString();

    setInterval(() => {
        time.textContent = new Date().toLocaleTimeString();
    }, 1000);


    divGruppo = this.document.getElementById("group-info");

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
});

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

    document.getElementById("nomeGruppo").innerHTML = group.nome;

    let [ore, minuti] = group.orario_partenza.split(":").map(Number);
    let orarioFineTeorico = new Date();
    orarioFineTeorico.setHours(ore);
    orarioFineTeorico.setMinutes(minuti);
    orarioFineTeorico.setSeconds(0);
    orarioFineTeorico.setMinutes(orarioFineTeorico.getMinutes() + 10);
    document.getElementById("orariTeorici").textContent = group.orario_partenza + " - " + String(orarioFineTeorico.getHours()).padStart(2, "0")
        + ":" + String(orarioFineTeorico.getMinutes()).padStart(2, "0");

    document.getElementById("presenza").textContent = group.orientati_presenti + "/" + (group.totale_orientati - group.orientati_assenti);

    let orarioFineReale;

    document.getElementById("orariReali").textContent = group.nome;

    if (group.numero_tappa === 0) {
        document.getElementById("orariReali").textContent = "Non partito";
        document.getElementsByClassName("outer-div-slider")[1].classList.add("hide");
    } else {
        [ore, minuti] = group.orario_partenza_effettivo.split(":").map(Number);
        orarioFineReale = new Date();
        orarioFineReale.setHours(ore);
        orarioFineReale.setMinutes(minuti);
        orarioFineReale.setSeconds(0);
        orarioFineReale.setMinutes(orarioFineReale.getMinutes() + 10);
        document.getElementById("orariReali").textContent = group.orario_partenza_effettivo + " - " + String(orarioFineReale.getHours()).padStart(2, "0") + ":" + String(orarioFineReale.getMinutes()).padStart(2, "0");
        document.getElementsByClassName("outer-div-slider")[1].classList.remove("hide");
    }

    document.getElementById("text").textContent = "Orari reali:";

    const tempoTotaleMinuti = 10; //TODO: DA RICAVARE
    setInterval(aggiornaSlider, 1000);

    function aggiornaSlider() {
        const oraAttuale = new Date();

        const differenzaMinutiTeorico = Math.max(0, (orarioFineTeorico - oraAttuale) / (1000 * 60));
        const percentualeCompletamentoTeorico = Math.min(100, ((tempoTotaleMinuti - differenzaMinutiTeorico) / tempoTotaleMinuti) * 100);
        document.getElementById("progressTeorico").value = 100 - percentualeCompletamentoTeorico;

        if (group.numero_tappa !== 0) {
            const differenzaMinutiReale = Math.max(0, (orarioFineReale - oraAttuale) / (1000 * 60));
            const percentualeCompletamentoReale = Math.min(100, ((tempoTotaleMinuti - differenzaMinutiReale) / tempoTotaleMinuti) * 100);

            document.getElementById("progressReale").value = 100 - percentualeCompletamentoReale;
        }
    }

    //Chimica
    const lab = document.getElementById("lab");
    let laboratorio = aula.nome.charAt(0).toUpperCase() + aula.nome.slice(1).toLowerCase();
    lab.textContent = "Lab. " + laboratorio;

    const availability = document.getElementById("availability");
    availability.textContent = aula.occupata ? "OCCUPATO" : "LIBERO";
    availability.classList.add(aula.occupata ? "occupato" : "libero");
    availability.classList.remove(!aula.occupata ? "occupato" : "libero");
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
                    creaGruppo(gruppo, aula);
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
