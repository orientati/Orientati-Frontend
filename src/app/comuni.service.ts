import { Injectable } from '@angular/core';

export interface Comune {
  cap: string[];
  codice: string;
  codiceCatastale: string;
  nome: string;
  popolazione: number;
  provincia: {
    codice: string;
    nome: string;
  };
  regione: {
    codice: string;
    nome: string;
  };
  sigla: string;
  zona: {
    codice: string;
    nome: string;
  };
}


@Injectable({
  providedIn: 'root'
})
export class ComuniService {

  constructor() { }

    async getComuni(): Promise<Comune[]> {
    return fetch('https://raw.githubusercontent.com/matteocontrini/comuni-json/refs/heads/master/comuni.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
        throw error;
      });
    }
}
