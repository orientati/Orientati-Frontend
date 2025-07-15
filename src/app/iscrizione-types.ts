export interface RagazzoResponse {
  ragazzi: Ragazzo[];
}

export interface Ragazzo {
  id: number;
  nome: string;
  cognome: string;
  scuolaDiProvenienza_id: number;
}


export interface Scuola {
  id: number;
  nome: string;
}

export interface ScuolaResponse {
  scuole: Scuola[];
}

export interface Ragazzo {
  id: number;
  nome: string;
  cognome: string;
}

export interface FasciaOraria {
  data: { data: string };
  percorso: { nome: string };
  oraInizio: string;
}

export interface Iscrizione {
  id: number;
  fasciaOraria: FasciaOraria;
  ragazzi: Ragazzo[];
}

export interface IscrizioneResponse {
  iscrizioni: Iscrizione[];
}
