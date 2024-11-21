"use strict"

let gruppo;
let data;
let oraInizio;

let tempoRimanente;
let timerInterval = null;

document.addEventListener("DOMContentLoaded", function () {
    //aggiorna();
    setInterval(aggiorna, 5000);
});

function aggiorna(){
    setHead();
}

function avviaTimerInterval(){
    if(timerInterval === null){
        timerInterval = setInterval(aggiornaTimer, 1000);
    }
}

function stoppaTimerInterval(){
    if(timerInterval !== null){
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function aggiornaTimer(){
    tempoRimanente--;
    if(tempoRimanente = 0){
        clearInterval(timerInterval);
        
    }
    console.info(tempoRimanente);
    let minuti = Math.floor(tempoRimanente / 60);
    let secondi = tempoRimanente % 60;
    console.warn(minuti + " - " + secondi);
    //document.getElementById("tempo-rimanente").innerText = tempoRimanente + " minuti";
}

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
        setAula();
    }).catch((err) => {
        console.error(err);
    });
}

function setAula(){
    getTappe(gruppo.id).then((result) => {
        console.log(result);

        if(gruppo.numero_tappa != 0){
            let inizio = aggiungiMinuti(oraInizio, result.tappe[gruppo.numero_tappa-1].minuti_arrivo).toLocaleTimeString("it-IT", {hour: "2-digit", minute: "2-digit"});
            let fine = aggiungiMinuti(oraInizio, result.tappe[gruppo.numero_tappa-1].minuti_partenza).toLocaleTimeString("it-IT", {hour: "2-digit", minute: "2-digit"});
            console.log(inizio + " - " + fine);
            document.getElementById("orari-teorico-attuale").innerText = inizio + " - " + fine;
            document.getElementById("laboratorio-attuale").innerText = result.tappe[gruppo.numero_tappa-1].aula_materia.toUpperCase();
            document.getElementById("aula-attuale").innerText = result.tappe[gruppo.numero_tappa-1].aula_posizione.toUpperCase() + "  " + result.tappe[gruppo.numero_tappa-1].aula_nome.toUpperCase();
            if(gruppo.arrivato)
                document.getElementById("azione-in-corso").innerText = "sei in:";
            else
                document.getElementById("azione-in-corso").innerText = "in viaggio verso: ";
            if(timerInterval == null){
                if(gruppo.arrivato){
                    tempoRimanente = parseInt(result.tappe[gruppo.numero_tappa-1].minuti_partenza - result.tappe[gruppo.numero_tappa-1].minuti_arrivo)*60;
                    
                }else{
                    console.log("BBBBB");
                    if(gruppo.numero_tappa != result.tappe.length && gruppo.numero_tappa != 0){
                        tempoRimanente = parseInt(result.tappe[gruppo.numero_tappa].minuti_arrivo - result.tappe[gruppo.numero_tappa-1].minuti_partenza)*60;
                    }else if(gruppo.numero_tappa == 0){
                        tempoRimanente = parseInt(result.tappe[gruppo.numero_tappa].minuti_arrivo)*60;
                    }
                }console.log(tempoRimanente);
                avviaTimerInterval();
            }
        }else{
            document.getElementById("orari-teorico-attuale").innerText = "orario teorico partenza: "+ oraInizio.toLocaleTimeString("it-IT", {hour: "2-digit", minute: "2-digit"});
            document.getElementById("laboratorio-attuale").innerText = "DEVI ANCORA PARTIRE";
            document.getElementById("aula-attuale").innerText = "";
        }
        setProssimo(result);
    }).catch((err) => {
        console.error(err);
    });
}

function setProssimo(result){
    if(gruppo.numero_tappa != result.tappe.length){
        let inizio = aggiungiMinuti(oraInizio, result.tappe[gruppo.numero_tappa].minuti_arrivo).toLocaleTimeString("it-IT", {hour: "2-digit", minute: "2-digit"});
        let fine = aggiungiMinuti(oraInizio, result.tappe[gruppo.numero_tappa].minuti_partenza).toLocaleTimeString("it-IT", {hour: "2-digit", minute: "2-digit"});
        console.log(inizio + " - " + fine);
        document.getElementById("orari-teorico-futuro").innerText = inizio + " - " + fine;
        document.getElementById("laboratorio-futuro").innerText = result.tappe[gruppo.numero_tappa].aula_materia.toUpperCase();
        document.getElementById("aula-futura").innerText = result.tappe[gruppo.numero_tappa].aula_posizione.toUpperCase() + "  " + result.tappe[gruppo.numero_tappa].aula_nome.toUpperCase();
    }else{
        document.getElementById("orari-teorico-futuro").innerText = "arrivo previsto: "+ aggiungiMinuti(oraInizio, result.tappe[gruppo.numero_tappa-1].minuti_partenza).toLocaleTimeString("it-IT", {hour: "2-digit", minute: "2-digit"});
        document.getElementById("laboratorio-futuro").innerText = "FINE PERCORSO";
        document.getElementById("aula-futura").innerText = "";
    }
}

function aggiungiMinuti(data, minuti) {
    const nuovaData = new Date(data); // Crea una nuova istanza per evitare di modificare l'originale
    nuovaData.setMinutes(nuovaData.getMinutes() + minuti);
    return nuovaData;
}