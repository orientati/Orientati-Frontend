"use strict";
(function () {
  const pageName = "pageOrientati";

  document.addEventListener("showContextPage", (e) => {
    const pageId = e.detail.navbarId;

    if (pageName == pageId) {
      console.log("ok");
    }
  });
})();
