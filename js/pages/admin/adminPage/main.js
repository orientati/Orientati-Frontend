"use strict";
let activeCtxNav = "contextFilesNavbar";
let activeCtxPage = "pageOrientati";
let navbarsOptions = {
    "contextFilesNavbar" : "Orientati"
}

// Listeners
window.addEventListener("DOMContentLoaded", init);

document.addEventListener("showContextNavbar", (e) => {
  const navbarId = e.detail.navbarId;

  if (navbarId != activeCtxNav) {
    // Prendi la pagina corrente e anche la navbar e nascondili
    const currPage = document.getElementById(activeCtxPage);
    const currNav = document.getElementById(activeCtxNav);

    if (activeCtxPage != undefined) currPage.classList.add("hide");
    currNav.classList.add("hide");

    // Prendi la nuova navbar e mostrala
    const newNav = document.getElementById(navbarId);
    newNav.classList.remove("hide");

    // Resetta gli item selezionati
    const selectedItem = document.getElementsByClassName(
      "contextNavbarItemSelected"
    )[0];
    if (selectedItem != undefined)
      selectedItem.classList.remove("contextNavbarItemSelected");

    activeCtxNav = navbarId;
    activeCtxPage = undefined;
    console.log("Cambiata Navbar: " + navbarId);

    if(navbarsOptions[navbarId] != undefined){
        document.getElementById(navbarsOptions[navbarId]).click();
    }

  } else console.log("Navbar rimasta invariata (" + navbarId + ")");
});

document.addEventListener("showContextPage", (e) => {
  const pageId = e.detail.pageId;
  const btnId = e.detail.btnId;

  if (pageId != activeCtxPage) {
    // Prendi la pagina corrente e anche la navbar e nascondili
    const currPage = document.getElementById(activeCtxPage);

    if (activeCtxPage != undefined) currPage.classList.add("hide");

    // Prendi la nuova navbar e mostrala
    const newPage = document.getElementById(pageId);
    newPage.classList.remove("hide");

    // Resetta gli item selezionati
    const selectedItem = document.getElementsByClassName(
      "contextNavbarItemSelected"
    )[0];
    if (selectedItem != undefined)
      selectedItem.classList.remove("contextNavbarItemSelected");

    document.getElementById(btnId).classList.add("contextNavbarItemSelected");

    activeCtxPage = pageId;
    console.log("Cambiata Pagina: " + pageId);
  } else console.log("Pagina rimasta invariata (" + pageId + ")");
});

// Funzioni
function init() {
  addEventsToNavbarSx();
  addEventsToContextNavbar();
}

function addEventsToNavbarSx() {
  const navbarItems = document.getElementsByClassName("navbarItem");
  for (let i = 0; i < navbarItems.length; i++) {
    navbarItems[i].addEventListener("click", () => {
      let contextNavbarId = "context" + navbarItems[i].id;
      document.dispatchEvent(
        new CustomEvent("showContextNavbar", {
          detail: { navbarId: contextNavbarId },
        })
      );
    });
  }
}

function addEventsToContextNavbar() {
  const ctxNavbarItems = document.getElementsByClassName("contextNavbarItem");
  for (let i = 0; i < ctxNavbarItems.length; i++) {
    ctxNavbarItems[i].addEventListener("click", () => {
      let contextPageId = "page" + ctxNavbarItems[i].id;
      document.dispatchEvent(
        new CustomEvent("showContextPage", {
          detail: {
            pageId: contextPageId,
            btnId: ctxNavbarItems[i].id,
          },
        })
      );
    });
  }
}
