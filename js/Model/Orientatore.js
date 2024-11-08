"use strict";

class Orientatore {
    constructor(
        nome = "",
        cognome = "",
        email = "",
        classe = "",
        indirizzo_id = 0,
        nomeIndirizzo = "",
        gruppi = [],
        id = 0
    ) {
        this.nome = nome;
        this.cognome = cognome;
        this.email = email;
        this.classe = classe;
        this.indirizzo_id = indirizzo_id;
        this.nomeIndirizzo = nomeIndirizzo;
        this.gruppi = gruppi;
        this.id = id;
    }
}