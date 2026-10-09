# PenguinLogic HSE Dashboard

A lightweight, offline-first **Health, Safety & Environment (HSE) Near-Miss Reporting and Risk Assessment Dashboard** built as a Progressive Web App (PWA).

PenguinLogic HSE Dashboard allows users to record near-miss events, assess risk using a 5×5 risk matrix, attach supporting evidence, review locally stored records, and generate printable HSE reports.

The project was developed as a practical technical portfolio project combining **HSE risk assessment principles, frontend web development, local browser storage, responsive design, and Progressive Web App technology**.

---

## Live Application

**PenguinLogic HSE Dashboard**

https://penguinlogicworks.github.io/penguinlogic-hse-dashboard/

---

## Key Features

### Near-Miss Reporting

Users can create a near-miss record containing:

- Date
- Area
- Hazard Category
- Likelihood
- Severity
- Near-Miss Description
- Potential Consequence
- Immediate Action Taken
- Supporting Evidence

---

### Automatic Risk Assessment

The application automatically calculates the risk score based on:

```text
Risk Score = Likelihood × Severity
```

Likelihood and Severity are each rated from **1 to 5**.

The resulting score is automatically categorized into the appropriate risk level.

| Risk Score | Risk Level |
|---:|---|
| 1–4 | Low |
| 5–9 | Medium |
| 10–16 | High |
| 17–25 | Critical |

---

### 5×5 Risk Matrix

A visual 5×5 risk matrix is included in the dashboard.

The matrix helps users understand the relationship between:

- Likelihood
- Severity
- Overall Risk Score
- Risk Level

The currently selected risk score is automatically highlighted on the matrix.

---

### Dashboard Statistics

The dashboard provides a quick overview of stored HSE records, including:

- Total Records
- High / Critical Records
- Average Risk Score
- Top Hazard Category

Statistics are calculated directly from locally stored near-miss records.

---

### Supporting Evidence

Users can attach supporting evidence to a near-miss record.

Supported evidence includes:

- Image files
- PDF documents

Maximum supported file size:

```text
10 MB
```

Evidence is stored locally together with the associated near-miss record.

---

### Near-Miss Records Table

Saved records are displayed in a structured table.

Users can:

- Review previous records
- Search records
- Filter records
- View supporting evidence
- Open a formatted HSE report
- Delete records

---

### Search and Filtering

The Near-Miss Records section includes search and filtering functions to make stored records easier to review.

Users can search or filter records based on available record information such as:

- Area
- Hazard Category
- Risk Level
- Other record information

---

### HSE Report View

Each saved record can be opened as a formatted **Near-Miss Report**.

The report contains:

1. Report Information
2. Risk Assessment
3. Near-Miss Description
4. Potential Consequence
5. Immediate Action Taken
6. Supporting Evidence
7. Record Information

Each report also includes a generated report number.

Example:

```text
NM-20261010-0008
```

---

### Print / Save as PDF

Near-miss reports can be printed directly using the browser's native print function.

Users can also select:

```text
Print / Save PDF
```

to save the report as a PDF document.

The print layout is optimized for A4 output and includes:

- PenguinLogic HSE branding
- Report number
- Event type
- Risk information
- Near-miss details
- Supporting evidence
- Record creation information

---

## Risk Assessment Method

The dashboard uses a simple 5×5 risk assessment method.

### Likelihood

| Rating | Description |
|---:|---|
| 1 | Rare |
| 2 | Unlikely |
| 3 | Possible |
| 4 | Likely |
| 5 | Almost Certain |

### Severity

| Rating | Description |
|---:|---|
| 1 | Insignificant |
| 2 | Minor |
| 3 | Moderate |
| 4 | Major |
| 5 | Catastrophic |

### Example

If:

```text
Likelihood = 4
Severity = 5
```

Then:

```text
Risk Score = 4 × 5
Risk Score = 20
Risk Level = Critical
```

---

## Local-First Data Storage

PenguinLogic HSE Dashboard uses **IndexedDB** to store near-miss records directly in the user's browser.

No external database is required.

This means:

