import {Component} from '@angular/core';
import {NavRailComponent} from '../shared/components/navigation/nav-rail/nav-rail.component';
import {IscrizioneRagazzoService} from '../iscrizione-ragazzo.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ButtonComponent} from '../shared/button/button.component';

@Component({
    selector: 'app-iscrizione-orientato-page',
    imports: [
        NavRailComponent,
        ReactiveFormsModule,
        ButtonComponent,
    ],
    templateUrl: './iscrizione-orientato-page.component.html',
    styleUrl: './iscrizione-orientato-page.component.css'
})
export class IscrizioneOrientatoPageComponent {
    modalVisible = false;

    /*
    apriModale() {
      this.modalVisible = true;
    }

    chiudiModale() {
      this.modalVisible = false;
    }
  */


    formSubmitted = false;

    ragazzoForm: FormGroup = new FormGroup({
        nome: new FormControl('', Validators.required),
        cognome: new FormControl('', Validators.required),
        scuolaDiProvenienza_id: new FormControl('', Validators.required),
    });


    ragazzi: any[] = [];
    scuole: any[] = [];
    iscrizioni: any[] = [];
    date: any[] = [];

    constructor(private iscrizioneRagazzoService: IscrizioneRagazzoService) {
        // Inizializzazione del servizio per la gestione delle iscrizioni
        this.iscrizioneRagazzoService.getRagazzi().subscribe({
            next: (response) => {
                this.ragazzi = response.ragazzi;
                console.log(response.ragazzi);
            },
            error: (error) => {
                console.error('Errore nel caricamento dei ragazzi:', error);
            }
        });

        this.iscrizioneRagazzoService.getScuole().subscribe({
            next: (response) => {
                this.scuole = response.scuole;
                console.log(response.scuole);
            },
            error: (error) => {
                console.error('Errore nel caricamento delle scuole:', error);
            }
        });

        this.iscrizioneRagazzoService.getIscrizioni().subscribe({
            next: (response) => {
                this.iscrizioni = response.iscrizioni;
                console.log(response.iscrizioni);

            },
            error: (error) => {
                console.error('Errore nel caricamento delle iscrizioni:', error);
            }
        });

        this.iscrizioneRagazzoService.getDate().subscribe({
            next: (response) => {
                this.date = response.date;
                console.log(response.date);

            },
            error: (error) => {
                console.error('Errore nel caricamento delle iscrizioni:', error);
            }
        });
    }

    eliminaRagazzo(id: number) {
        this.iscrizioneRagazzoService.eliminaRagazzo(id).subscribe({
            next: () => {
                this.ragazzi = this.ragazzi.filter(ragazzo => ragazzo.id !== id);
                console.log(`Ragazzo con ID ${id} eliminato con successo.`);
            },
            error: (error) => {
                console.error('Errore nell\'eliminazione del ragazzo:', error);
            }
        });
    }

    eliminaIscrizione(id: number) {
        this.iscrizioneRagazzoService.eliminaIscrizione(id).subscribe({
            next: () => {
                this.iscrizioni = this.iscrizioni.filter(iscrizione => iscrizione.id !== id);
                console.log(`Iscrizione con ID ${id} eliminata con successo.`);
            },
            error: (error) => {
                console.error('Errore nell\'eliminazione dell\'iscrizione:', error);
            }
        });
    }


    async aggiungiRagazzo() {
        this.formSubmitted = true;

        if (this.ragazzoForm.invalid) {
            return;
        }

        let nome = this.ragazzoForm.value.nome!;
        let cognome = this.ragazzoForm.value.cognome!;
        let scuolaDiProvenienza_id = this.ragazzoForm.value.scuolaDiProvenienza_id!;

        this.iscrizioneRagazzoService.aggiungiRagazzo(nome, cognome, scuolaDiProvenienza_id).subscribe({
            next: (response) => {
                console.log(response);

            },
            //error: err => this.errorMessage = 'Credenziali errate'
        });
    }


    getControl(controlName: string, formName: FormGroup): FormControl {
        return formName.get(controlName) as FormControl;
    }

    async aggiungiIscrizione() {

    }
}
