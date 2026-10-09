# PenguinLogic HSE Dashboard

> **Version 1 — Completed**
>
> Development of this version has been completed and the project is now maintained as the original version of the PenguinLogic HSE platform.
>
> A next-generation system is planned as **PenguinLogic HSE Management System (Version 2)**, expanding the concept into integrated HSE reporting, risk assessment, investigation, corrective action, analytics, and action management.

---

## About Version 1

**PenguinLogic HSE Dashboard** is an offline-first Progressive Web App (PWA) developed for basic HSE near-miss reporting and risk assessment.

Version 1 focuses on a simple workflow:

```text
Near Miss
    ↓
Risk Assessment
    ↓
Supporting Evidence
    ↓
Record Storage
    ↓
HSE Report
```

The project demonstrates how a lightweight browser-based application can support basic HSE record management without requiring a backend server, cloud database, or user account.

---

## Project Status

| Item | Status |
|---|---|
| Version | 1 |
| Development | Completed |
| Maintenance | Frozen / Essential fixes only |
| Hosting | GitHub Pages |
| Data Model | Local-first |
| Successor | PenguinLogic HSE Management System |
| Successor Version | Version 2 |

Version 1 will remain available as a standalone portfolio project and as the technical foundation for selected components used in Version 2.

No major new modules are planned for this repository.

---

## Live Application

**PenguinLogic HSE Dashboard**

https://penguinlogicworks.github.io/penguinlogic-hse-dashboard/

---

## Core Features

### Near-Miss Reporting

Users can create near-miss records containing:

- Date
- Area
- Hazard category
- Likelihood
- Severity
- Near-miss description
- Potential consequence
- Immediate action taken
- Supporting evidence

---

### Risk Assessment

Risk is calculated automatically using:

```text
Risk Score = Likelihood × Severity
```

Likelihood and Severity are rated from **1 to 5**.

| Risk Score | Risk Level |
|---:|---|
| 1–4 | Low |
| 5–9 | Medium |
| 10–16 | High |
| 17–25 | Critical |

The selected risk is also highlighted on a visual **5×5 Risk Matrix**.

---

## Dashboard

The dashboard provides a simple overview of locally stored near-miss records.

Current indicators include:

- Total Records
- High / Critical Records
- Average Risk Score
- Top Hazard Category

---

## Near-Miss Records

Saved records are displayed in a searchable and filterable records table.

Users can:

- Review previous records
- Search records
- Filter records
- View supporting evidence
- Open a complete near-miss report
- Delete records

---

## Supporting Evidence

Version 1 supports evidence attachment for near-miss records.

Supported evidence includes:

- Image files
- PDF documents

Maximum file size:

```text
10 MB
```

Evidence is stored locally with the associated record.

An in-app evidence viewer is provided to reduce reliance on external browser windows.

---

## HSE Report

Each saved near-miss record can generate a structured report containing:

- Report number
- Date
- Area
- Hazard category
- Likelihood
- Severity
- Risk score
- Risk level
- Near-miss description
- Potential consequence
- Immediate action taken
- Supporting evidence
- Record creation date and time

Example report number:

```text
NM-20261010-0001
```

---

## Print / Save PDF

Reports can be printed using the browser's native print function.

Users can also save the report as PDF.

The print layout includes:

- PenguinLogic HSE branding
- Report identification
- Risk assessment
- Near-miss information
- Immediate action
- Supporting evidence
- Record information

Print behaviour has been optimized for supported desktop, Android, and iOS browser/PWA environments.

Actual print controls and browser-generated headers or footers may vary by browser and operating system.

---

## Local-First Storage

Version 1 uses **IndexedDB** for local record storage.

This means:

- No user account is required
- No login is required
- No remote database is required
- Records remain on the browser/device where they were created
- Evidence remains associated with the locally stored record
- Different browsers or browser profiles may contain different records
- Records do not automatically synchronize between devices

> **Important:** Clearing browser site data, IndexedDB, or application storage may permanently delete locally stored records and evidence.

Important reports should be exported or saved separately where appropriate.

---

## Offline Capability

The application includes a **Service Worker** for offline-capable access to its core application files.

Core application assets include:

```text
index.html
style.css
app.js
db.js
manifest.json
service-worker.js
```

The application is designed to continue functioning locally after required application resources have been cached.

---

## Progressive Web App

PenguinLogic HSE Dashboard includes Progressive Web App functionality.

On supported browsers and devices, the application may be installed for a more app-like experience.

PWA features include:

- Standalone display
- Application icons
- Offline-capable core interface
- Responsive layout
- Mobile safe-area support

Installation behaviour varies between browsers, devices, and operating systems.

---

## Technology Stack

Version 1 was developed using:

- HTML5
- CSS3
- Vanilla JavaScript
- IndexedDB
- Service Worker
- Web App Manifest
- Progressive Web App technology
- Git
- GitHub
- GitHub Pages

The project does not require:

