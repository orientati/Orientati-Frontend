"use strict"

let gruppo;
let tappe;
let data;
let oraInizio;

let tempoRimanenteOld;
let timerReload = null;
let timerInterval = null;

document.addEventListener("DOMContentLoaded", function () {
    downloadData(true);
    sessionStorage.setItem("tempoRimanente", 0);
});

function downloadData(negation = false) {
    getGruppo().then((result) => {
        gruppo = result.gruppi[0];
        console.log(result.gruppi[0]);
        getTappe(gruppo.id).then((result) => {
            tappe = result.tappe;
            aggiorna(negation);
        }).catch((err) => {
            console.error(err);
            if (err === 401)
                location.href = "pages/login.html";
            else if (err === 404)
                location.href = "collegaOrientatore.html";
            else
                MostraPaginaErrore("Errore nel server", err);
        });
    }).catch((err) => {
        console.error(err);
        if (err == 401)
            location.href = "pages/login.html";
        else if (err == 404)
            location.href = "pages/orientatore/collegaOrientatore.html";
        else
            MostraPaginaErrore("Errore nel server", err);
    });
    avviaTimerReload();
}

function aggiorna(negation = false) {
    setHead(negation);
}

function avviaTimerInterval() {
    if (timerInterval === null) {
        timerInterval = setInterval(aggiornaTimer, 1000);
    }
}

function stoppaTimerInterval() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function avviaTimerReload() {
    if (timerReload === null) {
        timerReload = setInterval(aggiorna, 10000);
    }
}

function stoppaTimerReload() {
    if (timerReload !== null) {
        clearInterval(timerReload);
        timerReload = null;
    }
}

function aggiornaTimer() {
    sessionStorage.setItem("tempoRimanente", sessionStorage.getItem("tempoRimanente") - 1);
    let minuti = Math.floor(sessionStorage.getItem("tempoRimanente") / 60);
    let secondi = sessionStorage.getItem("tempoRimanente") % 60;
    if (sessionStorage.getItem("tempoRimanente") < 0) {
        if (secondi == 59)
            sessionStorage.setItem("tempoRimanente", sessionStorage.getItem("tempoRimanente") - 1);
        document.getElementById("minuti").innerText = "+ " + ((minuti * -1) - 1).toString().padStart(2, "0");
        document.getElementById("secondi").innerText = (secondi * -1).toString().padStart(2, "0");
        document.getElementById("minuti").classList.remove("timer-h1");
        document.getElementById("minuti").classList.add("timer-h1-red");
        document.getElementById("secondi").classList.remove("timer-h1");
        document.getElementById("secondi").classList.add("timer-h1-red");
        //clearInterval(timerInterval);

    } else {
        document.getElementById("minuti").innerText = minuti.toString().padStart(2, "0");
        document.getElementById("secondi").innerText = secondi.toString().padStart(2, "0");
        document.getElementById("minuti").classList.remove("timer-h1-red");
        document.getElementById("minuti").classList.add("timer-h1");
        document.getElementById("secondi").classList.remove("timer-h1-red");
        document.getElementById("secondi").classList.add("timer-h1");
    }

    //document.getElementById("tempo-rimanente").innerText = tempoRimanente + " minuti";
}

function setHead() {
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

    document.getElementById("data").innerText = (data.toLocaleDateString("it-IT", {
        weekday: "long",
        day: "numeric",
        month: "numeric"
    }) + " - " + data.toLocaleTimeString("it-IT", {hour: "2-digit", minute: "2-digit"})).toUpperCase();
    document.getElementById("nome-gruppo").innerText = gruppo.nome.toUpperCase();
    setAula();
}

