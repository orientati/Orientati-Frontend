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
    if (group.numero_tappa !== 0) {
        let orarioFineTeorico = new Date();
        orarioFineTeorico.setHours(parseInt(group.orario_partenza.split(":")[0]));
        orarioFineTeorico.setMinutes(parseInt(group.orario_partenza.split(":")[1]));
        orarioFineTeorico.setMinutes(orarioFineTeorico.getMinutes() + group.minuti_partenza);
        orariTeorici.textContent += " - " + orarioFineTeorico.getHours() + ":" + orarioFineTeorico.getMinutes();

        let orarioFineReale = new Date();
        orarioFineReale.setHours(parseInt(group.orario_partenza_effettivo.split(":")[0]));
        orarioFineReale.setMinutes(parseInt(group.orario_partenza_effettivo.split(":")[1]));
        orarioFineReale.setMinutes(orarioFineReale.getMinutes() + 10);

        orariReali.textContent = group.orario_partenza_effettivo + " - " + orarioFineReale.getHours() + ":" + orarioFineReale.getMinutes();
    }

    const divBottom = document.createElement("div");

    const text = document.createElement("p");
    text.textContent = "Orari reali:";
    divBottom.appendChild(text);
    divBottom.appendChild(orariReali);

    divGruppo.appendChild(divTop);
    divGruppo.appendChild(divBottom);

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
