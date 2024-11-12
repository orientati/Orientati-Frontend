"use strict";
window.addEventListener("DOMContentLoaded", function () {
    aggiornaTabellaIndirizzi();

    document
        .getElementById("editSelectedIndirizzo")
        .addEventListener("click", function () {
            const selectedIds = prendiIdSelezionati();
            if (selectedIds.length === 1) {
                // Logica per modificare l'indirizzo selezionato
            } else {
                mostraAlert("info", "Seleziona un indirizzo prima");
            }
        });

    document
        .getElementById("deleteSelectedIndirizzo")
        .addEventListener("click", function () {
            const selectedIds = prendiIdSelezionati();
            if (selectedIds.length === 1) {
                delIndirizzo(parseInt(selectedIds[0]))
                    .then((res) => {
                        mostraAlert("successo", res, 3);
                        aggiornaTabellaIndirizzi();
                    })
                    .catch((err) => {
                        mostraAlert("errore", err);
                    });
            } else {
                mostraAlert("info", "Seleziona un indirizzo prima");
            }
        });
});

function aggiornaTabellaIndirizzi() {
    getIndirizzi()
        .then((data) => {
            aggiungiRigaIndirizzo(data);
        })
        .catch((err) => {
            mostraAlert("errore", err);
        });
}

function aggiungiRigaIndirizzo(data) {
    const table = document.getElementById("tableIndirizzi");
    svuotaTabella(table);

    data.forEach((indirizzo) => {
        const row = document.createElement("tr");
        row.classList.add("indirizzo-row");

        row.innerHTML = `
            <td class="chk-cell">
                <label class="custom-checkbox">
                    <input type="checkbox" class="utente-checkbox" value="${indirizzo.id}">
                    <span class="checkmark"></span>
                </label>
            </td>
            <td class="id-cell">${indirizzo.id}</td>
            <td>${indirizzo.name}</td>
            <td>${indirizzo.percorsoDiStudio.nome}</td>
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
        if (child.classList.contains("indirizzo-row")) tableElement.removeChild(child);
    });
}
