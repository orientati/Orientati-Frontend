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
  const table = document.getElementById("tableStudenti");
  svuotaTabella(table);

  data.forEach((student) => {
    const row = document.createElement("tr");
    row.classList.add("student-row");

    const adminClass = student.isAdmin ? "yes" : "no";
    const temporaryClass = student.isTemporary ? "yes" : "no";
    const groupClass = student.inGroup ? "yes" : "no";

    row.innerHTML = `
      <td class="chk-cell">
          <label class="custom-checkbox">
          <input type="checkbox" class="student-checkbox" value="${student.id}">
          <span class="checkmark"></span>
      </label></td>
      <td class="id-cell">${student.id}</td>
      <td>${student.username}</td>
      <td class="admin-cell ${adminClass}">${student.isAdmin ? "Si" : "No"}</td>
      <td class="temporary-cell ${temporaryClass}">${
      student.isTemporary ? "Si" : "No"
    }</td>
      <td class="group-cell ${groupClass}">${student.inGroup ? "Si" : "No"}</td>
    `;

    row.addEventListener("click", function (event) {
      const checkbox = row.querySelector(".student-checkbox");
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
    const allCheckboxes = document.querySelectorAll(".student-checkbox");
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
    ".student-checkbox:checked"
  );
  return Array.from(selectedCheckboxes).map((checkbox) => checkbox.value);
}

function svuotaTabella(tableElement) {
  Array.from(tableElement.children).forEach((child) => {
    if (child.classList.contains('student-row')) tableElement.removeChild(child);
  });
}
