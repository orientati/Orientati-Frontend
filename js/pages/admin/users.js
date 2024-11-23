"use strict";
window.addEventListener("DOMContentLoaded", function () {
    aggiornaTabella();

    // Eventi click
    document
        .getElementById("editSelected")
        .addEventListener("click", function () {
            const selectedIds = prendiIdSelezionati();
            if (selectedIds.length === 1) {
            } else {
                mostraAlert("info", "Seleziona un'utente prima");
            }
        });

    document
        .getElementById("deleteSelected")
        .addEventListener("click", function () {
            const selectedIds = prendiIdSelezionati();
            if (selectedIds.length === 1) {
                delUser(parseInt(selectedIds[0]))
                    .then((res) => {
                        mostraAlert("successo", res, 3);
                        aggiornaTabella();
                    })
                    .catch((err) => {
                        mostraAlert("errore", err);
                    });
            } else {
                mostraAlert("info", "Seleziona un'utente prima");
            }
        });
});

function aggiornaTabella() {
    getUsers()
        .then((data) => {
            aggiungiRigaUtente(data);
        })
        .catch((err) => {
            mostraAlert("errore", err);
        });
}

function aggiungiRigaUtente(data) {
    const table = document.getElementById("tableUtenti");
    svuotaTabella(table);

    data.forEach((utente) => {
        const row = document.createElement("tr");
        row.classList.add("utente-row");

        const adminClass = utente.isAdmin ? "yes" : "no";
        const temporaryClass = utente.temporaneo ? "yes" : "no";
        const orientatoreClass = utente.orientatoreId ? utente.orientatoreId : "no";

        row.innerHTML = `
      <td class="chk-cell">
          <label class="custom-checkbox">
          <input type="checkbox" class="utente-checkbox" value="${utente.id}">
          <span class="checkmark"></span>
      </label></td>
      <td class="id-cell">${utente.id}</td>
      <td>${utente.username}</td>
      <td class="admin-cell ${adminClass}">${utente.isAdmin ? "Si" : "No"}</td>
      <td class="temporary-cell ${temporaryClass}">${
            utente.temporaneo ? "Si" : "No"
        }</td>
      <td class="group-cell ${orientatoreClass}">${utente.inGroup ? "Si" : "No"}</td>
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
    const selectedCheckboxes = document.querySelectorAll(
        ".utente-checkbox:checked"
    );
    return Array.from(selectedCheckboxes).map((checkbox) => checkbox.value);
}

function svuotaTabella(tableElement) {
    Array.from(tableElement.children).forEach((child) => {
        if (child.classList.contains('utente-row')) tableElement.removeChild(child);
    });
}
