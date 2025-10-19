const questions = [
  { id: 1, text: "Considerate of other people's feelings.", subscale: 'Prosocial' },
  { id: 2, text: 'Restless, overactive, cannot stay still for long.', subscale: 'Hyperactivity' },
  { id: 3, text: 'Often complains of headaches, stomach-aches or sickness.', subscale: 'Emotional Symptoms' },
  { id: 4, text: 'Shares readily with other children (treats, toys, pencils etc.).', subscale: 'Prosocial' },
  { id: 5, text: 'Often has temper tantrums or hot tempers.', subscale: 'Conduct Problems' },
  { id: 6, text: 'Rather solitary, tends to play alone.', subscale: 'Peer Problems' },
  { id: 7, text: 'Generally obedient, usually does what adults request.', subscale: 'Conduct Problems', reverse: true },
  { id: 8, text: 'Many worries, often seems worried.', subscale: 'Emotional Symptoms' },
  { id: 9, text: 'Helpful if someone is hurt, upset or feeling ill.', subscale: 'Prosocial' },
  { id: 10, text: 'Constantly fidgeting or squirming.', subscale: 'Hyperactivity' },
  { id: 11, text: 'Has at least one good friend.', subscale: 'Peer Problems', reverse: true },
  { id: 12, text: 'Often fights with other children or bullies them.', subscale: 'Conduct Problems' },
  { id: 13, text: 'Often unhappy, down-hearted or tearful.', subscale: 'Emotional Symptoms' },
  { id: 14, text: 'Generally liked by other children.', subscale: 'Peer Problems', reverse: true },
  { id: 15, text: 'Easily distracted, concentration wanders.', subscale: 'Hyperactivity' },
  { id: 16, text: 'Nervous or clingy in new situations, easily loses confidence.', subscale: 'Emotional Symptoms' },
  { id: 17, text: 'Kind to younger children.', subscale: 'Prosocial' },
  { id: 18, text: 'Often lies or cheats.', subscale: 'Conduct Problems' },
  { id: 19, text: 'Picked on or bullied by other children.', subscale: 'Peer Problems' },
  { id: 20, text: 'Often volunteers to help others (parents, teachers, other children).', subscale: 'Prosocial' },
  { id: 21, text: 'Thinks things out before acting.', subscale: 'Hyperactivity', reverse: true },
  { id: 22, text: 'Steals from home, school or elsewhere.', subscale: 'Conduct Problems' },
  { id: 23, text: 'Gets on better with adults than with other children.', subscale: 'Peer Problems' },
  { id: 24, text: 'Many fears, easily scared.', subscale: 'Emotional Symptoms' },
  { id: 25, text: 'Good attention span, sees chores or homework through to the end.', subscale: 'Hyperactivity', reverse: true }
];

const scoringBands = {
  'Emotional Symptoms': {
    normal: [0, 5],
    borderline: [6, 6],
    abnormal: [7, 10]
  },
  'Conduct Problems': {
    normal: [0, 3],
    borderline: [4, 4],
    abnormal: [5, 10]
  },
  Hyperactivity: {
    normal: [0, 5],
    borderline: [6, 6],
    abnormal: [7, 10]
  },
  'Peer Problems': {
    normal: [0, 3],
    borderline: [4, 5],
    abnormal: [6, 10]
  },
  Prosocial: {
    normal: [6, 10],
    borderline: [5, 5],
    abnormal: [0, 4]
  },
  'Total Difficulties': {
    normal: [0, 13],
    borderline: [14, 16],
    abnormal: [17, 40]
  }
};

const responseLabels = [
  { value: 0, label: 'Not true' },
  { value: 1, label: 'Somewhat true' },
  { value: 2, label: 'Certainly true' }
];

const responses = Array(questions.length).fill(null);
let currentQuestionIndex = 0;
let latestResults = null;

