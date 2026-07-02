import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonButtons } from '@ionic/angular/standalone';
import { TravelDataService } from '../../services/travel-data.service';
import { Trip } from '../../models/trip.model';
import { TravelEvent } from '../../models/travel-event.model';

@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.page.html',
  styleUrls: ['./trip-details.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonButtons
  ]
})
export class TripDetailsPage implements OnInit {
  trip?: Trip;
  events: TravelEvent[] = [];
  totalSpent = 0;
  remainingBudget = 0;
  isOverBudget = false;

  constructor(
    private travelDataService: TravelDataService,
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    const tripId = this.route.snapshot.paramMap.get('tripId');
    if (tripId) {
      this.loadTrip(tripId);
    }
  }

  loadTrip(tripId: string) {
    this.trip = this.travelDataService.getTripById(tripId);
    if (this.trip) {
      this.events = this.travelDataService.getEventsByTripId(tripId);
      this.totalSpent = this.travelDataService.getTripTotalSpent(tripId);
      if (this.trip.budget) {
        this.remainingBudget = this.trip.budget - this.totalSpent;
        this.isOverBudget = this.remainingBudget < 0;
      }
    }
  }

  editTrip() {
    if (this.trip) {
      this.router.navigate(['/trips', this.trip.id, 'edit']);
    }
  }

  async deleteTrip() {
    const alert = await this.alertController.create({
      header: 'Delete Trip',
      message: 'Are you sure you want to delete this trip? This will also delete all events in this trip.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            if (this.trip) {
              this.travelDataService.deleteTrip(this.trip.id!);
              this.router.navigate(['/trips']);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  addEvent() {
    if (this.trip) {
      this.router.navigate(['/trips', this.trip.id, 'events', 'new']);
    }
  }

  editEvent(eventId: string) {
    this.router.navigate(['/events', eventId, 'edit']);
  }

  async deleteEvent(eventId: string) {
    const alert = await this.alertController.create({
      header: 'Delete Event',
      message: 'Are you sure you want to delete this event?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.travelDataService.deleteEvent(eventId);
            if (this.trip) {
              this.loadTrip(this.trip.id!);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  formatTime(timeString: string): string {
    return timeString;
  }

  formatAmount(amount: number): string {
    return amount.toFixed(2);
  }

  getEventTotalCost(event: TravelEvent): number {
    return this.travelDataService.getEventTotalCost(event);
  }

  formatEventType(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  get absoluteRemainingBudget(): number {
    return Math.abs(this.remainingBudget);
  }
}
