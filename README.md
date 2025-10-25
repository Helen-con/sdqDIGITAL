# SDQ Digital Assessment

This project provides a browser-based version of the Strengths and Difficulties Questionnaire (SDQ).
It guides the assessor through each of the 25 SDQ items one at a time, calculates subscale and total
difficulties scores, and generates an interpretation with an option to export the results as a PDF.
The app now supports all three SDQ informant versions: parent/carer, teacher, and self-report for
young people aged 11–17.

## Features

- Responsive single-question flow with progress tracking
- Automatic scoring for all SDQ subscales, including Total Difficulties
- Narrative interpretation highlighting areas that fall outside the normal band
- Exportable PDF report summarising scores and findings
- Ability to restart the assessment and capture a fresh set of responses
- Built-in scoring bands for parent/carer, teacher, and self-report questionnaires

## Getting started

1. Open `index.html` in a modern web browser.
2. Enter optional metadata (identifier, date) and choose the SDQ questionnaire version.
3. Answer each question sequentially. The **Generate Results** button appears on the final item.
4. Review the calculated scores and findings tailored to the selected informant version.
5. Optionally export the summary as a PDF or start again to capture new responses.

> **Note:** Scoring bands reflect the UK SDQ guidance for ages 4–17. The digital tool supports
screening and discussion but does not replace clinical judgement.

## PDF Export

The PDF export feature requires access to the jsPDF library from CDN. If you're using the application
in an environment with strict content security policies or offline, you may need to:

1. Download jsPDF locally and update the script source in `index.html`, or
2. Use your browser's print function (Ctrl+P or Cmd+P) to save the results page as a PDF

## Sharing with Clients

To share the SDQ assessment with clients for completion:

1. Host the files on a web server (the application is static HTML/CSS/JS)
2. Share the URL with clients
3. Clients complete the questionnaire and can view/export their results
4. Results are displayed on-screen and can be shared via:
   - Screenshot
   - Browser print to PDF
   - PDF export button (when jsPDF is available)

> **Privacy Note:** This is a client-side only application. No assessment data is sent to any server.
All responses and results remain on the user's device. Note: The PDF export feature loads the jsPDF
library from a CDN, which involves an external network request. For maximum privacy, download jsPDF
locally or use browser print instead.
