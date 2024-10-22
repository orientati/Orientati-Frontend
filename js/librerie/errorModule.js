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
  if (htmlpage === "" || htmlpage === "index.html") path = "html/";
  path += "error.html";

  sessionStorage.setItem("errorMsg", JSON.stringify(jsonMsg));
  window.location.href = path;
}
