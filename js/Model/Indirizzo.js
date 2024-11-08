"use strict";

class Indirizzo {
    constructor(
        nome = "",
        percorsoDiStudioId = 0,
        nomePercorsoDiStudi = "",
        id = 0
    ){
        this.name = nome;
        this.percorsoDiStudio = new PercorsoDiStudi(nomePercorsoDiStudi, percorsoDiStudioId)
        this.id = id;
    }
}