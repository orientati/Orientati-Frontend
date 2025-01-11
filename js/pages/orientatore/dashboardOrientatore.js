"use strict"

let tappe = [];
let numeroTappa = 0;
let arrivato = false;
let Gruppo = 0;

document.addEventListener("DOMContentLoaded", function () {

    if (localStorage.getItem("modaleUpdate") === null) {
        document.getElementById("modalUpdate").classList.remove("hide");
        document.getElementById("closeModalUpdate").addEventListener("click", function () {
            document.getElementById("modalUpdate").classList.add("hide");
            localStorage.setItem("modaleUpdate", "true");
        });
    }


    aggiornaDataOra();
    setInterval(aggiornaDataOra, 1000);

    setInterval(updateTimer, 1000);

    updateData();
    setInterval(updateData, 3000);

    if (sessionStorage.getItem("tappePassate") === null) {
        sessionStorage.setItem("tappePassate", JSON.stringify({tappe: []}));
    }
});

function updateData() {
    getGruppo()
        .then((gruppo) => {
            numeroTappa = gruppo.numero_tappa;
            arrivato = gruppo.arrivato;
            Gruppo = gruppo;
            if (arrivato) {
                document.getElementById("btn-avanti").textContent = "Avanti";
                document.getElementById("btn-indietro").classList.remove("hide");
                if (numeroTappa === 0) {
                    document.getElementById("btn-avanti").classList.add("hide");
                    document.getElementById("testo-prossimo-laboratorio").classList.add("hide");
                    document.getElementById("aula-futura").classList.add("hide");
                    document.getElementById("laboratorio-futuro").classList.add("hide");
                    document.getElementById("prossimolab").classList.add("hide");
                    document.getElementById("azione-in-corso").classList.add("hide");
                    document.getElementById("laboratorio-attuale").classList.add("hide");
                    document.getElementById("orari-teorico-attuale").classList.add("hide");
                    document.getElementsByClassName("timer")[0].classList.add("hide");
                } else {
                    document.getElementById("btn-avanti").classList.remove("hide");
                    document.getElementById("testo-prossimo-laboratorio").classList.remove("hide");
                    document.getElementById("aula-futura").classList.remove("hide");
                    if (numeroTappa === tappe.length - 1) {
                        document.getElementById("laboratorio-futuro").classList.remove("hide");
                        document.getElementById("prossimolab").classList.remove("hide");
                    }
                    document.getElementsByClassName("separatore")[1].classList.remove("hide");
                    document.getElementsByClassName("separatore")[2].classList.remove("hide");
                    document.getElementById("azione-in-corso").classList.remove("hide");
                    document.getElementById("laboratorio-attuale").classList.remove("hide");
                    document.getElementById("orari-teorico-attuale").classList.remove("hide");
                    document.getElementsByClassName("timer")[0].classList.remove("hide");
                }
                if (numeroTappa === tappe.length) {
                    document.getElementById("btn-avanti").textContent = "Finisci il percorso";
                }
            } else {
                document.getElementsByClassName("timer")[0].classList.remove("hide"); //TODO: considerare il fatto che andrebbero inseriti anche gli altri elementi (righe 42-> 54 circa)

                if (numeroTappa === 0) {
                    document.getElementById("btn-avanti").textContent = "Inizia il percorso";
                    document.getElementById("btn-indietro").classList.add("hide");
                } else {
                    document.getElementById("btn-indietro").classList.remove("hide");
                    document.getElementById("btn-avanti").textContent = "Entra in laboratorio";
                }
            }
            getTappe(gruppo.id)
                .then((tappeGruppo) => {
                    tappe = tappeGruppo.tappe;
                    caricaGruppo(gruppo);
                })
                .catch((err) => {
                    console.error(err);
                });
        }).catch((err) => {
        if (err === 401) {
            console.log("Non autorizzato");
            location.href = "pages/login.html";
        } else if (err === 404) {
            console.log("Nessun gruppo trovato");
            location.href = "pages/orientatore/collegaGruppo.html";
        } else {
            console.log(err);
        }
    });
}

