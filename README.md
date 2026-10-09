# PenguinLogic HSE Dashboard

An offline-first Health, Safety & Environment (HSE) near-miss reporting and risk assessment dashboard built as a Progressive Web App (PWA).

The application allows users to record near-miss events, assess risk using a 5×5 risk matrix, attach supporting evidence, review stored records, and generate printable HSE reports.

## Live Demo

https://penguinlogicworks.github.io/penguinlogic-hse-dashboard/

---

## Key Features

- Near-miss incident reporting
- Automatic risk score calculation
- 5×5 HSE risk assessment matrix
- Risk classification:
  - Low: 1–4
  - Medium: 5–9
  - High: 10–16
  - Critical: 17–25
- Dashboard statistics
- Search and filter records
- Supporting evidence upload
  - Images
  - PDF documents
  - Maximum file size: 10 MB
- View individual HSE reports
- Print / Save report as PDF
- Local data storage using IndexedDB
- Offline-capable PWA
- Responsive interface for desktop and mobile devices
- Installable on supported browsers and devices

---

## Risk Calculation

Risk is calculated using:

```text
Risk Score = Likelihood × Severity
