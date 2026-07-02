# TravelMate

TravelMate is a mobile application for travel planning and expense tracking, developed with Ionic Framework and Angular.

## Project Description

The application allows users to create trips and organize each trip through travel events. A travel event can represent accommodation, transport, sightseeing, food, entertainment, or any other planned part of the trip.

For each travel event, the user can enter basic information and add simple cost items. This allows the user to plan a trip and track the total amount spent for each event and for the whole trip.

**Note:** This is an MVP implementation using in-memory mock data. No backend or database integration is included in this version.

## Technologies

- Ionic Framework 8.x
- Angular 22
- TypeScript
- HTML
- SCSS

## Main Features

- Display all trips
- Add a new trip
- Display trip details
- Edit an existing trip
- Delete a trip
- Add travel events within a trip
- Display events for a selected trip
- Edit and delete travel events
- Add cost items within a travel event
- Display total cost per event
- Display total cost per trip
- Compare planned budget with total expenses

## Data Model

### Trip

```ts
export interface Trip {
  id?: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget?: number;
  description?: string;
}
```

### TravelEvent

```ts
export interface TravelEvent {
  id?: string;
  tripId: string;
  title: string;
  type: EventType;
  date?: string;
  time?: string;
  notes?: string;
  costs?: CostItem[];
}
```

### CostItem

```ts
export interface CostItem {
  title: string;
  amount: number;
}
```

### EventType

```ts
export enum EventType {
  ACCOMMODATION = 'accommodation',
  TRANSPORT = 'transport',
  SIGHTSEEING = 'sightseeing',
  FOOD = 'food',
  ENTERTAINMENT = 'entertainment',
  OTHER = 'other'
}
```

## Project Structure

```
src/app/
├── models/
│   ├── event-type.enum.ts
│   ├── cost-item.model.ts
│   ├── travel-event.model.ts
│   └── trip.model.ts
├── services/
│   └── travel-data.service.ts
├── pages/
│   ├── trips/
│   ├── trip-form/
│   ├── trip-details/
│   └── event-form/
├── app.config.ts
├── app.routes.ts
├── app.ts
└── app.html
```

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

```bash
npm install
```

### Development Server

```bash
npm start
```

The application will open in your browser at `http://localhost:4200/`.

## Usage

1. **View Trips**: The home page displays all your trips with basic information and total spent amounts.
2. **Add Trip**: Click the FAB button to create a new trip with title, destination, dates, budget, and description.
3. **Trip Details**: Click on a trip card to view details, events list, and budget summary.
4. **Edit/Delete Trip**: Use the buttons in the trip details page to edit or delete a trip.
5. **Add Event**: Click "Add Event" in trip details to create a new travel event with cost items.
6. **Edit/Delete Event**: Click on an event to edit it, or use the delete button to remove it.
7. **Cost Tracking**: Add multiple cost items to each event to track expenses accurately.