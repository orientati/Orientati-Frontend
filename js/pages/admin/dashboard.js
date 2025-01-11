"use strict";

const pollingTime = 3000;
let groupsWrapper, tableOrientati, auleWrapper;
let reloadPagina;

window.addEventListener("DOMContentLoaded", function () {
    groupsWrapper = this.document.getElementById("groupsWrapper");
    tableOrientati = this.document.getElementById("tableOrientati");
    auleWrapper = this.document.getElementById("auleContainer");

    const clearSearch = document.getElementById("clearSearch");
    clearSearch.addEventListener("click", function () {
        document.getElementById("searchInput").value = "";
        searchTable("tableOrientati", "");
    });

    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", function () {
        searchTable("tableOrientati", this.value);
    });


    const modal = document.getElementById("modalGruppo");

    const closeModalButton = document.getElementById("closeModalButtonGruppo");
    closeModalButton.addEventListener("click", function () {
        modal.style.display = "none";
    });


    modaleOrientati();
    modaleFile();

    getGruppi()
        .then(loadGruppi)
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

    getAule()
        .then(loadAule)
        .catch((err) => {
            console.error(err);
            mostraAlert("errore", err);
        });

    reloadPagina = setInterval(updatePage, pollingTime);
});

function loadGruppi(groups) {
    groupsWrapper.innerHTML = "";
    for (let i = 0; i < groups.length; i++) {
        if (groups[i] !== undefined) creaGruppo(groups[i]);
    }
}