function setAula(negation = false) {
    console.log(tappe);
    if (gruppo.numero_tappa != 0 && gruppo.numero_tappa <= tappe.length) {
        let inizio = aggiungiMinuti(oraInizio, tappe[gruppo.numero_tappa - 1].minuti_arrivo).toLocaleTimeString("it-IT", {
            hour: "2-digit",
            minute: "2-digit"
        });
        let fine = aggiungiMinuti(oraInizio, tappe[gruppo.numero_tappa - 1].minuti_partenza).toLocaleTimeString("it-IT", {
            hour: "2-digit",
            minute: "2-digit"
        });
        console.log(inizio + " - " + fine);
        document.getElementById("orari-teorico-attuale").innerText = inizio + " - " + fine;
        document.getElementById("laboratorio-attuale").innerText = tappe[gruppo.numero_tappa - 1].aula_materia.toUpperCase();
        document.getElementById("aula-attuale").innerText = tappe[gruppo.numero_tappa - 1].aula_posizione.toUpperCase() + "  " + tappe[gruppo.numero_tappa - 1].aula_nome.toUpperCase();
        if (gruppo.arrivato)
            document.getElementById("azione-in-corso").innerText = "sei in:";
        else
            document.getElementById("azione-in-corso").innerText = "in viaggio verso: ";
        if (timerInterval == null) {
            tempoRimanenteOld = parseInt(sessionStorage.getItem("tempoRimanente"));
            if (gruppo.arrivato) {
                document.getElementById("btn-avanti").innerText = "mettiti in viaggio";
                sessionStorage.setItem("tempoRimanente", (parseInt(tappe[gruppo.numero_tappa - 1].minuti_partenza - tappe[gruppo.numero_tappa - 1].minuti_arrivo) * 60));
                if (!negation)
                    sessionStorage.setItem("tempoRimanente", parseInt(sessionStorage.getItem("tempoRimanente")) + tempoRimanenteOld);
                if (gruppo.numero_tappa == tappe.length) {
                    document.getElementById("btn-avanti").innerText = "fine percorso";
                }
            } else {
                if (gruppo.numero_tappa != tappe.length + 1 && gruppo.numero_tappa != 1) {
                    sessionStorage.setItem("tempoRimanente", (parseInt(tappe[gruppo.numero_tappa - 1].minuti_arrivo - tappe[gruppo.numero_tappa - 2].minuti_partenza) * 60));
                    if (!negation)
                        sessionStorage.setItem("tempoRimanente", parseInt(sessionStorage.getItem("tempoRimanente")) + tempoRimanenteOld);
                } else if (gruppo.numero_tappa == 1) {
                    sessionStorage.setItem("tempoRimanente", (parseInt(tappe[gruppo.numero_tappa - 1].minuti_arrivo) * 60));
                    if (!negation)
                        sessionStorage.setItem("tempoRimanente", parseInt(sessionStorage.getItem("tempoRimanente")) + tempoRimanenteOld);
                }
                document.getElementById("btn-avanti").innerText = "arrivato alla tappa";
            }
            avviaTimerInterval();
        }
    } else {
        if (gruppo.numero_tappa == 0) {
            if (!gruppo.arrivato) {
                document.getElementById("orari-teorico-attuale").innerText = "orario teorico partenza: " + oraInizio.toLocaleTimeString("it-IT", {
                    hour: "2-digit",
                    minute: "2-digit"
                });
                document.getElementById("laboratorio-attuale").innerText = "DEVI ANCORA PARTIRE";
                localStorage.setItem("tempoRimanente", 0);
                document.getElementById("aula-attuale").innerText = "";
                document.getElementById("btn-indietro").enabled = false;
            } else {
                //document.getElementById("orari-teorico-attuale").innerText = "arrivo previsto: "+ aggiungiMinuti(oraInizio, tappe[gruppo.numero_tappa-1].minuti_partenza).toLocaleTimeString("it-IT", {hour: "2-digit", minute: "2-digit"});
                //document.getElementById("aula-attuale").innerText = "";
            }
        }
    }
    setProssimo();
}

function setProssimo() {
    if (gruppo.numero_tappa != tappe.length) {
        let inizio = aggiungiMinuti(oraInizio, tappe[gruppo.numero_tappa].minuti_arrivo).toLocaleTimeString("it-IT", {
            hour: "2-digit",
            minute: "2-digit"
        });
        let fine = aggiungiMinuti(oraInizio, tappe[gruppo.numero_tappa].minuti_partenza).toLocaleTimeString("it-IT", {
            hour: "2-digit",
            minute: "2-digit"
        });
        console.log(inizio + " - " + fine);
        document.getElementById("orari-teorico-futuro").innerText = inizio + " - " + fine;
        document.getElementById("laboratorio-futuro").innerText = tappe[gruppo.numero_tappa].aula_materia.toUpperCase();
        document.getElementById("aula-futura").innerText = tappe[gruppo.numero_tappa].aula_posizione.toUpperCase() + "  " + tappe[gruppo.numero_tappa].aula_nome.toUpperCase();
    } else {
        document.getElementById("orari-teorico-futuro").innerText = "arrivo teorico: " + aggiungiMinuti(oraInizio, tappe[gruppo.numero_tappa - 1].minuti_partenza).toLocaleTimeString("it-IT", {
            hour: "2-digit",
            minute: "2-digit"
        });
        document.getElementById("laboratorio-futuro").innerText = "FINE PERCORSO";
        document.getElementById("aula-futura").innerText = "";
    }
}

function setFinito() {
    document.getElementById("laboratorio-attuale").innerText = "PERCORSO COMPLETATO";
    //document.getElementById("btn-inietro").enabled = false;
    stoppaTimerInterval();
    console.warn("PERCORSO COMPLETATO");
    //stoppaTimerReload();
    document.getElementById("btn-avanti").innerText = "Ricomincia Percorso";
    sessionStorage.setItem("tempoRimanente", 0);
    sessionStorage.setItem("finito", true);
}

function statoSuccessivo() {
    if (!gruppo.arrivato) {
        if (gruppo.numero_tappa == 0) {
            gruppo.numero_tappa++;
        } else {
            gruppo.arrivato = true;
        }
    } else {
        if (gruppo.numero_tappa == tappe.length) {
            gruppo.arrivato = true;
            gruppo.numero_tappa = 0;
            setFinito();
        } else {
            if (gruppo.numero_tappa == 0)
                sessionStorage.setItem("finito", false);
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

function statoPrecedente() {
    if (gruppo.arrivato) {
        gruppo.arrivato = false;
    } else {
        if (gruppo.numero_tappa == 0) {
            gruppo.numero_tappa = tappe.length;
        } else {
            gruppo.numero_tappa--;
        }
    }
    putGruppo(gruppo).then((result) => {
        console.log(result);
        stoppaTimerInterval();
        setHead(true);
    }).catch((err) => {
        console.error(err);
    });

}

function aggiungiMinuti(data, minuti) {
    const nuovaData = new Date(data); // Crea una nuova istanza per evitare di modificare l'originale
    nuovaData.setMinutes(nuovaData.getMinutes() + minuti);
    return nuovaData;
}

function nonDisponibie() {
    const nonDispElement = document.getElementById('non-disp');
    nonDispElement.style.display = 'block';
    nonDispElement.style.opacity = '1';
    setTimeout(() => {
        nonDispElement.style.opacity = '0';
        setTimeout(() => {
            nonDispElement.style.display = 'none';
        }, 800);
    }, 3500); // Display for 2 seconds before fading out
}