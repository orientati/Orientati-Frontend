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
    divGruppo.innerHTML = "";

    const nomeGruppo = document.createElement("h1");
    nomeGruppo.innerHTML = "Gruppo <span>" + group.nome + "</span>";

    const orariTeorici = document.createElement("p");
    orariTeorici.textContent = group.orario_partenza;

    const divTop = document.createElement("div");
    divTop.appendChild(nomeGruppo);
    divTop.appendChild(orariTeorici);

    const orariReali = document.createElement("h2");
    let [ore, minuti] = group.orario_partenza.split(":").map(Number);
    let orarioFineTeorico = new Date();
    orarioFineTeorico.setHours(ore);
    orarioFineTeorico.setMinutes(minuti);
    orarioFineTeorico.setSeconds(0);
    orarioFineTeorico.setMinutes(orarioFineTeorico.getMinutes() + 10);
    orariTeorici.textContent += " - " + String(orarioFineTeorico.getHours()).padStart(2, "0") + ":" + String(orarioFineTeorico.getMinutes()).padStart(2, "0");

    let orarioFineReale;

    if (group.numero_tappa === 0) {
        orariReali.textContent = "Non partito";
    } else {
        [ore, minuti] = group.orario_partenza_effettivo.split(":").map(Number);
        orarioFineReale = new Date();
        orarioFineReale.setHours(ore);
        orarioFineReale.setMinutes(minuti);
        orarioFineReale.setSeconds(0);
        orarioFineReale.setMinutes(orarioFineReale.getMinutes() + 10);
        orariReali.textContent = group.orario_partenza_effettivo + " - " + String(orarioFineReale.getHours()).padStart(2, "0") + ":" + String(orarioFineReale.getMinutes()).padStart(2, "0");
    }
    const divBottom = document.createElement("div");
    const text = document.createElement("p");
    text.textContent = "Orari reali:";


    divBottom.appendChild(text);
    divBottom.appendChild(orariReali);

    const outerDivSliderTeorico = document.createElement("div");
    outerDivSliderTeorico.classList.add("outer-div-slider");

    const sliderTeorico = document.createElement("progress");
    sliderTeorico.classList.add("slider");
    sliderTeorico.max = 100;
    sliderTeorico.value = 0;
    outerDivSliderTeorico.appendChild(sliderTeorico);

    const outerDivSliderReale = document.createElement("div");
    outerDivSliderReale.classList.add("outer-div-slider");

    const sliderReale = document.createElement("progress");
    sliderReale.classList.add("slider");
    sliderReale.max = 100;
    sliderReale.value = 0;
    outerDivSliderReale.appendChild(sliderReale);


    const tempoTotaleMinuti = 10; //TODO: DA RICAVARE
    setInterval(aggiornaSlider, 50);

    function aggiornaSlider() {
        const oraAttuale = new Date();

        const differenzaMinutiTeorico = Math.max(0, (orarioFineTeorico - oraAttuale) / (1000 * 60));
        const percentualeCompletamentoTeorico = Math.min(100, ((tempoTotaleMinuti - differenzaMinutiTeorico) / tempoTotaleMinuti) * 100);
        sliderTeorico.value = 100 - percentualeCompletamentoTeorico;

        if (group.numero_tappa !== 0) {
            const differenzaMinutiReale = Math.max(0, (orarioFineReale - oraAttuale) / (1000 * 60));
            const percentualeCompletamentoReale = Math.min(100, ((tempoTotaleMinuti - differenzaMinutiReale) / tempoTotaleMinuti) * 100);
            sliderReale.value = 100 - percentualeCompletamentoReale;
        }
    }

    divTop.appendChild(outerDivSliderTeorico);
    if (group.numero_tappa !== 0) {
        divBottom.appendChild(outerDivSliderReale);
    }

    divGruppo.appendChild(divTop);
    divGruppo.appendChild(divBottom);

    //Chimica
    const lab = document.getElementById("lab");
    let laboratorio = aula.nome.charAt(0).toUpperCase() + aula.nome.slice(1).toLowerCase();
    lab.textContent = "Lab. " + laboratorio;

    const availability = document.getElementById("availability");
    availability.textContent = aula.occupata ? "OCCUPATO" : "LIBERO";
    availability.classList.add(aula.occupata ? "occupato" : "libero");
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
