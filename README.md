# PenguinLogic HSE Dashboard

PenguinLogic HSE Dashboard is an offline-first web application for basic HSE near-miss reporting and risk assessment.

## Features

- Near-miss reporting form
- 5×5 risk matrix
- Automatic risk score calculation
- Risk levels: Low, Medium, High and Critical
- Image and PDF evidence upload
- Search and filter near-miss records
- View stored evidence
- View complete near-miss report
- Print or Save Report as PDF
- Local data storage using IndexedDB
- Offline Progressive Web App (PWA)
- Responsive for desktop and mobile

## Risk Calculation

Risk Score = Likelihood × Severity

| Score | Level |
|---|---|
| 1–4 | Low |
| 5–9 | Medium |
| 10–16 | High |
| 17–25 | Critical |

## Near-Miss Report

Each saved record can generate a structured report containing:

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
- Record creation date

The report can be printed or saved as PDF.

## Technology

- HTML
- CSS
- JavaScript
- IndexedDB
- Service Worker
- Progressive Web App
- GitHub Pages

## Live App

https://penguinlogicworks.github.io/penguinlogic-hse-dashboard/

## Data Storage

All near-miss records are stored locally on the user's device.

No login or cloud database is required.

## Disclaimer

This project is intended for portfolio and demonstration purposes.

It does not replace formal HIRARC, JSA/JHA, HAZOP, incident investigation procedures or an organisation's official HSE management system.

## Author

PenguinLogic
