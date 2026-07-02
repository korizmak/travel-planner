import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonTextarea, IonLabel, IonItem, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { TravelDataService } from '../../services/travel-data.service';
import { TravelEvent } from '../../models/travel-event.model';
import { CostItem } from '../../models/cost-item.model';
import { EventType } from '../../models/event-type.enum';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.page.html',
  styleUrls: ['./event-form.page.scss'],
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
    IonItem,
    IonSelect,
    IonSelectOption
  ]
})
export class EventFormPage implements OnInit {
  eventForm: FormGroup;
  isEditMode = false;
  eventId?: string;
  tripId?: string;

  constructor(
    private fb: FormBuilder,
    private travelDataService: TravelDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      type: [EventType.OTHER, Validators.required],
      date: [''],
      time: [''],
      notes: [''],
      costs: this.fb.array([])
    });
  }

  ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('eventId');
    const tripId = this.route.snapshot.paramMap.get('tripId');
    
    if (eventId) {
      this.isEditMode = true;
      this.eventId = eventId;
      this.loadEvent(eventId);
    } else if (tripId) {
      this.tripId = tripId;
    }
  }

  loadEvent(id: string) {
    const event = this.travelDataService.getEventById(id);
    if (event) {
      this.tripId = event.tripId;
      this.eventForm.patchValue({
        title: event.title,
        type: event.type,
        date: event.date || '',
        time: event.time || '',
        notes: event.notes || ''
      });
      
      // Load costs
      if (event.costs && event.costs.length > 0) {
        const costsArray = this.eventForm.get('costs') as FormArray;
        costsArray.clear();
        event.costs.forEach(cost => {
          costsArray.push(this.createCostItem(cost.title, cost.amount));
        });
      }
    }
  }

  get costsArray(): FormArray {
    return this.eventForm.get('costs') as FormArray;
  }

  createCostItem(title: string = '', amount: number = 0): FormGroup {
    return this.fb.group({
      title: [title, Validators.required],
      amount: [amount, [Validators.required, Validators.min(0.01)]]
    });
  }

  addCostItem() {
    this.costsArray.push(this.createCostItem());
  }

  removeCostItem(index: number) {
    this.costsArray.removeAt(index);
  }

  saveEvent() {
    if (this.eventForm.invalid || !this.tripId) {
      return;
    }

    const costs: CostItem[] = this.costsArray.value.map((cost: any) => ({
      title: cost.title,
      amount: Number(cost.amount)
    }));

    const eventData: Omit<TravelEvent, 'id'> = {
      tripId: this.tripId!,
      title: this.eventForm.value.title,
      type: this.eventForm.value.type,
      date: this.eventForm.value.date || undefined,
      time: this.eventForm.value.time || undefined,
      notes: this.eventForm.value.notes || undefined,
      costs: costs.length > 0 ? costs : undefined
    };

    if (this.isEditMode && this.eventId) {
      this.travelDataService.updateEvent(this.eventId, eventData);
    } else {
      this.travelDataService.addEvent(eventData);
    }

    this.router.navigate(['/trips', this.tripId]);
  }

  cancel() {
    if (this.tripId) {
      this.router.navigate(['/trips', this.tripId]);
    } else {
      this.router.navigate(['/trips']);
    }
  }

  get title() { return this.eventForm.get('title'); }
  get type() { return this.eventForm.get('type'); }

  getEventTypeLabel(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  getEventTypeKeys(): string[] {
    return Object.keys(EventType);
  }
}
