"use strict";
window.addEventListener("DOMContentLoaded", function () {
    aggiornaTabellaAule();

    document
        .getElementById("editSelectedAula")
        .addEventListener("click", function () {
            const selectedIds = prendiIdSelezionati();
            if (selectedIds.length === 1) {
                getAulaById(parseInt(selectedIds[0])).then((resAula) => {
                    let values = {
                        id: resAula.id,
                        name: resAula.name,
                        position: resAula.position,
                        subject: resAula.subject,
                        details: resAula.details,
                    };
                    openModal(values, function (formData) {
                        patchAula(
                            formData.id,
                            formData.name,
                            formData.position,
                            formData.subject,
                            formData.details
                        )
                            .then((res) => {
                                mostraAlert("successo", res, 3);
                                aggiornaTabellaAule();
                            })
                            .catch((err) => {
                                mostraAlert("errore", err);
                                console.error(err);
                            });
                    });
                }).catch((err) => {
                    mostraAlert("errore", err);
                });
            } else {
                mostraAlert("info", "Seleziona un'aula prima");
            }
        });

    document
        .getElementById("deleteSelectedAula")
        .addEventListener("click", function () {
            const selectedIds = prendiIdSelezionati();
            if (selectedIds.length === 1) {
                delAula(parseInt(selectedIds[0]))
                    .then((res) => {
                        mostraAlert("successo", res, 3);
                        aggiornaTabellaAule();
                    })
                    .catch((err) => {
                        mostraAlert("errore", err);
                    });
            } else {
                mostraAlert("info", "Seleziona un'aula prima");
            }
        });
});

function aggiornaTabellaAule() {
    getAule()
        .then((data) => {
            aggiungiRigaAula(data);
        })
        .catch((err) => {
            mostraAlert("errore", err);
        });
}

function aggiungiRigaAula(data) {
    const table = document.getElementById("tableAule").querySelector("tbody");
    svuotaTabella(table);

    data.forEach((aula) => {
        const row = document.createElement("tr");
        row.classList.add("aula-row");

        row.innerHTML = `
            <td class="chk-cell">
                <label class="custom-checkbox">
                    <input type="checkbox" class="utente-checkbox" value="${aula.id}">
                    <span class="checkmark"></span>
                </label>
            </td>
            <td>${aula.name}</td>
            <td>${aula.position}</td>
            <td>${aula.subject}</td>
            <td>${aula.details}</td>
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

function prendiIdSelezionati() {
    const selectedCheckboxes = document.querySelectorAll(".utente-checkbox:checked");
    return Array.from(selectedCheckboxes).map((checkbox) => checkbox.value);
}

function svuotaTabella(tableElement) {
    tableElement.innerHTML = "";
}
