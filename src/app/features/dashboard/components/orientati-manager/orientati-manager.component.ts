import {Component, OnInit} from '@angular/core';
import {SearchBarComponent} from '../../../../search-bar/search-bar.component';
import {WebSocketService} from '../../../../WebSoket/web-socket.service';
import {Orientato} from '../../services/types.service';
import {ButtonComponent} from '../../../../shared/button/button.component';

@Component({
  selector: 'app-orientati-manager',
  imports: [
    SearchBarComponent,
    ButtonComponent
  ],
  templateUrl: './orientati-manager.component.html',
  styleUrl: './orientati-manager.component.css'
})
export class OrientatiManagerComponent implements OnInit {

  orientati: Orientato[] = [];

  constructor(private wsService: WebSocketService) {
  }

  ngOnInit() {
    const subscription = this.wsService.onMessageType('orientati').subscribe(msg => {
      this.orientati = msg.orientati;
    });
  }


  touchStartX: number = 0;
  touchEndX: number = 0;
  currentSwipedEmail: number | null = null;
  swipeThreshold: number = 80; // Soglia per attivare lo swipe permanente
  swipeDirection: string | null = null;
  swipeActive: boolean = false;

  // Per il rilevamento della pressione prolungata
  longPressTimer: any = null;
  longPressDuration: number = 500; // 500ms per considerare un tocco "lungo"

  // Soglia per lo swipe a sinistra completo che fa scomparire l'elemento
  dismissThreshold: number = 150;
  // Flag per tracciare se un elemento sta per essere rimosso con animazione
  isItemBeingRemoved: boolean = false;


  onTouchStart(event: TouchEvent, emailId: number) {
    // Se c'è già una mail in stato swiped, gestisci il tocco diversamente
    if (this.currentSwipedEmail !== null && this.currentSwipedEmail !== emailId) {
      // Reset della mail precedentemente swipata
      this.resetSwipedEmail();
    }

    // Inizializza le variabili per il nuovo tocco
    this.touchStartX = event.touches[0].clientX;
    this.touchEndX = this.touchStartX; // Inizializza touchEndX per evitare movimenti imprevisti

    // Imposta la mail corrente solo se non è già in stato swipato
    if (this.currentSwipedEmail !== emailId) {
      this.currentSwipedEmail = emailId;
      this.swipeDirection = null;
    }

    // Imposta timer per pressione prolungata
    this.longPressTimer = setTimeout(() => {
      console.log('Long press detected on email ID:', emailId);
      this.handleLongPress(emailId);
      this.longPressTimer = null;
    }, this.longPressDuration);
  }

  onTouchMove(event: TouchEvent, emailId: number) {
    if (this.currentSwipedEmail !== emailId) return;

    // Cancella il timer di pressione prolungata se l'utente inizia a scorrere
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    this.touchEndX = event.touches[0].clientX;
    const swipeDistance = this.touchEndX - this.touchStartX;

    // Get the email item element
    const emailElement = document.getElementById(`email-${emailId}`);
    if (!emailElement) return;

    // Trova il contenuto dell'email
    const contentElement = emailElement.querySelector('.email-content') as HTMLElement;
    if (!contentElement) return;

    // Se siamo già in uno stato swipato fisso e continuiamo nella stessa direzione, ignoriamo
    if (this.swipeActive &&
      ((this.swipeDirection === 'right' && swipeDistance > 0) ||
        (this.swipeDirection === 'left' && swipeDistance < 0))) {
      return;
    }

    // Se siamo in uno stato swipato fisso e cambiamo direzione, dobbiamo considerare il punto di partenza
    if (this.swipeActive) {
      // Aggiorniamo la posizione in base alla direzione di swipe precedente
      const startingOffset = this.swipeDirection === 'right' ? 90 : -90;
      contentElement.style.transform = `translateX(${startingOffset + swipeDistance}px)`;

      // Se stiamo tornando verso la posizione centrale
      if ((this.swipeDirection === 'right' && swipeDistance < 0) ||
        (this.swipeDirection === 'left' && swipeDistance > 0)) {
        // Se siamo tornati abbastanza, resettiamo lo stato swipato
        if (Math.abs(swipeDistance) > Math.abs(startingOffset) * 0.5) {
          this.swipeActive = false;
          this.swipeDirection = null;
        }
      }
    } else {
      // Normale swipe quando non siamo in uno stato swipato fisso
      // Limita la distanza di trascinamento
      let moveDistance = swipeDistance;

      // Aggiunta della logica per swipe verso sinistra esteso
      if (swipeDistance < 0 && Math.abs(swipeDistance) > this.dismissThreshold) {
        // Permetti uno swipe più ampio per il gesto di rimozione
        moveDistance = swipeDistance;
      } else if (Math.abs(moveDistance) > 150) {
        moveDistance = moveDistance > 0 ? 150 : -150;
      }

      contentElement.style.transform = `translateX(${moveDistance}px)`;

      // Imposta la direzione di swipe per mostrare l'indicatore appropriato
      if (moveDistance > 20) {
        this.swipeDirection = 'right';
      } else if (moveDistance < -20) {
        this.swipeDirection = 'left';
      } else {
        this.swipeDirection = null;
      }
    }
  }

