"use strict";

class Indirizzo {
    constructor(
        name = "",
        percorsoDiStudioId = 0,
        percorsoDiStudioName = "",
        id = 0
    ){
        this.name = name;
        this.percorsoDiStudio = new PercorsoDiStudio(percorsoDiStudioName, percorsoDiStudioId)
        this.id = id;
    }
}