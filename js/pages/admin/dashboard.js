"use strict";

const pollingTime = 500;
let groupsWrapper, tableOrientati, auleWrapper;
let reloadPagina;

window.addEventListener("DOMContentLoaded", function () {
  groupsWrapper = this.document.getElementById("groupsWrapper");
  tableOrientati = this.document.getElementById("tableOrientati");
  auleWrapper = this.document.getElementById("auleContainer");
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

  getAule()
    .then(loadAule)
    .catch((err) => {
      console.error(err);
      mostraAlert("errore", err);
    });

  reloadPagina = setInterval(updatePage, pollingTime);
});

function loadGraphic(groups) {
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

  // Crea la sezione "top"
  const topDiv = document.createElement("div");
  topDiv.className = "top";

  const groupDiv = document.createElement("div");
  const groupTitle = document.createElement("h1");
  groupTitle.id = group.id + "-nome";
  groupTitle.innerHTML =
    group.nome +
    "<span style='font-size: 18px; margin-left: 14px'>" +
    group.orario_partenza +
    "</span>";

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

    let button = document.createElement("button");
    button.classList.add("btnModifica");
    button.textContent = "Modifica";
    button.addEventListener("click", function () {
        const modal = document.getElementById("modalGruppo");
        const inputOrario = document.getElementById("inputOrario");
        const closeModalButton = document.getElementById("closeModalButtonGruppo");
        const applyButton = document.getElementById("applyButtonGruppo");

        //Chiamata per sapere i gruppi passare il gruppo gia selezionato

        inputOrario.value = group.orario_partenza;
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
            const orario = document.getElementById("inputOrario").value;
            const gruppoId = group.id;

            vallauriRequest(`${serverUrl}admin/dashboard/gruppi/orario_partenza/${gruppoId}?orario_partenza=${orario}`, "PUT",
                {
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
    });

    const divWrapper = document.createElement("div");
    divWrapper.id="divWrapper";
    divWrapper.appendChild(onTimeSpan);
    divWrapper.appendChild(button)
    topDiv.appendChild(groupDiv);
    topDiv.appendChild(divWrapper);

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
  infoPresenze.textContent =
    "Partecipanti: " + group.orientati_presenti + "/" + group.totale_orientati;
  centralDiv.appendChild(infoPresenze);

  const orarioPartenzaFine = document.createElement("p");
  if (group.numero_tappa !== 0) {
    orarioPartenzaFine.textContent =
      "Partenza: " + group.orario_partenza_effettivo;
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
  if (
    d.getHours() > data.getHours() ||
    (d.getHours() === data.getHours() && d.getMinutes() > data.getMinutes())
  ) {
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

        vallauriRequest(
          `${serverUrl}admin/dashboard/orientati/gruppo/${orientatoId}?gruppo_id=${selectedOption}`,
          "PUT",
          {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          }
        )
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
    groupTitle.innerHTML =
      aula.nome +
      "<span style='font-size: 18px; margin-left: 14px'>" +
      aula.posizione +
      "</span>";
/*
    const groupMembers = document.createElement("p");
    groupMembers.id = aula.id + "-dettagli";
    groupMembers.textContent = aula.dettagli;
*/
    groupDiv.appendChild(groupTitle);
    //groupDiv.appendChild(groupMembers);

    const onTimeSpan = document.createElement("span");
    onTimeSpan.id = aula.id + "-occupato";
    if(aula.occupata){
        onTimeSpan.className = "late";
        onTimeSpan.textContent = "OCCUPATO";
    }else{
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

    if(aula.occupata){
        const infoPresenze = document.createElement("p");
    infoPresenze.textContent =
      "Occupata da Gruppo " +
      aula.gruppo_nome +
      " fino alle  " +
      aula.gruppo_orario_partenza;
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
