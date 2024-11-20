"use strict";

//const urlEndpoint = "http://localhost:8000/api/v1/";

const access_token = localStorage.getItem("access_token");
const headers = {
    Authorization: `Bearer ${access_token}`,
  };

function getGruppo(){
    return new Promise((res, rej) => {
        vallauriRequest(urlEndpoint + "orientatore/gruppo/", "GET", headers).then((result) => {
            res(result);
        }).catch((err) => {
            rej(err);
        });
    });
}

function getTappe(id){
    return new Promise((res, rej) => {
        vallauriRequest(urlEndpoint + "orientatore/gruppo/tappe/"+id, "GET", headers).then((result) => {
            res(result);
        }).catch((err) => {
            rej(err);
        });
    });
}
