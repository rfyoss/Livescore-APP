# ⚽ LiveScore PnL Cloud 

Real-time football live score platform built with **React, Express.js, Laravel Data Engine, Supabase PostgreSQL, Socket.IO, and Railway Cloud Deployment**.

The system automatically synchronizes football data from API-Football, stores it in a cloud database, processes updates through a data pipeline, and delivers live match information to users through a responsive web application.

# 📖 Overview

This project provides:

* Live football match scores
* Team information
* Player information
* League standings
* Real-time match updates
* Cloud-based deployment architecture

The platform uses a multi-layer architecture consisting of:

1. Data Source Layer
2. Data Engineering Layer
3. Database Layer
4. Backend Service Layer
5. Frontend Presentation Layer

---

# 🏗 System Architecture

```text
┌───────────────────────────┐
│      API Football         │
└─────────────┬─────────────┘
              │
              ▼

┌───────────────────────────┐
│  Laravel Data Engine      │
│                           │
│  - ApiFootballService     │
│  - SyncMatchesJob         │
│  - SyncTeamsJob           │
│  - SyncPlayersJob         │
│  - SyncStandingsJob       │
└─────────────┬─────────────┘
              │
              ▼

┌───────────────────────────┐
│   Supabase PostgreSQL     │
└─────────────┬─────────────┘
              │
              ▼

┌───────────────────────────┐
│ Express.js Backend        │
│                           │
│ - REST API                │
│ - Socket.IO               │
│ - Cache Layer             │
└─────────────┬─────────────┘
              │
              ▼

┌───────────────────────────┐
│ React Frontend            │
└───────────────────────────┘
```

---

# ☁ Cloud Deployment Architecture

```text
                    INTERNET
                         │
                         ▼

┌────────────────────────────────────┐
│           Railway Cloud            │
├────────────────────────────────────┤
│                                    │
│ React Frontend                     │
│ Express Backend                    │
│ Laravel Data Engine                │
│ Scheduler & Queue                  │
│                                    │
└───────────────┬────────────────────┘
                │
                ▼

┌────────────────────────────────────┐
│     Supabase PostgreSQL Cloud      │
└────────────────────────────────────┘
```

---

# 🔄 Data Flow

## Match Synchronization

```text
API Football
      │
      ▼
ApiFootballService
      │
      ▼
SyncMatchesJob
      │
      ▼
Supabase Database
      │
      ▼
Express API
      │
      ▼
Frontend
```

---

## Standings Synchronization

```text
API Football
      │
      ▼
ApiFootballService
      │
      ▼
SyncStandingsJob
      │
      ▼
standings table
```

---

## Team Synchronization

```text
API Football
      │
      ▼
ApiFootballService
      │
      ▼
SyncTeamsJob
      │
      ▼
teams table
```

---

## Player Synchronization

```text
API Football
      │
      ▼
ApiFootballService
      │
      ▼
SyncPlayersJob
      │
      ▼
players table
```

---

# ⚙ Data Engineering Pipeline

The Laravel Data Engine is responsible for automating the synchronization process between API-Football and the cloud database.

### Extract

Retrieve data from API-Football:

* Live Matches
* Teams
* Players
* Standings

### Transform

Normalize and validate:

* Match status
* Team information
* Player information
* League statistics

### Load

Store synchronized data into PostgreSQL using:

```php
updateOrCreate()
```

to prevent duplication and maintain consistency.

---

# ⏰ Automated Scheduler

Laravel Scheduler automatically executes synchronization jobs.

| Job              | Frequency    |
| ---------------- | ------------ |
| SyncMatchesJob   | Every Minute |
| SyncStandingsJob | Hourly       |
| SyncTeamsJob     | Daily        |
| SyncPlayersJob   | Daily        |

---

# 🗄 Database Entities

### Team

```text
Team
├── Players
├── Home Matches
└── Away Matches
```

### Match

```text
Match
├── Home Team
└── Away Team
```

### Standing

```text
Standing
└── Team
```

---

# 🚀 Features

## Live Match Tracking

* Real-time score updates
* Match status monitoring
* Ongoing fixture synchronization

## Team Information

* Team profile
* Club information
* Venue information

## Player Information

* Squad data
* Position
* Nationality

## League Standings

* Current rankings
* Points
* Wins
* Draws
* Losses

---

# 🛠 Technology Stack

### Frontend

* React
* Vite
* TypeScript

### Backend

* Express.js
* Socket.IO
* Node.js

### Data Engineering

* Laravel
* Laravel Scheduler
* Laravel Queue

### Database

* Supabase PostgreSQL

### Cloud Infrastructure

* Railway

### External Services

* API-Football

---

# 👥 Team Responsibilities

## API & Database Engineer

Responsible for:

* API-Football configuration
* Database schema design
* Supabase management

---

## Data Engineer

Responsible for:

* ApiFootballService
* Sync Jobs
* Scheduler
* Data synchronization
* Data validation
* ETL pipeline

---

## Backend Engineer

Responsible for:

* Express API
* Business logic
* Socket.IO
* Cache management

---

## Frontend Engineer

Responsible for:

* React UI
* Dashboard
* Live score pages
* User experience

---

## Cloud Engineer

Responsible for:

* Railway deployment
* Environment variables
* Monitoring
* Infrastructure configuration

---

# 📈 Future Improvements

* Redis distributed caching
* Webhook-based synchronization
* Multi-league support
* Analytics dashboard
* Match prediction module
* Event-driven architecture

