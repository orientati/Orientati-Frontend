"use strict";

class Studente {
    constructor(username, isAdmin, isTemporary, connectedToGroup, id){
        this.username = username;
        this.isAdmin = isAdmin;
        this.isTemporary = isTemporary;
        this.connectedToGroup = connectedToGroup;
        this.id = id;
    }
}

let studenti = [];

function getStudenti() {
    return new Promise((res, rej) => {
        studenti = [];
        const access_token = localStorage.getItem("access_token");
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };

        vallauriRequest('http://109.123.240.145:8001/api/v1/admin/users', "GET", headers)
        .then(response => {
            let data = response.json();

            if(data.users){
                data.users.forEach(studente => {
                    studenti.push(new Studente(
                        studente.username,
                        studente.admin,
                        studente.temporaneo,
                        studente.connessoAGruppo,
                        studente.id
                    ));
                    res(studenti);
                });
                res(studenti);
            }else{
                rej(semplificaErrore())
            }

        }).catch(err => {
            rej(err);
        })

        return studenti;
    });
}

function getStudenteById(id) {
    
}

function patchStudente() {}

function delStudente(id) {}

function semplificaErrore(errorCode){
    if(errorCode == 401 || errorCode == 403)
        return "Azione non consentita a questo utente";
    else
        return "Errore interno nel server";
}