function aggiornaDataOra() {
    const now = new Date();
    const giorni = ["DOMENICA", "LUNEDÌ", "MARTEDÌ", "MERCOLEDÌ", "GIOVEDÌ", "VENERDÌ", "SABATO"];

    const giornoSettimana = giorni[now.getDay()];
    const giorno = String(now.getDate()).padStart(2, '0');
    const mese = String(now.getMonth() + 1).padStart(2, '0');
    const ore = String(now.getHours()).padStart(2, '0');
    const minuti = String(now.getMinutes()).padStart(2, '0');

    document.getElementById("data").textContent = `${giornoSettimana} ${giorno}/${mese} - ${ore}:${minuti}`;
}

function feedback() {
    location.href = "https://forms.gle/GYVu66aoP1y7AF45A";
}

function caricaGruppo(gruppo) {
    document.getElementById("nome-gruppo").textContent = "Gruppo " + gruppo.nome;
    if (gruppo.numero_tappa === 0 && !gruppo.arrivato) {
        // Se il gruppo non è ancora partito
        document.getElementById("aula-attuale").textContent = "NON PARTITO";
        sessionStorage.setItem("timer", "00:00:00");
        sessionStorage.setItem("tappePassate", JSON.stringify({tappe: []}));

        document.getElementsByClassName("separatore")[1].classList.add("hide");
        mostraProssimaTappa(gruppo);
    } else if (gruppo.numero_tappa === 0 && gruppo.arrivato) {
        // Se il gruppo è uscito
        document.getElementById("aula-attuale").textContent = "PERCORSO FINITO";
        document.getElementById("btn-indietro").classList.remove("hide");
        document.getElementsByClassName("separatore")[1].classList.add("hide");
        document.getElementsByClassName("separatore")[2].classList.add("hide");
    } else {
        // Se il gruppo è in giro
        document.getElementById("azione-in-corso").textContent = gruppo.arrivato ? "Arrivato in:" : "In viaggio verso:";

        getTappa(gruppo.id, (gruppo.numero_tappa))
            .then((tappa) => {
                document.getElementById("laboratorio-attuale").textContent = tappa.aula_posizione + " - " + tappa.aula_materia;
                document.getElementById("aula-attuale").textContent = tappa.aula_nome;

                let [ore, minuti] = gruppo.orario_partenza.split(":").map(Number);
                let orarioFuturoIngresso = new Date();
                orarioFuturoIngresso.setHours(ore);
                orarioFuturoIngresso.setMinutes(minuti);
                orarioFuturoIngresso.setSeconds(0);
                orarioFuturoIngresso.setMinutes(minuti + tappa.minuti_arrivo);

                [ore, minuti] = gruppo.orario_partenza.split(":").map(Number);
                let orarioFuturiUscita = new Date();
                orarioFuturiUscita.setHours(ore);
                orarioFuturiUscita.setMinutes(minuti);
                orarioFuturiUscita.setSeconds(0);
                orarioFuturiUscita.setMinutes(minuti + tappa.minuti_partenza);

                document.getElementById("orari-teorico-attuale").textContent = String(orarioFuturoIngresso.getHours()).padStart(2, "0") + ":" + String(orarioFuturoIngresso.getMinutes()).padStart(2, "0") + " - " + String(orarioFuturiUscita.getHours()).padStart(2, "0") + ":" + String(orarioFuturiUscita.getMinutes()).padStart(2, "0");

                document.getElementById("btn-avanti").classList.remove("hide");
                document.getElementById("testo-prossimo-laboratorio").classList.remove("hide");
            }).catch((err) => {
            if (err === 401) {
                console.log("Non autorizzato");
                location.href = "pages/login.html";
            } else if (err === 404) {
                console.log("Nessuna tappa trovata");
                location.href = "pages/orientatore/collegaGruppo.html";
            } else {
                console.log(err);
            }
        });

        document.getElementById("btn-indietro").classList.remove("hide");
        mostraProssimaTappa(gruppo);
    }

    document.getElementById("accompagantori").textContent = "Partecipanti " + gruppo.orientati_presenti + "/" + gruppo.orientati_totali;
}

