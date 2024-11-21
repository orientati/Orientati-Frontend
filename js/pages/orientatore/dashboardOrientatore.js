"use strict"

let gruppo;
let tappe;
let data;
let oraInizio;

let tempoRimanente;
let timerInterval = null;

document.addEventListener("DOMContentLoaded", function () {
    downloadData();
    setInterval(aggiorna, 10000);
});

function downloadData(){
    getGruppo().then((result) => {
        gruppo = result.gruppi[0];
        console.log(result.gruppi[0]);
        getTappe(gruppo.id).then((result) => {
            tappe = result.tappe;
            aggiorna();
        }).catch((err) => {
            console.error(err);
        });
    }).catch((err) => {
        console.error(err);
    });
}

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
    let minuti = Math.floor(tempoRimanente / 60);
    let secondi = tempoRimanente % 60;
    if(tempoRimanente <= 0){
        if(secondi == 59)
            tempoRimanente--;
        document.getElementById("minuti").innerText = "+ " + ((minuti*-1)-1).toString().padStart(2, "0");
        document.getElementById("secondi").innerText = (secondi*-1).toString().padStart(2, "0");
        //clearInterval(timerInterval);
        
    }else{
        document.getElementById("minuti").innerText = minuti;
        document.getElementById("secondi").innerText = secondi;
    }

    //document.getElementById("tempo-rimanente").innerText = tempoRimanente + " minuti";
}

function setHead(){
    console.log(gruppo);
    const dataString = gruppo.data;
    const [giorno, mese, anno] = dataString.split("/").map(Number); // Divide e converte in numeri
    data = new Date(anno, mese - 1, giorno); // Mese è zero-based

    const oraAttuale = new Date();
    data.setHours(oraAttuale.getHours());
    data.setMinutes(oraAttuale.getMinutes());

    oraInizio = new Date(data);
    oraInizio.setHours(gruppo.orario_partenza.split(":")[0]);
    oraInizio.setMinutes(gruppo.orario_partenza.split(":")[1]);
    
    console.log(oraInizio);

    document.getElementById("data").innerText = (data.toLocaleDateString("it-IT", {weekday:"long" ,day: "numeric", month: "numeric"})+" - "+data.toLocaleTimeString("it-IT", {hour: "2-digit", minute: "2-digit"})).toUpperCase();
    document.getElementById("nome-gruppo").innerText = gruppo.nome.toUpperCase();
    setAula();
}