const questionCard = document.getElementById('questionCard');
const questionText = document.getElementById('questionText');
const responseForm = document.getElementById('responseForm');
const progressIndicator = document.getElementById('progressIndicator');
const progressFill = document.getElementById('progressFill');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const resultsSection = document.getElementById('resultsSection');
const resultsGrid = document.getElementById('resultsGrid');
const resultsSummary = document.getElementById('resultsSummary');
const exportPdfButton = document.getElementById('exportPdf');
const retakeButton = document.getElementById('retake');

function renderQuestion() {
  const question = questions[currentQuestionIndex];
  questionText.textContent = question.text;
  progressIndicator.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
  progressFill.style.width = `${progressPercent}%`;

  responseForm.innerHTML = '';
  responseLabels.forEach(({ value, label }) => {
    const optionId = `question-${question.id}-option-${value}`;
    const wrapper = document.createElement('label');
    wrapper.className = 'response-option';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'response';
    input.value = value;
    input.id = optionId;
    input.checked = responses[currentQuestionIndex] === value;

    input.addEventListener('change', () => {
      responses[currentQuestionIndex] = value;
      updateNavigationState();
    });

    const span = document.createElement('span');
    span.textContent = label;

    wrapper.appendChild(input);
    wrapper.appendChild(span);
    responseForm.appendChild(wrapper);
  });

  updateNavigationState();
}

function updateNavigationState() {
  prevButton.disabled = currentQuestionIndex === 0;
  const hasResponse = responses[currentQuestionIndex] !== null;
  nextButton.disabled = !hasResponse;
  nextButton.textContent =
    currentQuestionIndex === questions.length - 1 ? 'Generate Results' : 'Next';
}