- A frontend framework
- A backend framework
- A cloud database
- User authentication

---

## Project Structure

```text
penguinlogic-hse-dashboard/
│
├── index.html
├── style.css
├── app.js
├── db.js
├── manifest.json
├── service-worker.js
├── README.md
│
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

---

## Version 1 Scope

Version 1 was intentionally kept focused on:

```text
Near-Miss Reporting
        ↓
Risk Rating
        ↓
Evidence
        ↓
Local Record Storage
        ↓
Report Generation
```

It does **not** attempt to provide a complete organizational HSE Management System.

---

## Current Limitations

Version 1 does not include:

- Incident management
- Hazard / safety observation management
- Root cause analysis
- Corrective Action / CAPA tracking
- PIC assignment
- Due-date tracking
- Overdue action management
- Verification workflow
- Multi-user access
- User authentication
- Cloud synchronization
- Centralized database
- Record editing
- CSV export
- Inspection management
- Audit management
- Training management
- HIRARC / JSA
- Permit to Work
- Document control

These functions are outside the intended scope of Version 1.

---

# Project Evolution

PenguinLogic HSE Dashboard Version 1 established the initial technical foundation for the wider PenguinLogic HSE concept.

Selected concepts proven in Version 1 will inform the development of Version 2.

These include:

- 5×5 risk matrix
- Likelihood × Severity calculation
- Low / Medium / High / Critical classification
- Offline-first architecture
- IndexedDB storage
- Progressive Web App structure
- Service Worker support
- Evidence attachment
- Image and PDF handling
- In-app evidence viewing
- HSE report generation
- A4 print layout
- PDF export workflow
- Search and filtering
- Responsive design
- Mobile safe-area handling
- PenguinLogic visual identity

---

# Successor

## PenguinLogic HSE Management System

**Version 2**

Version 2 is planned as a broader integrated HSE management application.

Its core scope is expected to include:

```text
Dashboard

Reporting
├── Hazard / Safety Observation
├── Near Miss
└── Incident

Risk & Investigation
├── Risk Assessment
├── Investigation
└── Root Cause Analysis

Action Management
├── Corrective Action / CAPA
└── Action Tracker

Insights
├── Analytics
└── Reports

Administration
├── People
└── Settings
```

The intended core workflow is:

```text
Report
   ↓
Risk Assessment
   ↓
Investigation
   ↓
Root Cause
   ↓
Corrective Action
   ↓
PIC + Due Date
   ↓
Verification
   ↓
Closure
```

Version 2 will be developed as a **separate project and repository** rather than extending the Version 1 codebase indefinitely.

This allows Version 1 to remain a stable record of the original PenguinLogic HSE Dashboard.

---

## Future Industry Extensions

The Version 2 architecture may later support industry-specific extensions.

Examples include:

### Aviation

- FOD
- Ramp Safety
- GSE
- Aircraft Ground Damage
- Jet Blast
- Fuel Spill
- Tool Control

### Offshore / Marine

- Permit to Work
- Work at Height
- Confined Space
- Lifting Operations
- Dropped Objects
- Marine Transfer
- Fatigue
- SIMOPS

These modules are not part of Version 1.

---

## Purpose

PenguinLogic HSE Dashboard Version 1 was developed as a technical portfolio project demonstrating practical application of:

- Health, Safety & Environment principles
- Near-miss reporting
- Risk assessment
- Hazard categorization
- Frontend development
- Browser-based data storage
- Responsive web design
- Offline-first architecture
- Progressive Web App development
- Technical documentation
- Git and GitHub workflow

---

## Disclaimer

PenguinLogic HSE Dashboard Version 1 is intended for:

- Educational purposes
- Technical portfolio demonstration
- Near-miss reporting demonstration
- Risk assessment demonstration
- General HSE record-management demonstration

It is **not a replacement for**:

- An organization's approved HSE Management System
- Statutory reporting requirements
- Official incident reporting systems
- Formal incident investigations
- Approved organizational risk assessment procedures
- HIRARC
- JSA / JHA
- HAZOP
- Emergency response procedures
- Professional HSE judgement

Organizations should follow their own approved procedures, legal obligations, reporting systems, and risk assessment methodologies.

---

## Author

**PenguinLogic**

Independent technical portfolio focused on practical applications of:

- Health, Safety & Environment
- Safety-focused digital tools
- Research and technical analysis
- Data-driven problem solving
- Web-based applications

GitHub:

https://github.com/penguinlogicworks

---

## Repository Status

**PenguinLogic HSE Dashboard — Version 1**

```text
STATUS: COMPLETED
MAJOR DEVELOPMENT: CLOSED
MAINTENANCE: ESSENTIAL FIXES ONLY
SUCCESSOR: PENGUINLOGIC HSE MANAGEMENT SYSTEM — VERSION 2
```

---

**PenguinLogic HSE Dashboard**  
*Version 1 — Near-Miss Reporting & Risk Assessment*
