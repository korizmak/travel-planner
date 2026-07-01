# TravelMate

TravelMate is a mobile application for travel planning and expense tracking, developed with Ionic Framework and Angular.

## Project Description

The application allows users to create trips and organize each trip through travel events. A travel event can represent accommodation, transport, sightseeing, a restaurant, a theatre visit, an excursion, or any other planned part of the trip.

For each travel event, the user can enter basic information and add simple cost items. This allows the user to plan a trip and track the total amount spent for each event and for the whole trip.

The application uses Firebase Realtime Database for data storage. Communication between the mobile application and the database is implemented through REST API calls.

## Technologies

- Ionic Framework
- Angular
- TypeScript
- Firebase Realtime Database
- REST API
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