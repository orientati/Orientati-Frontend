import {Injectable} from '@angular/core';

export interface Orientato {
  id: number;
  nome: string;
  cognome: string;
  scuolaDiProvenienza_id: number;
  scuolaDiProvenienza_nome: string;
  gruppo_id: number;
  gruppo_nome: string;
  gruppo_orario_partenza: string;
  presente: boolean;
  assente: boolean;
}

export interface Gruppo {
  id: number;
  nome: string;
  codice: string;
  fasciaOraria_id: number;
  numero_tappa: number;
  arrivato: boolean;
  orario_partenza_effettivo: string;
  orario_fine_effettivo: string;
  percorsoFinito: boolean | null;
  aula_nome: string | null;
  aula_posizione: string | null;
  aula_materia: string | null;
  minuti_arrivo: number | null;
  minuti_partenza: number | null;
  totale_orientati: number;
  orientati_presenti: number;
  orientati_assenti: number;
  orario_partenza: string;
}

export interface Aula {
  id: number;
  nome: string;
  posizione: string;
  materia: string;
  dettagli: string;
  occupata: boolean;
  gruppo_id: number | null;
  gruppo_nome: string | null;
  gruppo_orario_partenza: string | null;
  minuti_arrivo: number;
  minuti_partenza: number;
}

@Injectable({
  providedIn: 'root'
})
export class TypesService {

  constructor() {
  }
}
