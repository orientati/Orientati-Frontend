"use strict";

class Orientato {
    constructor(
        nome = "",
        cognome = "",
        scuolaDiProvenienza_id = 0,
        nomeScuolaDiProvenienza = "",
        id = 0
    ) {
        this.name = nome;
        this.surname = cognome;
        this.fromSchoolId = scuolaDiProvenienza_id;
        this.fromSchoolName = nomeScuolaDiProvenienza;
        this.id = id;
    }
}