  onTouchEnd(event: TouchEvent, emailId: number) {
    if (this.currentSwipedEmail !== emailId) return;

    // Cancella il timer di pressione prolungata se esiste
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    const swipeDistance = this.touchEndX - this.touchStartX;
    const emailElement = document.getElementById(`email-${emailId}`);

    if (!emailElement) return;

    const contentElement = emailElement.querySelector('.email-content') as HTMLElement;
    if (!contentElement) return;

    // Verifica se lo swipe a sinistra è abbastanza lungo per eliminare l'elemento
    if (swipeDistance < -this.dismissThreshold) {
      // Log per lo swipe lungo a sinistra
      console.log('Swipe left complete for email ID:', emailId, '- Dismissing item');
      // Animazione di dismissione
      this.dismissEmail(emailId);
      return;
    }

    // Se lo swipe è sufficientemente ampio e non siamo già in uno stato swipato
    if (!this.swipeActive && Math.abs(swipeDistance) >= this.swipeThreshold) {
      // Imposta lo stato swipato fisso
      this.swipeActive = true;

      if (swipeDistance > 0) {
        // Right swipe - imposta la posizione fissa
        contentElement.style.transition = 'transform 0.2s ease-out';
        contentElement.style.transform = 'translateX(90px)';
        this.swipeDirection = 'right';
      } else {
        // Left swipe - imposta la posizione fissa
        contentElement.style.transition = 'transform 0.2s ease-out';
        contentElement.style.transform = 'translateX(-90px)';
        this.swipeDirection = 'left';
      }

      // Rimuovi la transizione dopo che è completata
      setTimeout(() => {
        if (contentElement) {
          contentElement.style.transition = '';
        }
      }, 200);
    }
    // Se stiamo tornando indietro da uno stato swipato
    else if (this.swipeActive) {
      const startingOffset = this.swipeDirection === 'right' ? 90 : -90;

      // Se abbiamo swipato abbastanza nella direzione opposta, torniamo alla posizione centrale
      if ((this.swipeDirection === 'right' && swipeDistance < -40) ||
        (this.swipeDirection === 'left' && swipeDistance > 40)) {
        contentElement.style.transition = 'transform 0.2s ease-out';
        contentElement.style.transform = 'translateX(0)';
        this.swipeActive = false;
        this.swipeDirection = null;

        setTimeout(() => {
          if (contentElement) {
            contentElement.style.transition = '';
          }
        }, 200);
      }
      // Altrimenti ritorniamo alla posizione swipata
      else {
        contentElement.style.transition = 'transform 0.2s ease-out';
        contentElement.style.transform = `translateX(${startingOffset}px)`;

        setTimeout(() => {
          if (contentElement) {
            contentElement.style.transition = '';
          }
        }, 200);
      }
    }
    // Se lo swipe non è abbastanza ampio e non siamo in uno stato swipato, torniamo alla posizione centrale
    else if (!this.swipeActive) {
      contentElement.style.transition = 'transform 0.2s ease-out';
      contentElement.style.transform = 'translateX(0)';
      this.swipeDirection = null;

      setTimeout(() => {
        if (contentElement) {
          contentElement.style.transition = '';
        }
      }, 200);
    }
  }

