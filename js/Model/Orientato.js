"use strict";

class Orientato {
    constructor(
        id = 0,
        nome = "",
        cognome = "",
        scuolaDiProvenienza_id = 0,
        scuolaDiProvenienza_nome = "",
        gruppo_id = 0,
        gruppo_nome = "",
        gruppo_orario_partenza = "",
        presente = false,
        assente = false
    ) {
        this.id = id;
        this.nome = nome;
        this.cognome = cognome;
        this.scuolaDiProvenienza_id = scuolaDiProvenienza_id;
        this.scuolaDiProvenienza_nome = scuolaDiProvenienza_nome;
        this.gruppo_id = gruppo_id;
        this.gruppo_nome = gruppo_nome;
        this.gruppo_orario_partenza = gruppo_orario_partenza;
        this.presente = presente;
        this.assente = assente;
    }
}