function setAula(){
    console.log(tappe);
    if(gruppo.numero_tappa != 0 && gruppo.numero_tappa <= tappe.length){
        let inizio = aggiungiMinuti(oraInizio, tappe[gruppo.numero_tappa-1].minuti_arrivo).toLocaleTimeString("it-IT", {hour: "2-digit", minute: "2-digit"});
        let fine = aggiungiMinuti(oraInizio, tappe[gruppo.numero_tappa-1].minuti_partenza).toLocaleTimeString("it-IT", {hour: "2-digit", minute: "2-digit"});
        console.log(inizio + " - " + fine);
        document.getElementById("orari-teorico-attuale").innerText = inizio + " - " + fine;
        document.getElementById("laboratorio-attuale").innerText = tappe[gruppo.numero_tappa-1].aula_materia.toUpperCase();
        document.getElementById("aula-attuale").innerText = tappe[gruppo.numero_tappa-1].aula_posizione.toUpperCase() + "  " + tappe[gruppo.numero_tappa-1].aula_nome.toUpperCase();
        if(gruppo.arrivato)
            document.getElementById("azione-in-corso").innerText = "sei in:";
        else
            document.getElementById("azione-in-corso").innerText = "in viaggio verso: ";
        if(timerInterval == null){
            if(gruppo.arrivato){
                tempoRimanente = parseInt(tappe[gruppo.numero_tappa-1].minuti_partenza - tappe[gruppo.numero_tappa-1].minuti_arrivo)*60;
            }else{
                if(gruppo.numero_tappa != tappe.length && gruppo.numero_tappa != 0){
                    tempoRimanente = parseInt(tappe[gruppo.numero_tappa].minuti_arrivo - tappe[gruppo.numero_tappa-1].minuti_partenza)*60;
                    console.log(tempoRimanente);
                }else if(gruppo.numero_tappa == 0){
                    tempoRimanente = parseInt(tappe[gruppo.numero_tappa].minuti_arrivo)*60;
                }
            }
            avviaTimerInterval();
        }
    }else{
        if(gruppo.numero_tappa == 0){
            if(!gruppo.arrivato){
                document.getElementById("orari-teorico-attuale").innerText = "orario teorico partenza: "+ oraInizio.toLocaleTimeString("it-IT", {hour: "2-digit", minute: "2-digit"});
                document.getElementById("laboratorio-attuale").innerText = "DEVI ANCORA PARTIRE";
                document.getElementById("aula-attuale").innerText = "";
            }else{
                document.getElementById("orari-teorico-attuale").innerText = "arrivo previsto: "+ aggiungiMinuti(oraInizio, tappe[gruppo.numero_tappa-1].minuti_partenza).toLocaleTimeString("it-IT", {hour: "2-digit", minute: "2-digit"});
                document.getElementById("laboratorio-attuale").innerText = "FINE PERCORSO";
                document.getElementById("aula-attuale").innerText = "";
            }
        }
        setProssimo();
    }
}

function setProssimo(){
    if(gruppo.numero_tappa != tappe.length){
        let inizio = aggiungiMinuti(oraInizio, tappe[gruppo.numero_tappa].minuti_arrivo).toLocaleTimeString("it-IT", {hour: "2-digit", minute: "2-digit"});
        let fine = aggiungiMinuti(oraInizio, tappe[gruppo.numero_tappa].minuti_partenza).toLocaleTimeString("it-IT", {hour: "2-digit", minute: "2-digit"});
        console.log(inizio + " - " + fine);
        document.getElementById("orari-teorico-futuro").innerText = inizio + " - " + fine;
        document.getElementById("laboratorio-futuro").innerText = tappe[gruppo.numero_tappa].aula_materia.toUpperCase();
        document.getElementById("aula-futura").innerText = tappe[gruppo.numero_tappa].aula_posizione.toUpperCase() + "  " + tappe[gruppo.numero_tappa].aula_nome.toUpperCase();
    }else{
        document.getElementById("orari-teorico-futuro").innerText = "arrivo previsto: "+ aggiungiMinuti(oraInizio, tappe[gruppo.numero_tappa-1].minuti_partenza).toLocaleTimeString("it-IT", {hour: "2-digit", minute: "2-digit"});
        document.getElementById("laboratorio-futuro").innerText = "FINE PERCORSO";
        document.getElementById("aula-futura").innerText = "";
    }
}

function statoSuccessivo(){

    if(!gruppo.arrivato){
        if(gruppo.numero_tappa == 0){
            gruppo.numero_tappa++;
        }else{
            gruppo.arrivato = true;
        }
    }else{
        console.log(gruppo.numero_tappa + " - " + tappe.length);
        if(gruppo.numero_tappa == tappe.length){
            gruppo.arrivato = true;
            gruppo.numero_tappa = 0;
        }else{
            gruppo.numero_tappa++;
            gruppo.arrivato = false;
        }
    }
    putGruppo(gruppo).then((result) => {
        console.log(result);
        stoppaTimerInterval();
        setHead();
    }).catch((err) => {
        console.error(err);
    });


}

function statoPrecedente(){


}

function aggiungiMinuti(data, minuti) {
    const nuovaData = new Date(data); // Crea una nuova istanza per evitare di modificare l'originale
    nuovaData.setMinutes(nuovaData.getMinutes() + minuti);
    return nuovaData;
}