# Studium

![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=111111)
![Storage](https://img.shields.io/badge/Storage-Local-4F46E5)
![Languages](https://img.shields.io/badge/UI-PT_EN_ES-2563EB)

Browser-based study planner that combines scheduling, focus sessions, habit tracking, retention review, and local progress metrics.

## Features

- Dashboard with study statistics.
- Weekly schedule generated from available hours, subject priority, and workload.
- Configurable Pomodoro focus and break periods.
- Habit tracking.
- Retention and review tools.
- Portuguese, English, and Spanish interface modes.
- Light and dark themes.
- Local import and export.
- PDF report generation through jsPDF.

## Privacy

Studium runs in the browser and stores its working data locally. There is no account system or application backend. Users should export a backup before clearing browser data or moving to another device.

## Run locally

The application is static. Open it through a local HTTP server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Structure

```text
index.html             Application interface
style.css              Responsive presentation and themes
main.js                Bootstrap and shared orchestration
modules/dashboard.js   Study metrics
modules/cronograma.js  Weekly scheduling
modules/pomodoro.js    Focus timer
modules/habitos.js     Habit tracking
modules/retencao.js    Retention review
modules/i18n.js        PT, EN, and ES strings
modules/pdf-report.js  PDF reporting
```

## Runtime dependency

The interface loads jsPDF 2.5.1 from cdnjs for PDF generation. Other application behavior uses browser APIs and local JavaScript modules.

## Limitations

- Data does not synchronize automatically between devices.
- PDF generation requires the external jsPDF script to load.
- The project currently has no automated test suite.

## License

See [LICENSE](LICENSE).
