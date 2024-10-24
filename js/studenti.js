"use strict";

window.addEventListener("DOMContentLoaded", function () {
  getStudenti()
    .then((data) => {
      createTable(data);
    })
    .catch((err) => {
      mostraAlert("errore", err);
    });
});

function createTable(data) {
  const table = document.getElementById("tableStudenti");

  data.forEach((student, index) => {
    const row = document.createElement("tr");

    const adminClass = student.isAdmin ? "yes" : "no";
    const temporaryClass = student.isTemporary ? "yes" : "no";
    const groupClass = student.inGroup ? "yes" : "no";

    row.innerHTML = `
    <td>${student.id}</td>
    <td>${student.username}</td>
    <td class="${adminClass}">${student.isAdmin ? "Si" : "No"}</td>
    <td class="${temporaryClass}">${student.isTemporary ? "Si" : "No"}</td>
    <td class="${groupClass}">${student.inGroup ? "Si" : "No"}</td>
    <td class="action-buttons">
      <button class="edit-button" onclick="editStudent(${student.id})">
        <span class="material-symbols-outlined">edit</span>
      </button>
      <button class="delete-button" onclick="deleteStudent(${student.id})">
        <span class="material-symbols-outlined">delete</span>
      </button>
    </td>
  `;

    table.appendChild(row);
  });
}

function editStudent(id) {
  console.log("Edit Student ID:", id);
}

function deleteStudent(id) {
  console.log("Delete Student ID:", id);
}
