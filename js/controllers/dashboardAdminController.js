"use strict";
let gruppi;
let orientati;

function getGruppi() {
  return new Promise((res, rej) => {
    const access_token = localStorage.getItem("access_token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    vallauriRequest(`${serverUrl}admin/dashboard/gruppi`, "GET", headers)
      .then((response) => {
        console.log(response);
        gruppi = response.gruppi;

        for (let i = 0; i < gruppi.length; i++) {
          const aulaDet = getAulaFromTappa(gruppi[i].numero_tappa);
          gruppi[i].aula = aulaDet;

          vallauriRequest(
            `${serverUrl}admin/gruppi/tappe/${gruppi[i].id}`,
            "GET",
            headers
          ).then((tappeGruppo) => {
            let proxTappa = findNextTappa(
              tappeGruppo.tappe,
              gruppi[i].numero_tappa
            );
            gruppi[i].prossima_tappa = proxTappa;
          });
        }

        res(gruppi);
      })
      .catch((err) => {
        console.error(err);
        rej("Errore nella ricezione dei gruppi");
      });
  });
}

function findNextTappa(tappe, tappaId) {
  let i;
  while( i < tappe.length){
    if (tappe[i].id == tappaId) break;
    i++;
  }

  if (i < tappe.length){
    const aulaDet = getAulaFromTappa(tappe[i].id);
    tappe[i].aula = aulaDet;
    return tappe[i];
  } 
  else return null;
}

function getAulaFromTappa(tappaId){
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };

  vallauriRequest(`${serverUrl}admin/tappe/${tappaId}`, "GET", headers)
  .then(tappa => {
    vallauriRequest(`${serverUrl}admin/aule/${tappa.aula_id}`)
    .then(aula => {
      return aula;
    }).catch(()=>{
      return null;
    })

  }).catch(()=>{
    return null;
  })
}

function getOrientati() {
  return new Promise((res, rej) => {
    const access_token = localStorage.getItem("access_token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    vallauriRequest(`${serverUrl}admin/dashboard/orientati`, "GET", headers)
      .then((response) => {
        orientati = response.orientati;
        res(orientati);
      })
      .catch((err) => {
        console.error(err);
        rej("Errore nella ricezione degli orientati");
      });
  });
}