function goToQuestion(index) {
  currentQuestionIndex = index;
  renderQuestion();
  questionCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function calculateScores() {
  const subscaleTotals = {
    'Emotional Symptoms': 0,
    'Conduct Problems': 0,
    Hyperactivity: 0,
    'Peer Problems': 0,
    Prosocial: 0
  };

  questions.forEach((question, index) => {
    const responseValue = responses[index];
    if (responseValue === null || responseValue === undefined) {
      throw new Error(`Missing response for question ${index + 1}`);
    }
    const adjustedScore = question.reverse ? 2 - responseValue : responseValue;
    subscaleTotals[question.subscale] += adjustedScore;
  });

  const totalDifficulties =
    subscaleTotals['Emotional Symptoms'] +
    subscaleTotals['Conduct Problems'] +
    subscaleTotals['Hyperactivity'] +
    subscaleTotals['Peer Problems'];

  return { ...subscaleTotals, 'Total Difficulties': totalDifficulties };
}

function classifyScore(subscale, value) {
  const bands = scoringBands[subscale];
  if (!bands) return { label: 'N/A', key: 'normal' };

  if (value >= bands.normal[0] && value <= bands.normal[1]) {
    return { label: 'Normal', key: 'normal' };
  }
  if (value >= bands.borderline[0] && value <= bands.borderline[1]) {
    return { label: 'Borderline', key: 'borderline' };
  }
  return { label: 'Abnormal', key: 'abnormal' };
}

function buildResultsCards(scores) {
  resultsGrid.innerHTML = '';
  Object.entries(scores).forEach(([subscale, value]) => {
    const classification = classifyScore(subscale, value);
    const card = document.createElement('article');
    card.className = 'score-card';

    const title = document.createElement('h3');
    title.className = 'score-card__title';
    title.textContent = subscale;

    const scoreValue = document.createElement('p');
    scoreValue.className = 'score-card__value';
    scoreValue.textContent = value;

    const tag = document.createElement('span');
    tag.className = `score-card__tag score-card__tag--${classification.key}`;
    tag.textContent = classification.label;

    card.appendChild(title);
    card.appendChild(scoreValue);
    card.appendChild(tag);

    resultsGrid.appendChild(card);
  });
}

function buildSummary(scores) {
  const difficultiesSubscales = ['Emotional Symptoms', 'Conduct Problems', 'Hyperactivity', 'Peer Problems'];
  const alerts = [];

  difficultiesSubscales.forEach((subscale) => {
    const classification = classifyScore(subscale, scores[subscale]);
    if (classification.key !== 'normal') {
      alerts.push(`${subscale} score (${scores[subscale]}) is in the ${classification.label.toLowerCase()} range.`);
    }
  });

  const totalClassification = classifyScore('Total Difficulties', scores['Total Difficulties']);
  const prosocialClassification = classifyScore('Prosocial', scores['Prosocial']);

  let summary = `The Total Difficulties score is ${scores['Total Difficulties']}, which falls within the ${totalClassification.label.toLowerCase()} band.`;

  if (alerts.length > 0) {
    summary += ` Key areas for follow up: ${alerts.join(' ')}`;
  } else {
    summary += ' No individual difficulty subscale scored in the borderline or abnormal range.';
  }

  if (prosocialClassification.key === 'abnormal') {
    summary += ' Prosocial behaviours are markedly below expectations; consider supports that build empathy and cooperative play.';
  } else if (prosocialClassification.key === 'borderline') {
    summary += ' Prosocial skills are slightly below typical levels and may benefit from targeted encouragement.';
  } else {
    summary += ' Prosocial strengths are within the expected range.';
  }

  return summary;
}

function generateResults() {
  try {
    const scores = calculateScores();
    buildResultsCards(scores);
    const summary = buildSummary(scores);
    resultsSummary.textContent = summary;
    latestResults = { scores, summary };
    questionCard.hidden = true;
    resultsSection.hidden = false;
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    alert(error.message);
  }
}

function resetAssessment() {
  responses.fill(null);
  currentQuestionIndex = 0;
  latestResults = null;
  resultsSection.hidden = true;
  questionCard.hidden = false;
  renderQuestion();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function exportResultsAsPdf() {
  if (!latestResults) {
    alert('Please complete the questionnaire and generate results before exporting.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt' });
  const margin = 48;
  let cursorY = margin;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Strengths and Difficulties Questionnaire (SDQ) Results', margin, cursorY);

  cursorY += 32;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const wrapSummary = doc.splitTextToSize(latestResults.summary, doc.internal.pageSize.getWidth() - margin * 2);
  doc.text(wrapSummary, margin, cursorY);

  cursorY += wrapSummary.length * 16 + 12;

  Object.entries(latestResults.scores).forEach(([subscale, value]) => {
    if (cursorY > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      cursorY = margin;
    }
    const classification = classifyScore(subscale, value);
    doc.setFont('helvetica', 'bold');
    doc.text(`${subscale}`, margin, cursorY);
    cursorY += 18;
    doc.setFont('helvetica', 'normal');
    doc.text(`Score: ${value} (${classification.label})`, margin, cursorY);
    cursorY += 22;
  });

  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text('Banding based on UK SDQ scoring guidance (ages 4-17).', margin, doc.internal.pageSize.getHeight() - margin + 20);

  doc.save('sdq-results.pdf');
}

prevButton.addEventListener('click', () => {
  if (currentQuestionIndex > 0) {
    goToQuestion(currentQuestionIndex - 1);
  }
});

nextButton.addEventListener('click', () => {
  if (responses[currentQuestionIndex] === null) {
    return;
  }

  if (currentQuestionIndex === questions.length - 1) {
    if (responses.some((response) => response === null)) {
      alert('Please answer all questions before generating results.');
      return;
    }
    generateResults();
  } else {
    goToQuestion(currentQuestionIndex + 1);
  }
});

retakeButton.addEventListener('click', resetAssessment);
exportPdfButton.addEventListener('click', exportResultsAsPdf);

renderQuestion();

// Auto-fill date field with today's date
document.addEventListener("DOMContentLoaded", () => {
  const dateField = document.getElementById("date");
  if (dateField && !dateField.value) {
    const today = new Date().toISOString().split("T")[0];
    dateField.value = today;
  }
});
