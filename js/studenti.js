window.addEventListener("DOMContentLoaded", function () {
  getStudenti()
    .then((data) => {
      createTable(data);
    })
    .catch((err) => {
      alert("Errore: " + err);
    });

  document
    .getElementById("editSelected")
    .addEventListener("click", function () {
      const selectedIds = getSelectedStudentIds();
      if (selectedIds.length === 1) {
        console.log("Editing Student with ID:", selectedIds[0]);
      } else {
        alert("Puoi selezionare solo uno studente per la modifica.");
      }
    });

  document
    .getElementById("deleteSelected")
    .addEventListener("click", function () {
      const selectedIds = getSelectedStudentIds();
      if (selectedIds.length === 1) {
        console.log("Deleting Student with ID:", selectedIds[0]);
      } else {
        alert("Puoi selezionare solo uno studente per l'eliminazione.");
      }
    });
});

function createTable(data) {
  const table = document.getElementById("tableStudenti");

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

      handleRowSelection(row, checkbox);
      handleSingleSelection(checkbox);
    });

    table.appendChild(row);
  });
}

function handleRowSelection(row, checkbox) {
  if (checkbox.checked) {
    row.classList.add("selected-row");
  } else {
    row.classList.remove("selected-row");
  }
}

function handleSingleSelection(checkbox) {
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

function getSelectedStudentIds() {
  const selectedCheckboxes = document.querySelectorAll(
    ".student-checkbox:checked"
  );
  return Array.from(selectedCheckboxes).map((checkbox) => checkbox.value);
}
