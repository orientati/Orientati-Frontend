"use strict";
(function () {
  const pageName = "pageOrientati";
  let active = true;
  let table;

  window.addEventListener("DOMContentLoaded", () => {
    table = document.getElementById("tableOrientati");

    if (active) init();
  });

  document.addEventListener("showContextPage", (e) => {
    const pageId = e.detail.navbarId;
    if (pageId == pageName) init();
  });

  function init() {
    clearTable(table);
  }
})();
