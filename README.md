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

## Development workflow

The project uses Node's built-in test runner so no additional packages are required.

```bash
npm test
```

To create a deployable copy of the static site in `dist/`, run:

```bash
npm run deploy
```
