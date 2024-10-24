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
    
    row.onclick = function() {
      console.log("Student ID:", student.id); 
    };
    
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${student.username}</td>
      <td>${student.isAdmin ? "Yes" : "No"}</td>
      <td>${student.isTemporary ? "Yes" : "No"}</td>
      <td>${student.inGroup ? "Yes" : "No"}</td>
    `;
    
    table.appendChild(row);
  });
}
