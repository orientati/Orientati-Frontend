"use strict";

const pollingTime = 5000;
let groupsWrapper, tableOrientati;

window.addEventListener("DOMContentLoaded", function () {
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

    groupsWrapper = this.document.getElementById("groupsWrapper");
    tableOrientati = this.document.getElementById("tableOrientati");

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
    labInfo.id = group.id + "-aula";
    labInfo.textContent = group.aula_nome + " - " + group.aula_posizione;

    const subjectTitle = document.createElement("h1");
    subjectTitle.id = group.id + "-materia";
    subjectTitle.textContent = group.aula_materia;

    centralDiv.appendChild(labInfo);
    centralDiv.appendChild(subjectTitle);

    // Aggiungi tutto al contenitore principale
    contentDiv.appendChild(topDiv);
    contentDiv.appendChild(centralDiv);

    if (group.prossima_tappa != null) {
        // Crea la sezione "bottom"
        const bottomDiv = document.createElement("div");
        bottomDiv.className = "bottom";

        const nextLabText = document.createElement("p");
        nextLabText.className = "next-lab";
        nextLabText.textContent = "Prossimo Laboratorio";

        const nextLabTitle = document.createElement("h2");
        nextLabTitle.id = group.id + "-materiaprossima";
        nextLabTitle.textContent = group.prossima_tappa.aula.materia;

        const nextLabInfo = document.createElement("p");
        nextLabInfo.id = group.id + "-aulaprossima";
        nextLabInfo.textContent =
            group.prossima_tappa.aula.nome +
            " - " +
            group.prossima_tappa.aula.posizione;

        bottomDiv.appendChild(nextLabText);
        bottomDiv.appendChild(nextLabTitle);
        bottomDiv.appendChild(nextLabInfo);

        contentDiv.appendChild(bottomDiv);
    }

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
    if (group.prossima_tappa != null) {
        const hours = parseInt(group.orario_partenza.split(":")[0]);
        const minutes = parseInt(group.orario_partenza.split(":")[1]);

        const hoursTappa =
            Math.round((minutes + group.prossima_tappa.minuti_arrivo) / 60) + hours;
        const minutesTappa = (minutes + group.prossima_tappa.minuti_arrivo) % 60;

        var d = new Date();

        if (
            (group.arrivato == null || !group.arrivato) &&
            (d.getHours() > hoursTappa ||
                (d.getHours() == hoursTappa && d.getMinutes() > minutesTappa))
        ) {
            return {
                classe: "late",
                text: "IN RITARDO",
            };
        }
    }
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

        let chk = document.createElement("input");
        chk.id = orientati[i].id;
        chk.type = "checkbox";
        chk.checked = orientati[i].presente;
        chk.addEventListener("change", changePresenzaLocal);
        lable.appendChild(chk);

        let span = document.createElement("span");
        span.classList.add("slider", "round");
        lable.appendChild(span);

        td.appendChild(lable);
        tr.appendChild(td);
        tableOrientati.appendChild(tr);
    }
}

function changePresenzaLocal(e) {
    changePresenza(e.target.id, e.target.checked)
        .then((res) => mostraAlert("successo", res, 3))
        .catch((err) => {
            e.removeEventListener("change", changePresenzaLocal);

            e.checked = !e.checked;
            mostraAlert("errore", err, 3);
            e.addEventListener("change", changePresenzaLocal);
        });
}