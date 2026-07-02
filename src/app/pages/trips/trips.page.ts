import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonFab, IonFabButton, IonLabel } from '@ionic/angular/standalone';
import { TravelDataService } from '../../services/travel-data.service';
import { Trip } from '../../models/trip.model';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.page.html',
  styleUrls: ['./trips.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonFab,
    IonFabButton,
    IonLabel
  ]
})
export class TripsPage implements OnInit {
  trips: Trip[] = [];

  constructor(
    private travelDataService: TravelDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTrips();
  }

  loadTrips() {
    this.trips = this.travelDataService.getTrips();
  }

  openTrip(tripId: string) {
    this.router.navigate(['/trips', tripId]);
  }

  addTrip() {
    this.router.navigate(['/trips/new']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  formatAmount(amount: number): string {
    return amount.toFixed(2);
  }

  getTotalSpent(tripId: string): number {
    return this.travelDataService.getTripTotalSpent(tripId);
  }
}
