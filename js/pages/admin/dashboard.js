"use strict";

const pollingTime = 5000;
let groupsWrapper, tableOrientati;

window.addEventListener("DOMContentLoaded", function () {
    groupsWrapper = this.document.getElementById("groupsWrapper");
    tableOrientati = this.document.getElementById("tableOrientati");
    getGruppi()
        .then(loadGraphic)
        .catch((err) => {
            console.error(err);
            mostraAlert("errore", err);
        });

    getOrientati()
        .then(loadTable)
        .catch((err) => {
            console.error(err);
            mostraAlert("errore", err);
        });


    setInterval(updatePage, pollingTime);
});

function loadGraphic(groups) {
    groupsWrapper.innerHTML = "";
    for (let i = 0; i < groups.length; i++) {
        if (groups[i] !== undefined)
            creaGruppo(groups[i]);
    }
}

function creaGruppo(group) {
    // Crea il div principale con classe "content"
    const contentDiv = document.createElement("div");
    contentDiv.className = "content";
    contentDiv.id = group.id;

    // Crea la sezione "top"
    const topDiv = document.createElement("div");
    topDiv.className = "top";

    const groupDiv = document.createElement("div");
    const groupTitle = document.createElement("h2");
    groupTitle.id = group.id + "-nome";
    groupTitle.textContent = group.nome;

    const groupMembers = document.createElement("p");
    groupMembers.id = group.id + "-orientatori";
    let output = "";

    if (group.nomi_orientatori.length >= 2) {
        output = group.nomi_orientatori[0];
        let j;
        for (j = 1; j < group.nomi_orientatori.length; j++)
            output += " - " + group.nomi_orientatori[j];
    } else if (group.nomi_orientatori.length == 1)
        output = group.nomi_orientatori[0];

    groupMembers.textContent = output;

    groupDiv.appendChild(groupTitle);
    groupDiv.appendChild(groupMembers);

    const onTimeSpan = document.createElement("span");
    const details = getInOrario(group);
    onTimeSpan.id = group.id + "-ontime";
    onTimeSpan.className = details.classe;
    onTimeSpan.textContent = details.text;

    topDiv.appendChild(groupDiv);
    topDiv.appendChild(onTimeSpan);

    // Crea la sezione centrale
    const centralDiv = document.createElement("div");
    const labInfo = document.createElement("p");
    labInfo.id = group.id + "-materia";
    labInfo.textContent = group.aula_materia + " - " + group.aula_posizione;
    const subjectTitle = document.createElement("h1");

    subjectTitle.id = group.id + "-aula";
    subjectTitle.textContent = group.aula_nome;
    centralDiv.appendChild(labInfo);
    centralDiv.appendChild(subjectTitle);

    const infoPresenze = document.createElement("p");
    infoPresenze.textContent = "Partecipanti: " + group.orientati_presenti + "/" + group.totale_orientati;
    centralDiv.appendChild(infoPresenze);

    const orarioPartenzaFine = document.createElement("p");
    if (group.numero_tappa !== 0) {
        orarioPartenzaFine.textContent = "Partenza: " + group.orario_partenza_effettivo;
        centralDiv.appendChild(orarioPartenzaFine);
    }

    if (group.numero_tappa === 0 && group.arrivato === true) {
        orarioPartenzaFine.textContent += " Fine: " + group.orario_fine_effettivo;
    }

    // Aggiungi tutto al contenitore principale
    contentDiv.appendChild(topDiv);
    contentDiv.appendChild(centralDiv);

    // Aggiungi il contenitore principale al body o a un altro elemento della pagina
    groupsWrapper.appendChild(contentDiv);
}

function getInOrario(group) {

    if (group.numero_tappa === 0 && group.arrivato === false) {
        return {
            classe: "not-started",
            text: "NON PARTITO",
        };
    }
    if (group.numero_tappa === 0 && group.arrivato === true) {
        return {
            classe: "not-started",
            text: "USCITO",
        };
    }

    let data = new Date();
    data.setHours(parseInt(group.orario_partenza.split(":")[0]));
    data.setMinutes(parseInt(group.orario_partenza.split(":")[1]));

    data.setMinutes(data.getMinutes() + group.minuti_partenza);


    var d = new Date();
    d.setSeconds(0);
    data.setSeconds(0);
    if (d.getHours() > data.getHours() || (d.getHours() === data.getHours() && d.getMinutes() > data.getMinutes())) {
        return {
            classe: "late",
            text: "IN RITARDO",
        };
    }
    // }
    return {
        classe: "on-time",
        text: "IN ORARIO",
    };
}

function updatePage() {
    console.log("Gaga")
    getGruppi()
        .then(loadGraphic)
        .catch((err) => {
            console.error(err);
            mostraAlert("errore", err);
        });

    getOrientati()
        .then(loadTable)
        .catch((err) => {
            console.error(err);
            mostraAlert("errore", err);
        });
}

function loadTable(orientati) {
    console.log(orientati);
    tableOrientati.innerHTML = "<tr class=\"tableHeader\">\n" +
        "                              <th style=\"width: 30px\"></th>\n" +
        "                              <th>Cognome e Nome</th>\n" +
        "                              <th>Nome Gruppo</th>\n" +
        "                              <th>Ora di partenza</th>\n" +
        "                              <th>Presenza</th>\n" +
        "                          </tr>";
    let i;
    for (i = 0; i < orientati.length; i++) {
        let tr = document.createElement("tr");
        tr.id = "orientato-" + orientati[i].id;

        let td = document.createElement("td");
        tr.appendChild(td);

        td = document.createElement("td");
        td.textContent = orientati[i].nome + " " + orientati[i].cognome;
        tr.appendChild(td);

        td = document.createElement("td");
        td.textContent = orientati[i].gruppo_nome;
        tr.appendChild(td);

        td = document.createElement("td");
        td.textContent = orientati[i].gruppo_orario_partenza;
        tr.appendChild(td);

        let lable = document.createElement("label");
        lable.classList.add("switch");

        td = document.createElement("td");
        td.classList.add("chk-td");

        let range = document.createElement("input");
        range.id = orientati[i].id;
        range.type = "range";
        range.min = 1;
        range.max = 3;
        range.classList.add("tgl-def", "custom-toggle");
        if (orientati[i].presente) {
            range.classList.add("tgl-on");
            range.classList.remove("tgl-def", "tgl-off");
            range.value = 3;
        } else if (orientati[i].assente) {
            range.classList.add("tgl-off");
            range.classList.remove("tgl-def", "tgl-on");
            range.value = 1;
        }
        else {
            range.classList.add("tgl-def");
            range.classList.remove("tgl-off", "tgl-on");
            range.value = 2;
        }

        range.addEventListener("change", changePresenzaLocal);
        lable.appendChild(range);

        let span = document.createElement("span");
        span.classList.add("slider", "round");
        lable.appendChild(span);

        td.appendChild(lable);
        tr.appendChild(td);
        tableOrientati.appendChild(tr);
    }
}

function changePresenzaLocal(e) {
    let presente, assente;

    if (e.target.value == 1) {
        presente = false;
        assente = true;
    } else if (e.target.value == 2) {
        presente = false;
        assente = false;
    } else {
        presente = true;
        assente = false;
    }

    changePresenza(e.target.id, presente, assente)
        .then((res) => mostraAlert("successo", res, 3))
        .catch((err) => {
            e.removeEventListener("change", changePresenzaLocal);

            e.checked = !e.checked;
            mostraAlert("errore", err, 3);
            e.addEventListener("change", changePresenzaLocal);
        });
}
