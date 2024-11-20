"use strict"
let gruppo;
let data;
let oraInizio;

function setHead(){
    getGruppo().then((result) => {
        gruppo = result.gruppi[0];
        console.log(result);
        const dataString = result.gruppi[0].data;
        const [giorno, mese, anno] = dataString.split("/").map(Number); // Divide e converte in numeri
        data = new Date(anno, mese - 1, giorno); // Mese è zero-based

        const oraAttuale = new Date();
        data.setHours(oraAttuale.getHours());
        data.setMinutes(oraAttuale.getMinutes());
        console.log(data);

        oraInizio = new Date(data);
        oraInizio.setHours(gruppo.orario_partenza.split(":")[0]);
        oraInizio.setMinutes(gruppo.orario_partenza.split(":")[1]);
        
        console.log(oraInizio);


        document.getElementById("data").innerText = (data.toLocaleDateString("it-IT", {weekday:"long" ,day: "numeric", month: "numeric"})+" - "+data.toLocaleTimeString("it-IT", {hour: "2-digit", minute: "2-digit"})).toUpperCase();
        document.getElementById("nome-gruppo").innerText = result.gruppi[0].nome.toUpperCase();
    }).catch((err) => {
        console.error(err);
    });
}

function setAula(){
    getTappe(gruppo.id).then((result) => {
        console.log(result);

        let inizio = aggiungiMinuti(oraInizio, result.tappe[gruppo.numero_tappa].minuti_arrivo).toLocaleTimeString("it-IT", {hour: "2-digit", minute: "2-digit"});
        let fine = aggiungiMinuti(oraInizio, result.tappe[gruppo.numero_tappa].minuti_partenza).toLocaleTimeString("it-IT", {hour: "2-digit", minute: "2-digit"});
        console.log(inizio + " - " + fine);
        document.getElementById("orari-teorico-attuale").innerText = inizio + " - " + fine;
    }).catch((err) => {
        console.error(err);
    });
}

function setProssimo(){
    getTappe(gruppo.id).then((result) => {
        console.log(result);

        if(gruppo.numero_tappa+1){
            let inizio = aggiungiMinuti(oraInizio, result.tappe[gruppo.numero_tappa+1].minuti_arrivo).toLocaleTimeString("it-IT", {hour: "2-digit", minute: "2-digit"});
            let fine = aggiungiMinuti(oraInizio, result.tappe[gruppo.numero_tappa+1].minuti_partenza).toLocaleTimeString("it-IT", {hour: "2-digit", minute: "2-digit"});
            console.log(inizio + " - " + fine);
            document.getElementById("orari-teorico-futuro").innerText = inizio + " - " + fine;
        }
    }).catch((err) => {
        console.error(err);
    });
}

function aggiungiMinuti(data, minuti) {
    const nuovaData = new Date(data); // Crea una nuova istanza per evitare di modificare l'originale
    nuovaData.setMinutes(nuovaData.getMinutes() + minuti);
    return nuovaData;
}