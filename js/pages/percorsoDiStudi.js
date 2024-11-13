"use strict";
window.addEventListener("DOMContentLoaded", function () {
    aggiornaTabellaPercorsi();

    document
        .getElementById("editSelectedPercorso")
        .addEventListener("click", function () {
            const selectedIds = prendiIdSelezionati();
            if (selectedIds.length === 1) {
                getPercorsoDiStudioById(parseInt(selectedIds[0])).then((res) => {
                    console.log(res);
                    openModal(res, function (formData) {
                        patchPercorsoDiStudio(formData.id, formData.nome).then((res) => {
                            mostraAlert("successo", res, 3);
                            aggiornaTabellaPercorsi();
                        }).catch((err) => {
                            mostraAlert("errore", err);
                        });
                    });
                }).catch((err) => {
                    mostraAlert("errore", err);
                });
                //openModal()
            } else {
                mostraAlert("info", "Seleziona un percorso di studio prima");
            }
        });

    document
        .getElementById("deleteSelectedPercorso")
        .addEventListener("click", function () {
            const selectedIds = prendiIdSelezionati();
            if (selectedIds.length === 1) {
                delPercorsoDiStudio(parseInt(selectedIds[0]))
                    .then((res) => {
                        mostraAlert("successo", res, 3);
                        aggiornaTabellaPercorsi();
                    })
                    .catch((err) => {
                        mostraAlert("errore", err);
                    });
            } else {
                mostraAlert("info", "Seleziona un percorso di studio prima");
            }
        });
});

function aggiornaTabellaPercorsi() {
    getPercorsiDiStudio()
        .then((data) => {
            aggiungiRigaPercorso(data);
        })
        .catch((err) => {
            mostraAlert("errore", err);
        });
}

function aggiungiRigaPercorso(data) {
    const table = document.getElementById("tablePercorsi");
    svuotaTabella(table);

    data.forEach((percorso) => {
        const row = document.createElement("tr");
        row.classList.add("percorso-row");

        row.innerHTML = `
            <td class="chk-cell">
                <label class="custom-checkbox">
                    <input type="checkbox" class="utente-checkbox" value="${percorso.id}">
                    <span class="checkmark"></span>
                </label>
            </td>
            <td class="id-cell">${percorso.id}</td>
            <td>${percorso.nome}</td>
        `;

        row.addEventListener("click", function (event) {
            const checkbox = row.querySelector(".utente-checkbox");
            if (event.target.tagName !== "INPUT") {
                checkbox.checked = !checkbox.checked;
            }
            logicaSelezioneRiga(row, checkbox);
            logicaSelezioneSingola(checkbox);
        });

        table.appendChild(row);
    });
}

function logicaSelezioneRiga(row, checkbox) {
    if (checkbox.checked) {
        row.classList.add("selected-row");
    } else {
        row.classList.remove("selected-row");
    }
}

function logicaSelezioneSingola(checkbox) {
    if (checkbox.checked) {
        const allCheckboxes = document.querySelectorAll(".utente-checkbox");
        allCheckboxes.forEach((cb) => {
            if (cb !== checkbox) {
                cb.checked = false;
                const row = cb.closest("tr");
                row.classList.remove("selected-row");
            }
        });
    }
}

function prendiIdSelezionati() {
    const selectedCheckboxes = document.querySelectorAll(".utente-checkbox:checked");
    return Array.from(selectedCheckboxes).map((checkbox) => checkbox.value);
}

function svuotaTabella(tableElement) {
    Array.from(tableElement.children).forEach((child) => {
        if (child.classList.contains('percorso-row')) tableElement.removeChild(child);
    });
}