- No user account is required
- No login is required
- No backend server is required
- No cloud database is required
- Records remain on the browser/device where they were created
- Supporting evidence is also stored locally
- The application can continue to access locally stored records without a remote database

---

## Important Data Storage Notice

Records are stored locally in the browser.

Therefore:

- Records do not automatically synchronize between devices
- Different browsers may have different records
- Different browser profiles may have different records
- Reinstalling or changing browsers does not guarantee that records will transfer
- Clearing browser storage may permanently remove stored records

> **Important:** Clearing site data, IndexedDB, browser storage, or application storage may permanently delete locally stored HSE records and supporting evidence.

Important reports should be saved separately as PDF where appropriate.

---

## Offline Capability

PenguinLogic HSE Dashboard includes a **Service Worker** that caches the core application files.

This allows the application to provide offline functionality after the required files have been cached by the browser.

Core cached files include:

- `index.html`
- `style.css`
- `app.js`
- `db.js`
- `manifest.json`

Application icons are also available for supported PWA environments.

---

## Progressive Web App

PenguinLogic HSE Dashboard is designed as a Progressive Web App.

On supported browsers and operating systems, users may install the dashboard for a more app-like experience.

PWA functionality includes:

- Standalone application display
- Home-screen / application launcher access
- Application icons
- Offline-capable core interface
- Responsive mobile layout

PWA installation behaviour may vary depending on:

- Browser
- Operating system
- Device
- Browser version
- PWA support provided by the platform

---

## Responsive Design

The dashboard is designed to adapt to different screen sizes.

The interface includes responsive layouts for:

- Desktop
- Laptop
- Tablet
- Mobile devices

Mobile-specific adjustments are included for:

- Dashboard cards
- Forms
- Filters
- Risk matrix
- Near-miss report
- Report toolbar
- Safe-area spacing
- Installed PWA environments

---

## iOS Support

The interface includes mobile safe-area handling for devices that use:

- Display notches
- Dynamic Island
- Home indicator areas

The report interface also includes a dedicated **Back** control to improve navigation when the dashboard is opened as an installed web application.

---

## Technology Stack

The project is built using:

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

No frontend framework is required.

No backend framework is required.

No external database is required.

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

### File Overview

| File | Purpose |
|---|---|
| `index.html` | Main application structure and user interface |
| `style.css` | Application, responsive, report, and print styling |
| `app.js` | Main dashboard functionality and user interaction |
| `db.js` | IndexedDB database functions |
| `manifest.json` | PWA configuration |
| `service-worker.js` | Offline caching and service worker logic |
| `README.md` | Project documentation |
| `icons/` | PWA application icons |

---

## How to Use

### 1. Open the Dashboard

Open:

https://penguinlogicworks.github.io/penguinlogic-hse-dashboard/

---

### 2. Create a Near-Miss Record

Complete the Near-Miss Reporting form.

Enter:

- Date
- Area
- Hazard Category
- Likelihood
- Severity
- Description
- Potential Consequence
- Immediate Action Taken

---

### 3. Review the Risk Assessment

After selecting Likelihood and Severity, the dashboard automatically calculates:

```text
Risk Score
Risk Level
```

The corresponding position on the 5×5 Risk Matrix is also highlighted.

---

### 4. Add Supporting Evidence

Supporting evidence can be attached where required.

Supported formats include:

- Images
- PDF documents

Maximum file size:

```text
10 MB
```

---

### 5. Save the Record

Submit the form to save the near-miss record locally.

The new record will appear in the Near-Miss Records table.

---

### 6. Review Stored Records

Use the Near-Miss Records section to:

- Search
- Filter
- Review records
- View evidence
- Open reports
- Delete records

---

### 7. View the HSE Report

Select:

```text
View Report
```

to open the formatted Near-Miss Report.

---

### 8. Print or Save the Report

Inside the report, select:

```text
Print / Save PDF
```

Then use the browser's print interface to:

- Print the report
- Save the report as PDF

---

## Installation

### Desktop / Android

On supported browsers, open the live dashboard and use the browser's available installation option.

Depending on the browser, the option may appear as:

```text
Install
```

or another PWA installation option.

---

### iPhone / iPad

Open the dashboard in Safari.

Use the browser sharing options and add the application to the Home Screen where supported.