  // Funzione per resettare lo stato della mail swipata
  resetSwipedEmail() {
    if (this.currentSwipedEmail === null) return;

    const emailElement = document.getElementById(`email-${this.currentSwipedEmail}`);
    if (!emailElement) return;

    const contentElement = emailElement.querySelector('.email-content') as HTMLElement;
    if (!contentElement) return;

    contentElement.style.transition = 'transform 0.2s ease-out';
    contentElement.style.transform = 'translateX(0)';

    this.swipeActive = false;
    this.swipeDirection = null;

    // Resetta dopo la transizione
    setTimeout(() => {
      if (contentElement) {
        contentElement.style.transition = '';
      }
      this.currentSwipedEmail = null;
    }, 200);
  }

  // Nuova funzione per l'animazione di eliminazione
  dismissEmail(emailId: number) {
    if (this.isItemBeingRemoved) return;

    this.isItemBeingRemoved = true;

    const emailElement = document.getElementById(`email-${emailId}`);
    if (!emailElement) {
      this.isItemBeingRemoved = false;
      return;
    }

    const contentElement = emailElement.querySelector('.email-content') as HTMLElement;
    if (!contentElement) {
      this.isItemBeingRemoved = false;
      return;
    }

    // Animazione di uscita verso sinistra
    contentElement.style.transition = 'transform 0.3s ease-out';
    contentElement.style.transform = 'translateX(-100%)';

    // Ottieni l'indice dell'email
    const emailIndex = this.orientati.findIndex(email => email.id === emailId);
    if (emailIndex === -1) {
      this.isItemBeingRemoved = false;
      return;
    }

    // Ottieni l'oggetto email
    const emailObject = this.orientati[emailIndex];

    // Aggiungi la classe per l'animazione di sparizione
    emailElement.classList.add('removing');

    // Dopo l'animazione, rimuovi l'elemento dalla lista e aggiungilo in fondo
    setTimeout(() => {
      // Rimuovi l'email dall'array
      this.orientati.splice(emailIndex, 1);

      // Aggiungi l'email in fondo alla lista
      setTimeout(() => {
        this.orientati.push(emailObject);

        // Reset degli stati di swipe
        this.swipeActive = false;
        this.swipeDirection = null;
        this.currentSwipedEmail = null;
        this.isItemBeingRemoved = false;
      }, 50); // Piccolo ritardo per garantire che l'animazione di uscita sia completa
    }, 300); // Durata dell'animazione
  }

  // Gestisce il click sul background verde
  handleGreenClick(event: MouseEvent, emailId: number) {
    event.stopPropagation();
    console.log('Green area clicked for email ID:', emailId);

    // Puoi aggiungere qui altre azioni per il click sulla zona verde
  }

  // Gestisce il click sul background blu
  handleBlueClick(event: MouseEvent, emailId: number) {
    event.stopPropagation();
    console.log('Blue area clicked for email ID:', emailId);

    // Puoi aggiungere qui altre azioni per il click sulla zona blu
  }

  // Funzione per gestire la pressione prolungata
  handleLongPress(emailId: number) {
    console.log('Long press action performed on email ID:', emailId);
    // Implementa qui la logica per la pressione prolungata
  }

  // Funzione per spostare l'email in fondo alla lista (eseguita quando l'utente tap sulla label "Sposta in basso")
  moveEmailToBottom(emailId: number) {
    const emailIndex = this.orientati.findIndex(email => email.id === emailId);
    if (emailIndex !== -1) {
      // Ottieni l'email e rimuovila dall'array
      const email = this.orientati[emailIndex];
      this.orientati.splice(emailIndex, 1);

      // Aggiungi l'email in fondo alla lista
      this.orientati.push(email);
      console.log(`Email ${emailId} moved to bottom of the list`);

      // Reset dello stato swipato
      this.resetSwipedEmail();
    }
  }

  // Funzione per archiviare l'email (eseguita quando l'utente tap sulla label "Archivia")
  archiveEmail(emailId: number) {
    // Rimuovi l'email dalla lista
    this.orientati = this.orientati.filter(email => email.id !== emailId);
    console.log(`Email ${emailId} archived`);

    // Reset dello stato swipato
    this.resetSwipedEmail();
  }


}