function creaGruppo(group) {
    // Crea il div principale con classe "content"
    const contentDiv = document.createElement("div");
    contentDiv.className = "content";
    contentDiv.id = group.id;

    const divLeft = document.createElement("div");
    divLeft.className = "alignInColumn";
    contentDiv.appendChild(divLeft);

    const divRight = document.createElement("div");
    divRight.className = "alignInColumn";
    contentDiv.appendChild(divRight);

    const groupTitle = document.createElement("span");
    groupTitle.id = group.id + "-nome";
    groupTitle.innerHTML = "<h1><span class='highlight'>" + group.nome + "</span><p>" + group.orario_partenza + "</p>" + "</h1>";

    divLeft.appendChild(groupTitle);

    const onTimeSpan = document.createElement("span");
    const details = getInOrario(group);
    onTimeSpan.id = group.id + "-ontime";
    onTimeSpan.className = details.classe;
    onTimeSpan.textContent = details.text;

    let button = document.createElement("button");
    button.classList.add("btnModifica");
    button.textContent = "Modifica";
    button.addEventListener("click", function () {
        const modal = document.getElementById("modalGruppo");
        const inputOrario = document.getElementById("inputOrario");
        const comboBoxTappa = document.getElementById("comboBoxTappa");
        const applyButton = document.getElementById("applyButtonGruppo");
        const inputPresenza = document.getElementById("inputPresenza");

        //Chiamata per sapere i gruppi passare il gruppo gia selezionato

        inputOrario.value = group.orario_partenza;
        getTappeGruppo(group.id)
            .then((tappe) => {
                comboBoxTappa.innerHTML = "";
                let option = document.createElement("option");
                option.value = "0";
                option.textContent = "Fermo";
                comboBoxTappa.appendChild(option);
                tappe.tappe.forEach((tappa) => {
                    let option = document.createElement("option");
                    option.value = tappa.id;
                    option.textContent = tappa.aula_nome;
                    comboBoxTappa.appendChild(option);
                });
            })
            .catch((err) => {
                console.error(err);
                mostraAlert("errore", err);
            })
            .finally(() => {
                comboBoxTappa.selectedIndex = group.numero_tappa;
                inputPresenza.checked = group.arrivato;
            });

        modal.style.display = "block";

        window.addEventListener("click", function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });

        //IL DOCKTOR

        //rimuovo tutti gli events
        const newApplyButton = applyButton.cloneNode(true);

        newApplyButton.addEventListener("click", function () {
            const orario = document.getElementById("inputOrario").value;
            const gruppoId = group.id;

            vallauriRequest(`${serverUrl}admin/dashboard/gruppi/tappa/${gruppoId}?numero_tappa=${comboBoxTappa.selectedIndex}&arrivato=${inputPresenza.checked}`, "PUT", {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`
            })
                .then(() => {
                    modal.style.display = "none";
                    updatePage();
                })
                .catch((err) => {
                    console.error(err);
                    mostraAlert("errore", err);
                });

            vallauriRequest(`${serverUrl}admin/dashboard/gruppi/orario_partenza/${gruppoId}?orario_partenza=${orario}`, "PUT", {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`
            })
                .then(() => {
                    modal.style.display = "none";
                    updatePage();
                })
                .catch((err) => {
                    console.error(err);
                    mostraAlert("errore", err);
                });


            modal.style.display = "none";
        });
        applyButton.parentNode.replaceChild(newApplyButton, applyButton);

    });

    let codice = document.createElement("p");
    if (group.codice !== null) {
        codice.textContent = "Codice: " + group.codice;
    } else {
        codice.style.display = "none";
    }
    let buttonRigeneraCodice = document.createElement("button");
    buttonRigeneraCodice.classList.add("btnModifica");
    buttonRigeneraCodice.textContent = "Rigenera Codice";
    buttonRigeneraCodice.addEventListener("click", function () {

        buttonRigeneraCodice.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Caricamento...`;

        vallauriRequest(`${serverUrl}admin/gruppi/rigeneraCodice/${group.id}`, "PUT", {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
        })
            .then(() => {
                updatePage();
            })
            .catch((err) => {
                console.error(err);
                mostraAlert("errore", err);
            });
    });




    // Crea la sezione centrale


    const labInfo = document.createElement("p");
    labInfo.id = group.id + "-materia";
    labInfo.textContent = group.aula_materia + " - " + group.aula_posizione;

    const subjectTitle = document.createElement("h1");
    subjectTitle.id = group.id + "-aula";
    subjectTitle.textContent = group.aula_nome;

    const span = document.createElement("span");
    span.classList.add("inViaggio");
    span.textContent = "In viaggio verso:";

    if (group.arrivato === false && group.numero_tappa !== 0) {
        divLeft.appendChild(span);
    }

    if (group.numero_tappa !== 0) {
        divLeft.appendChild(labInfo);
        divLeft.appendChild(subjectTitle);
    }

    const infoPresenze = document.createElement("p");
    infoPresenze.textContent = "Partecipanti: " + group.orientati_presenti + "/" + (group.totale_orientati - group.orientati_assenti);
    if (group.orientati_assenti !== 0) {
        infoPresenze.textContent += " (" + group.totale_orientati + ")";
    }

    const orarioPartenzaFine = document.createElement("p");
    if (!(group.numero_tappa === 0 && group.arrivato === false)) {
        orarioPartenzaFine.textContent = "Partenza: " + group.orario_partenza_effettivo;
        divLeft.appendChild(orarioPartenzaFine);
    }

    if (group.numero_tappa === 0 && group.arrivato === true) {
        orarioPartenzaFine.textContent += " Fine: " + group.orario_fine_effettivo;
    }

    divLeft.appendChild(orarioPartenzaFine);

    divRight.appendChild(onTimeSpan);
    divRight.appendChild(infoPresenze);
    divRight.appendChild(button);
    divRight.appendChild(codice);
    divRight.appendChild(buttonRigeneraCodice);

    // Aggiungi tutto al contenitore principale

    // Aggiungi il contenitore principale al body o a un altro elemento della pagina
    groupsWrapper.appendChild(contentDiv);
}

function getInOrario(group) {
    if (group.numero_tappa === 0 && group.arrivato === false) {
        return {
            classe: "not-started", text: "NON PARTITO",
        };
    }
    if (group.numero_tappa === 0 && group.arrivato === true) {
        return {
            classe: "not-started", text: "USCITO",
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
        let minutesRitardo = (d.getHours() - data.getHours()) * 60 + d.getMinutes() - data.getMinutes();

        if (minutesRitardo <= 3) {
            return {
                classe: "bit-late", text: "LIEVE RITARDO",
            }
        } else if (d.getHours() === data.getHours() && d.getMinutes()) return {
            classe: "late", text: "IN RITARDO",
        };
    }
    // }
    return {
        classe: "on-time", text: "IN ORARIO",
    };
}

function updatePage() {
    getGruppi()
        .then(loadGruppi)
        .catch((err) => {
            console.error(err);
            mostraAlert("errore", err);
        });
    if (document.getElementById("searchInput").value === "") {
        getOrientati()
            .then(loadTable)
            .catch((err) => {
                console.error(err);
                mostraAlert("errore", err);
            });
    }

    getAule()
        .then(loadAule)
        .catch((err) => {
            console.error(err);
            mostraAlert("errore", err);
        });
}

function loadTable(orientati) {
    tableOrientati.innerHTML = "";

    orientati.forEach((datiOrientato) => {
        let tr = document.createElement("tr");
        tr.id = "orientato-" + datiOrientato.id;

        let td = document.createElement("td");
        tr.appendChild(td);

        td = document.createElement("td");
        td.textContent = datiOrientato.cognome + " " + datiOrientato.nome;
        tr.appendChild(td);
        /*
            td = document.createElement("td");
            td.id = "scuola-" + datiOrientato.scuolaDiProvenienza_id;
            td.textContent = datiOrientato.scuolaDiProvenienza_nome;
            tr.appendChild(td);
        */
        td = document.createElement("td");
        td.id = "gruppo-" + datiOrientato.gruppo_id;
        td.textContent = datiOrientato.gruppo_nome;
        tr.appendChild(td);

        td = document.createElement("td");
        td.textContent = datiOrientato.gruppo_orario_partenza;
        tr.appendChild(td);

        td = document.createElement("td");
        let range = document.createElement("input");
        range.id = datiOrientato.id;
        range.type = "range";
        range.min = 1;
        range.max = 3;
        range.classList.add("tgl-def", "custom-toggle");
        if (datiOrientato.presente) {
            range.classList.add("tgl-on");
            range.classList.remove("tgl-def", "tgl-off");
            range.value = 3;
        } else if (datiOrientato.assente) {
            range.classList.add("tgl-off");
            range.classList.remove("tgl-def", "tgl-on");
            range.value = 1;
        } else {
            range.classList.add("tgl-def");
            range.classList.remove("tgl-off", "tgl-on");
            range.value = 2;
        }

        range.addEventListener("mousedown", function () {
            clearInterval(reloadPagina);
        });
        range.addEventListener("mouseup", changePresenzaLocal);
        range.addEventListener("input", function (e) {
            let range = e.target;
            if (e.target.value == 1) {
                range.classList.add("tgl-off");
                range.classList.remove("tgl-def", "tgl-on");
            } else if (e.target.value == 2) {
                range.classList.add("tgl-def");
                range.classList.remove("tgl-off", "tgl-on");
            } else {
                range.classList.add("tgl-on");
                range.classList.remove("tgl-def", "tgl-off");
            }
        });
        td.appendChild(range);
        tr.appendChild(td);

        td = document.createElement("td");
        let button = document.createElement("button");
        button.classList.add("btnModifica");
        button.textContent = "Modifica";
        button.id = "modifca-" + datiOrientato.id;
        // if (datiOrientato.gruppo_orario_partenza === "") {
        //     button.style.backgroundColor = "gray";
        //     button.disabled = true;
        // }

        button.addEventListener("click", function () {
            const modal = document.getElementById("modal");
            const comboBox = document.getElementById("comboBox");
            const closeModalButton = document.getElementById("closeModalButton");
            const applyButton = document.getElementById("applyButton");

            //Chiamata per sapere i gruppi passare il gruppo gia selezionato

            getGruppi()
                .then((gruppi) => {
                    comboBox.innerHTML = "";
                    gruppi.forEach((gruppo) => {
                        if (!gruppo.percorsoFinito) {
                            let option = document.createElement("option");
                            option.value = gruppo.id;
                            option.textContent = gruppo.nome;
                            comboBox.appendChild(option);
                        }
                    });
                })
                .catch((err) => {
                    console.error(err);
                    mostraAlert("errore", err);
                })
                .finally(() => {
                    comboBox.value = datiOrientato.gruppo_id;
                });

            modal.style.display = "block";

            closeModalButton.addEventListener("click", function () {
                modal.style.display = "none";
            });

            window.addEventListener("click", function (event) {
                if (event.target === modal) {
                    modal.style.display = "none";
                }
            });

            applyButton.addEventListener("click", function () {
                const selectedOption = document.getElementById("comboBox").value;
                const orientatoId = datiOrientato.id;

                vallauriRequest(`${serverUrl}admin/dashboard/orientati/gruppo/${orientatoId}?gruppo_id=${selectedOption}`, "PUT", {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                })
                    .then(() => {
                        modal.style.display = "none";
                        updatePage();
                    })
                    .catch((err) => {
                        console.error(err);
                        mostraAlert("errore", err);
                    });

                modal.style.display = "none";
            });
        });

        td.appendChild(button);

        tr.appendChild(td);

        tr.appendChild(td);
        tableOrientati.appendChild(tr);
    });
}

function changePresenzaLocal(e) {
    let presente, assente;

    let range = e.target;
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

    changePresenza(e.target.id, presente, assente).catch((err) => {
        e.removeEventListener("change", changePresenzaLocal);
        e.checked = !e.checked;
        mostraAlert("errore", err, 3);
        e.addEventListener("change", changePresenzaLocal);
    });

    reloadPagina = setInterval(updatePage, pollingTime);
}

function creaAula(aula) {
    if (aula != null) {
        // Crea il div principale con classe "content"
        const contentDiv = document.createElement("div");
        contentDiv.className = "templateAula";
        contentDiv.id = aula.id;

        // Crea la sezione "top"
        const topDiv = document.createElement("div");
        topDiv.className = "top";

        const groupDiv = document.createElement("div");
        const groupTitle = document.createElement("h1");
        groupTitle.id = aula.id + "-nome";
        groupTitle.innerHTML = aula.nome + "<span style='font-size: 18px; margin-left: 14px'>" + aula.posizione + "</span>";
        /*
            const groupMembers = document.createElement("p");
            groupMembers.id = aula.id + "-dettagli";
            groupMembers.textContent = aula.dettagli;
        */
        groupDiv.appendChild(groupTitle);
        //groupDiv.appendChild(groupMembers);

        const onTimeSpan = document.createElement("span");
        onTimeSpan.id = aula.id + "-occupato";
        if (aula.occupata) {
            onTimeSpan.className = "late";
            onTimeSpan.textContent = "OCCUPATO";
        } else {
            onTimeSpan.className = "on-time";
            onTimeSpan.textContent = "LIBERO";
        }

        topDiv.appendChild(groupDiv);
        topDiv.appendChild(onTimeSpan);

        // Crea la sezione
        const centralDiv = document.createElement("div");
        const subjectTitle = document.createElement("h1");

        subjectTitle.id = aula.id + "-materia";
        subjectTitle.textContent = aula.materia;
        centralDiv.appendChild(subjectTitle);

        if (aula.occupata) {
            const infoPresenze = document.createElement("p");

            let oraUscita = new Date();
            oraUscita.setHours(aula.gruppo_orario_partenza.split(":")[0]);
            oraUscita.setMinutes(aula.gruppo_orario_partenza.split(":")[1]);
            oraUscita.setMinutes(oraUscita.getMinutes() + aula.minuti_partenza);
            infoPresenze.textContent = "Occupata da Gruppo " + aula.gruppo_nome + " fino alle  " + oraUscita.getHours() + ":" + oraUscita.getMinutes();
            centralDiv.appendChild(infoPresenze);
        }


        // Aggiungi tutto al contenitore principale
        contentDiv.appendChild(topDiv);
        contentDiv.appendChild(centralDiv);

        // Aggiungi il contenitore principale al body o a un altro elemento della pagina
        auleWrapper.appendChild(contentDiv);
    }
}

function loadAule(aule) {
    auleWrapper.innerHTML = "";
    aule.forEach((aula) => {
        creaAula(aula);
    });
}

function searchTable(tableId, searchValue) {
    let table, tr, td, i, txtValue;
    table = document.getElementById(tableId);
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(searchValue.toUpperCase()) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function modaleOrientati() {

    const btnAggiungiOrientato = document.getElementById("btnAggiungiOrientato");
    const modal = document.getElementById("modaleAggiungiOrientato");
    const comboBox = document.getElementById("gruppoOrientato");
    const closeModalButton = document.getElementById("closeModalButtonOrientato");
    const applyButton = document.getElementById("applicaOrientato");

    closeModalButton.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    btnAggiungiOrientato.addEventListener("click", function () {

        getGruppi()
            .then((gruppi) => {
                comboBox.innerHTML = "";
                gruppi.forEach((gruppo) => {
                    if (!gruppo.percorsoFinito) {
                        let option = document.createElement("option");
                        option.value = gruppo.id;
                        option.textContent = gruppo.nome;
                        comboBox.appendChild(option);
                    }
                });
            })
            .catch((err) => {
                console.error(err);
                mostraAlert("errore", err);
            });

        modal.style.display = "block";

    });

    applyButton.addEventListener("click", function () {
        console.log("applica");
        const selectedOption = document.getElementById("gruppoOrientato").value;
        vallauriRequest(`${serverUrl}admin/dashboard/orientati/`, "POST", {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }, {
            nome: document.getElementById("nomeOrientato").value,
            cognome: document.getElementById("cognomeOrientato").value,
            gruppo_id: selectedOption,
            scuolaDiProvenienza_id: 1 //TODO: implementare la select della scuola
        })
            .then(() => {
                modal.style.display = "none";
                document.getElementById("nomeOrientato").value = "";
                document.getElementById("cognomeOrientato").value = "";
                updatePage();
            })
            .catch((err) => {
                console.error(err);
                mostraAlert("errore", err);
            });


        modal.style.display = "none";
    });

}

function modaleFile() {
    const btnAggiungiFile = document.getElementById("FilesNavbar");
    const modal = document.getElementById("modaleUploadCSV");
    const input = document.getElementById("csvFileInput");
    const applyButton = document.getElementById("uploadCSVButton");
    const closeModalButton = document.getElementById("closeModalButtonUploadCSV");

    closeModalButton.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    btnAggiungiFile.addEventListener("click", function () {
        modal.style.display = "block";
    });

    applyButton.addEventListener("click", function () {
        const file = input.files[0];
        const formData = new FormData();
        formData.append("file", file);

        vallauriRequest(`${serverUrl}admin/orientati/upload`, "POST", {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }, formData)
            .then(() => {
                modal.style.display = "none";
                updatePage();
            })
            .catch((err) => {
                console.error(err);
                mostraAlert("errore", err);
            });
    });
}