function tappaSuccessiva() {
    if (numeroTappa === 0 && !arrivato) {
        putGruppo(Gruppo.id, 1, false).then((result) => {
            putGruppo(Gruppo.id, 1, true).then((result) => {
                updateData();
                if (sessionStorage.getItem("gruppoID") !== Gruppo.id) {
                    sessionStorage.setItem("gruppoID", Gruppo.id);
                    sessionStorage.removeItem("timer");
                    sessionStorage.setItem("tappePassate", JSON.stringify({tappe: []}));
                }

                let tappePassate = JSON.parse(sessionStorage.getItem("tappePassate"));

                if (tappePassate.tappe.indexOf(numeroTappa) === -1) {
                    tappePassate.tappe.push(numeroTappa);
                    sessionStorage.setItem("timer", "00:10:00"); //TODO: da ricavare
                    sessionStorage.setItem("tappePassate", JSON.stringify(tappePassate));
                }
            }).catch((err) => {
                if (err === 401) {
                    console.log("Non autorizzato");
                    location.href = "pages/login.html";
                } else {
                    console.log(err);
                }
            });
        }).catch((err) => {
            if (err === 401) {
                console.log("Non autorizzato");
                location.href = "pages/login.html";
            } else {
                console.log(err);
            }
        });
    } else if (numeroTappa === tappe.length && arrivato) {
        putGruppo(Gruppo.id, 0, true).then((result) => {
            updateData();
        }).catch((err) => {
            if (err === 401) {
                console.log("Non autorizzato");
                location.href = "pages/login.html";
            } else {
                console.log(err);
            }
        });
    } else {
        if (arrivato) {
            numeroTappa++;
            arrivato = false;
            document.getElementById("btn-avanti").textContent = "Avanti";
        } else {
            document.getElementById("btn-avanti").textContent = "Entra in laboratorio";
            arrivato = true;
            let tappePassate = JSON.parse(sessionStorage.getItem("tappePassate"));
            if (tappePassate.tappe.indexOf(numeroTappa) === -1) {
                tappePassate.tappe.push(numeroTappa);
                let timerPrecedente = sessionStorage.getItem("timer");
                let [ore, minuti, secondi] = timerPrecedente.split(":").map(Number);
                let timer = new Date();
                timer.setHours(ore);
                timer.setMinutes(minuti);
                timer.setSeconds(secondi);
                timer.setMinutes(timer.getMinutes() + (parseInt(tappe[Gruppo.numero_tappa - 1].minuti_partenza) - parseInt(tappe[Gruppo.numero_tappa - 1].minuti_arrivo)));
                sessionStorage.setItem("timer", String(timer.getHours()).padStart(2, "0") + ":" + String(timer.getMinutes()).padStart(2, "0") + ":" + String(timer.getSeconds()).padStart(2, "0"));

                sessionStorage.setItem("tappePassate", JSON.stringify(tappePassate));
            }
        }
        putGruppo(Gruppo.id, numeroTappa, arrivato).then((result) => {
            updateData();
        }).catch((err) => {
            if (err === 401) {
                console.log("Non autorizzato");
                location.href = "pages/login.html";
            } else {
                console.log(err);
            }
        });
    }
}

function tappaPrecedente() {
    if (numeroTappa === 1 && arrivato) {
        putGruppo(Gruppo.id, 0, false).then((result) => {
            updateData();
        }).catch((err) => {
            if (err === 401) {
                console.log("Non autorizzato");
                location.href = "pages/login.html";
            } else {
                console.log(err);
            }
        });
    } else if (numeroTappa === 0 && arrivato) {
        putGruppo(Gruppo.id, tappe.length, true).then((result) => {
            updateData();
        }).catch((err) => {
            if (err === 401) {
                console.log("Non autorizzato");
                location.href = "pages/login.html";
            } else {
                console.log(err);
            }
        });
    } else {
        if (arrivato) {
            arrivato = false;
        } else {
            numeroTappa--;
            arrivato = true;
        }
        putGruppo(Gruppo.id, numeroTappa, arrivato).then((result) => {
            updateData();
        }).catch((err) => {
            if (err === 401) {
                console.log("Non autorizzato");
                location.href = "pages/login.html";
            } else {
                console.log(err);
            }
        });
    }
}

