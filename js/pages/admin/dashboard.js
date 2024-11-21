"use strict";

const pollingTime = 5000;

window.addEventListener("DOMContentLoaded", function () {
  getGruppi()
  .then(loadGraphic)
  .catch(err=>{
    mostraAlert("errore", err);
  });

});

function loadGraphic(groups){
  console.log(groups);

  this.setInterval(updateGroups, pollingTime);
}

function updateGroups(){
  console.log("Faccio Polling");
}