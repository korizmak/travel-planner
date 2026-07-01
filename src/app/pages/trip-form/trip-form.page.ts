import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonTextarea, IonLabel, IonItem } from '@ionic/angular/standalone';
import { TravelDataService } from '../../services/travel-data.service';
import { Trip } from '../../models/trip.model';

@Component({
  selector: 'app-trip-form',
  templateUrl: './trip-form.page.html',
  styleUrls: ['./trip-form.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonInput,
    IonTextarea,
    IonLabel,
    IonItem
  ]
})
export class TripFormPage implements OnInit {
  tripForm: FormGroup;
  isEditMode = false;
  tripId?: string;

  constructor(
    private fb: FormBuilder,
    private travelDataService: TravelDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.tripForm = this.fb.group({
      title: ['', Validators.required],
      destination: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      budget: ['', [Validators.min(0)]],
      description: ['']
    });
  }

  ngOnInit() {
    const tripId = this.route.snapshot.paramMap.get('tripId');
    if (tripId) {
      this.isEditMode = true;
      this.tripId = tripId;
      this.loadTrip(tripId);
    }
  }

  loadTrip(id: string) {
    const trip = this.travelDataService.getTripById(id);
    if (trip) {
      this.tripForm.patchValue({
        title: trip.title,
        destination: trip.destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
        budget: trip.budget || '',
        description: trip.description || ''
      });
    }
  }

  saveTrip() {
    if (this.tripForm.invalid) {
      return;
    }

    const tripData: Omit<Trip, 'id'> = {
      title: this.tripForm.value.title,
      destination: this.tripForm.value.destination,
      startDate: this.tripForm.value.startDate,
      endDate: this.tripForm.value.endDate,
      budget: this.tripForm.value.budget ? Number(this.tripForm.value.budget) : undefined,
      description: this.tripForm.value.description || undefined
    };

    if (this.isEditMode && this.tripId) {
      this.travelDataService.updateTrip(this.tripId, tripData);
    } else {
      const newTrip = this.travelDataService.addTrip(tripData);
      this.tripId = newTrip.id;
    }

    this.router.navigate(['/trips', this.tripId]);
  }

  cancel() {
    if (this.isEditMode && this.tripId) {
      this.router.navigate(['/trips', this.tripId]);
    } else {
      this.router.navigate(['/trips']);
    }
  }

  get title() { return this.tripForm.get('title'); }
  get destination() { return this.tripForm.get('destination'); }
  get startDate() { return this.tripForm.get('startDate'); }
  get endDate() { return this.tripForm.get('endDate'); }
  get budget() { return this.tripForm.get('budget'); }
}