function mostraProssimaTappa(gruppo) {
    if (gruppo.numero_tappa !== tappe.length) {
        getTappa(gruppo.id, (gruppo.numero_tappa + 1))
            .then((tappa) => {
                document.getElementById("laboratorio-futuro").textContent = tappa.aula_posizione + " - " + tappa.aula_materia;
                document.getElementById("aula-futura").textContent = tappa.aula_nome;

                let [ore, minuti] = gruppo.orario_partenza.split(":").map(Number);
                let orarioFuturoIngresso = new Date();
                orarioFuturoIngresso.setHours(ore);
                orarioFuturoIngresso.setMinutes(minuti);
                orarioFuturoIngresso.setSeconds(0);
                orarioFuturoIngresso.setMinutes(minuti + tappa.minuti_arrivo);

                [ore, minuti] = gruppo.orario_partenza.split(":").map(Number);
                let orarioFuturiUscita = new Date();
                orarioFuturiUscita.setHours(ore);
                orarioFuturiUscita.setMinutes(minuti);
                orarioFuturiUscita.setSeconds(0);

                document.getElementById("orari-teorico-futuro").textContent = String(orarioFuturoIngresso.getHours()).padStart(2, "0") + ":" + String(orarioFuturoIngresso.getMinutes()).padStart(2, "0") + " - " + String(orarioFuturiUscita.getHours()).padStart(2, "0") + ":" + String(orarioFuturiUscita.getMinutes()).padStart(2, "0");

                document.getElementById("falg-occupato").textContent = tappa.occupata ? "OCCUPATO" : "LIBERO";
                if (tappa.occupata) {
                    document.getElementById("falg-occupato").classList.remove("libero");
                    document.getElementById("falg-occupato").classList.add("occupato");
                } else {
                    document.getElementById("falg-occupato").classList.add("libero");
                    document.getElementById("falg-occupato").classList.remove("occupato");

                }
                document.getElementById("btn-avanti").classList.remove("hide");
                document.getElementById("testo-prossimo-laboratorio").classList.remove("hide");
            }).catch((err) => {
            if (err === 401) {
                console.log("Non autorizzato");
                location.href = "pages/login.html";
            } else if (err === 404) {
                console.log("Nessuna tappa trovata");
                location.href = "pages/orientatore/collegaGruppo.html";
            } else {
                console.log(err);
            }
        });
    } else {
        document.getElementById("aula-futura").textContent = "FINE PERCORSO";
        document.getElementById("laboratorio-futuro").classList.add("hide");
        document.getElementById("prossimolab").classList.add("hide");
    }
}

function updateTimer() {
    if (sessionStorage.getItem("timer") === null || sessionStorage.getItem("timer") === "00:00:00") {
        document.getElementById("minuti").textContent = "00";
        document.getElementById("secondi").textContent = "00";
        return
    }
    let timer = sessionStorage.getItem("timer");
    let [ore, minuti, secondi] = timer.split(":").map(Number);
    let timerAttuale = new Date();
    timerAttuale.setHours(ore);
    timerAttuale.setMinutes(minuti);
    timerAttuale.setSeconds(secondi);
    timerAttuale.setSeconds(timerAttuale.getSeconds() - 1);
    sessionStorage.setItem("timer", String(timerAttuale.getHours()).padStart(2, "0") + ":" + String(timerAttuale.getMinutes()).padStart(2, "0") + ":" + String(timerAttuale.getSeconds()).padStart(2, "0"));
    document.getElementById("minuti").textContent = String(timerAttuale.getMinutes()).padStart(2, "0");
    document.getElementById("secondi").textContent = String(timerAttuale.getSeconds()).padStart(2, "0");

    if (timerAttuale.getHours() === 0 && timerAttuale.getMinutes() === 0 && timerAttuale.getSeconds() === 0) {
        document.getElementById("minuti").textContent = "00";
        document.getElementById("secondi").textContent = "00";
    }
}
