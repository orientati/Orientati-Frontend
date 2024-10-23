"use strict";

/**
 * Mostra la pagina error.html con il messaggio dato e il suo codice d'errore.
 * @param {string} messaggioErrore
 * @param {int} codiceErrore
 */
function MostraPaginaErrore(
  messaggioErrore = "Pagina inesistente",
  codiceErrore = 404
) {
  const jsonMsg = {
    msg: messaggioErrore,
    code: codiceErrore,
  };

  // PER ADESSO va bene cosi, se mai cambiassimo la posizone relativa delle pagine html e o dell'index è da modificare questa logica qui
  let path = "./";
  const htmlpage =
    window.location.href.split("/")[window.location.href.split("/").length - 1];
  if (htmlpage === "" || htmlpage === "index.html") path = "pages/";
  path += "error.html";

  sessionStorage.setItem("errorMsg", JSON.stringify(jsonMsg));
  window.location.href = path;
}

/**
 * Mostra un alert in alto a dx con il messaggio e la formattazione selezionata
 * @param {string} tipo 
 * @param {string} msg 
 * @param {int} tempo 
 */
function mostraAlert(tipo = "errore", msg = "Errore nel server...", tempo = 5000){
  if(tempo < 10)
    tempo *= 1000;
  
  let alertWrapper = document.getElementById('alert-wrapper');
  if(!alertWrapper){
    const body = document.querySelector('body');
    alertWrapper = document.createElement('div');
    alertWrapper.id = "alert-wrapper";
    body.appendChild(alertWrapper);
  }

  const alertDiv = document.createElement("div");
  
  switch(tipo){
    case 'errore':
      alertDiv.classList.add('alert-danger');
      break;
    case 'successo':
      alertDiv.classList.add('alert-success');
      break;
    default:
      alertDiv.classList.add('alert-info');
      break;
  }
  alertDiv.innerText = msg;
  alertDiv.classList.add('alert-enter');

  alertWrapper.appendChild(alertDiv);

  setTimeout(()=>{rimuoviAlert(alertWrapper, alertDiv)}, tempo);
}

/**
 * Courotine per la cancellazione dell'alert in modo automatico
 * @param {Node} e L'elemento padre
 * @param {Node} alert L'alert
 */
function rimuoviAlert(e, alert){
  alert.classList.add('alert-exit');
  alert.addEventListener('animationend', ()=>{
    e.removeChild(alert);
  })
}