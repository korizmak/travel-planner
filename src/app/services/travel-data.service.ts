import { Injectable } from '@angular/core';
import { Trip } from '../models/trip.model';
import { TravelEvent } from '../models/travel-event.model';
import { CostItem } from '../models/cost-item.model';
import { EventType } from '../models/event-type.enum';

@Injectable({
  providedIn: 'root'
})
export class TravelDataService {
  private trips: Trip[] = [
    {
      id: '1',
      title: 'Rome 2026',
      destination: 'Rome, Italy',
      startDate: '2026-06-15',
      endDate: '2026-06-22',
      budget: 2000,
      description: 'Summer vacation in Rome'
    },
    {
      id: '2',
      title: 'Paris Weekend',
      destination: 'Paris, France',
      startDate: '2026-09-10',
      endDate: '2026-09-13',
      budget: 1500,
      description: 'Weekend trip to Paris'
    }
  ];

  private events: TravelEvent[] = [
    {
      id: '1',
      tripId: '1',
      title: 'Hotel Colosseum',
      type: EventType.ACCOMMODATION,
      date: '2026-06-15',
      time: '14:00',
      notes: 'Check-in at 2 PM',
      costs: [
        { title: 'Hotel stay', amount: 560 },
        { title: 'Breakfast', amount: 40 }
      ]
    },
    {
      id: '2',
      tripId: '1',
      title: 'Colosseum Tour',
      type: EventType.SIGHTSEEING,
      date: '2026-06-16',
      time: '10:00',
      notes: 'Guided tour',
      costs: [
        { title: 'Tickets', amount: 18 },
        { title: 'Guide', amount: 50 }
      ]
    },
    {
      id: '3',
      tripId: '2',
      title: 'Flight to Paris',
      type: EventType.TRANSPORT,
      date: '2026-09-10',
      time: '08:00',
      notes: 'Direct flight',
      costs: [
        { title: 'Flight tickets', amount: 350 }
      ]
    }
  ];

  // Trip methods
  getTrips(): Trip[] {
    return [...this.trips];
  }

  getTripById(id: string): Trip | undefined {
    return this.trips.find(trip => trip.id === id);
  }

  addTrip(trip: Omit<Trip, 'id'>): Trip {
    const newTrip: Trip = {
      ...trip,
      id: this.generateId()
    };
    this.trips.push(newTrip);
    return newTrip;
  }

  updateTrip(id: string, trip: Partial<Trip>): Trip | undefined {
    const index = this.trips.findIndex(t => t.id === id);
    if (index !== -1) {
      this.trips[index] = { ...this.trips[index], ...trip };
      return this.trips[index];
    }
    return undefined;
  }

  deleteTrip(id: string): boolean {
    const index = this.trips.findIndex(t => t.id === id);
    if (index !== -1) {
      this.trips.splice(index, 1);
      // Also delete all events for this trip
      this.events = this.events.filter(e => e.tripId !== id);
      return true;
    }
    return false;
  }

  getTripTotalSpent(tripId: string): number {
    const tripEvents = this.events.filter(e => e.tripId === tripId);
    return tripEvents.reduce((total, event) => total + this.getEventTotalCost(event), 0);
  }

  // Event methods
  getEventsByTripId(tripId: string): TravelEvent[] {
    return this.events.filter(event => event.tripId === tripId);
  }

  getEventById(eventId: string): TravelEvent | undefined {
    return this.events.find(event => event.id === eventId);
  }

  addEvent(event: Omit<TravelEvent, 'id'>): TravelEvent {
    const newEvent: TravelEvent = {
      ...event,
      id: this.generateId()
    };
    this.events.push(newEvent);
    return newEvent;
  }

  updateEvent(eventId: string, event: Partial<TravelEvent>): TravelEvent | undefined {
    const index = this.events.findIndex(e => e.id === eventId);
    if (index !== -1) {
      this.events[index] = { ...this.events[index], ...event };
      return this.events[index];
    }
    return undefined;
  }

  deleteEvent(eventId: string): boolean {
    const index = this.events.findIndex(e => e.id === eventId);
    if (index !== -1) {
      this.events.splice(index, 1);
      return true;
    }
    return false;
  }

  getEventTotalCost(event: TravelEvent): number {
    if (!event.costs || event.costs.length === 0) {
      return 0;
    }
    return event.costs.reduce((total, cost) => total + cost.amount, 0);
  }

  // Helper method to generate simple IDs
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