PWA behaviour on iOS may differ from Android or desktop browsers.

---

## Privacy

PenguinLogic HSE Dashboard does not require:

- User registration
- User authentication
- A remote database
- A cloud account

HSE records are stored locally using browser storage.

The current version does not automatically transmit locally stored HSE records to a remote PenguinLogic database.

Users remain responsible for managing their own locally stored records and exported reports.

---

## Current Limitations

The current version does not include:

- Cloud synchronization
- Multi-device synchronization
- User accounts
- User authentication
- Multi-user collaboration
- Centralized organization database
- Record editing after submission
- Automatic cloud backup
- CSV export
- Data restore function
- Corrective action workflow
- Incident investigation workflow
- Approval workflow
- Role-based access control

Because the application is local-first, records created on one browser or device will not automatically appear on another browser or device.

---

## Future Improvements

Potential future improvements may include:

- Edit existing records
- CSV export
- JSON backup and restore
- Record import
- Dashboard charts
- Risk trend analysis
- Hazard trend analysis
- Area-based analytics
- Corrective action tracking
- Action owner assignment
- Due-date tracking
- Investigation workflow
- Root-cause analysis
- Record status tracking
- Report approval workflow
- Cloud synchronization
- Multi-user access
- Role-based permissions
- Centralized database support
- Organization-level dashboards

These features are not part of the current version unless implemented in a future release.

---

## Design Approach

The project follows a lightweight architecture.

### Frontend

The interface is built using:

```text
HTML
CSS
Vanilla JavaScript
```

### Data Storage

Local records are stored using:

```text
IndexedDB
```

### Offline Support

Offline functionality is provided using:

```text
Service Worker
```

### Installation

PWA configuration is provided through:

```text
manifest.json
```

### Hosting

The application is deployed using:

```text
GitHub Pages
```

---

## Why This Project Was Built

PenguinLogic HSE Dashboard was created as a technical portfolio project demonstrating the practical application of:

- HSE principles
- Near-miss reporting
- Risk assessment
- Hazard classification
- 5×5 risk matrices
- Frontend development
- Browser-based databases
- Responsive web design
- Offline-first application design
- Progressive Web App development
- Technical documentation
- Git and GitHub workflow

The project combines safety-related domain knowledge with practical web application development.

---

## Intended Use

The dashboard may be useful as a lightweight demonstration tool for environments such as:

- Aviation
- Aircraft maintenance
- Hangars
- Workshops
- Marine operations
- Offshore operations
- Onshore operations
- Industrial facilities
- Laboratories
- Maintenance environments
- General workplace HSE activities

The application's risk assessment configuration should not automatically be assumed to match every organization's approved risk matrix or HSE procedure.

---

## Disclaimer

PenguinLogic HSE Dashboard is intended for:

- Educational purposes
- Technical portfolio demonstration
- General HSE record-management demonstration
- Near-miss reporting demonstration
- Risk assessment demonstration

It is **not intended to replace**:

- An organization's approved HSE Management System
- Official incident reporting systems
- Statutory reporting requirements
- Legal reporting obligations
- Approved organizational risk assessment procedures
- Formal incident investigations
- Emergency response procedures
- Professional HSE judgement

Organizations should follow their own approved procedures, legal requirements, risk matrices, and reporting systems.

---

## Project Status

**Current Status:** Active Development / Portfolio Project

Current core functionality includes:

- Near-miss reporting
- Automatic risk calculation
- 5×5 risk matrix
- Local record storage
- Evidence attachment
- Search and filtering
- HSE report generation
- Print / Save PDF
- Responsive design
- PWA support
- Offline-capable core application

---

## Author

### PenguinLogic

Technical portfolio projects focused on practical applications of:

- Safety
- HSE
- Research
- Data
- Technology
- Web-based tools

---

## License / Usage

This repository is currently maintained as a personal technical portfolio project.

Unless a separate license is added to the repository, the presence of source code in this public repository should not automatically be interpreted as granting unrestricted reuse, redistribution, or commercial licensing rights.

---

**PenguinLogic HSE Dashboard**  
*Near-Miss Reporting & Risk Assessment*
