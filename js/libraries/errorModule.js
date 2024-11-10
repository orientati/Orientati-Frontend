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

  sessionStorage.setItem("errorMsg", JSON.stringify(jsonMsg));
  window.location.href = "pages/error.html";
}

/**
 * Mostra un alert in alto a dx con il messaggio e la formattazione selezionata
 * @param {string} tipo
 * @param {string} msg
 * @param {int} tempo
 */
function mostraAlert(
  tipo = "errore",
  msg = "Errore nel server...",
  tempo = 5000
) {
  if (tempo < 10) tempo *= 1000;

  let alertWrapper = document.getElementById("alert-wrapper");
  if (!alertWrapper) {
    const body = document.querySelector("body");
    alertWrapper = document.createElement("div");
    alertWrapper.id = "alert-wrapper";
    body.appendChild(alertWrapper);
  }

  const alertDiv = document.createElement("div");

  switch (tipo) {
    case "errore":
      alertDiv.classList.add("alert-danger");
      break;
    case "successo":
      alertDiv.classList.add("alert-success");
      break;
    default:
      alertDiv.classList.add("alert-info");
      break;
  }
  alertDiv.innerText = msg;
  alertDiv.classList.add("alert-enter");

  alertWrapper.appendChild(alertDiv);

  setTimeout(() => {
    rimuoviAlert(alertWrapper, alertDiv);
  }, tempo);
}

/**
 * Courotine per la cancellazione dell'alert in modo automatico
 * @param {Node} e L'elemento padre
 * @param {Node} alert L'alert
 */
function rimuoviAlert(e, alert) {
  alert.classList.add("alert-exit");
  alert.addEventListener("animationend", () => {
    e.removeChild(alert);
  });
}
