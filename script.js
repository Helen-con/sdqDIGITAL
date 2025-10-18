const questions = [
  { id: 1, text: "Considerate of other people's feelings", subscale: 'prosocial' },
  { id: 2, text: 'Restless, overactive, cannot stay still for long', subscale: 'hyperactivity' },
  { id: 3, text: 'Often complains of headaches, stomach-aches or sickness', subscale: 'emotional' },
  { id: 4, text: 'Shares readily with other children (treats, toys, pencils etc.)', subscale: 'prosocial' },
  { id: 5, text: 'Often has temper tantrums or hot tempers', subscale: 'conduct' },
  { id: 6, text: 'Rather solitary, tends to play alone', subscale: 'peer' },
  { id: 7, text: 'Generally obedient, usually does what adults request', subscale: 'conduct', reverse: true },
  { id: 8, text: 'Many worries, or often seems worried', subscale: 'emotional' },
  { id: 9, text: 'Helpful if someone is hurt, upset or feeling ill', subscale: 'prosocial' },
  { id: 10, text: 'Constantly fidgeting or squirming', subscale: 'hyperactivity' },
  { id: 11, text: 'Has at least one good friend', subscale: 'peer', reverse: true },
  { id: 12, text: 'Often fights with other children or bullies them', subscale: 'conduct' },
  { id: 13, text: 'Often unhappy, depressed or tearful', subscale: 'emotional' },
  { id: 14, text: 'Generally liked by other children', subscale: 'peer', reverse: true },
  { id: 15, text: 'Easily distracted, concentration wanders', subscale: 'hyperactivity' },
  { id: 16, text: 'Nervous or clingy in new situations, easily loses confidence', subscale: 'emotional' },
  { id: 17, text: 'Kind to younger children', subscale: 'prosocial' },
  { id: 18, text: 'Often lies or cheats', subscale: 'conduct' },
  { id: 19, text: 'Picked on or bullied by other children', subscale: 'peer' },
  { id: 20, text: 'Often volunteers to help others (parents, teachers, other children)', subscale: 'prosocial' },
  { id: 21, text: 'Thinks things out before acting', subscale: 'hyperactivity', reverse: true },
  { id: 22, text: 'Steals from home, school or elsewhere', subscale: 'conduct' },
  { id: 23, text: 'Gets on better with adults than with other children', subscale: 'peer' },
  { id: 24, text: 'Many fears, easily scared', subscale: 'emotional' },
  { id: 25, text: 'Good attention span, sees chores or homework through to the end', subscale: 'hyperactivity', reverse: true }
];

const scoringBands = {
  emotional: [
    { label: 'Normal', range: [0, 5], description: 'Emotional well-being appears typical. Continue to monitor routines and coping skills.' },
    { label: 'Borderline', range: [6, 6], description: 'Slight elevations in emotional symptoms. Consider discussing coping strategies and daily stresses.' },
    { label: 'Abnormal', range: [7, 10], description: 'Elevated emotional symptoms that may benefit from professional assessment.' }
  ],
  conduct: [
    { label: 'Normal', range: [0, 3], description: 'Conduct behaviours are within the expected range.' },
    { label: 'Borderline', range: [4, 4], description: 'Mild concerns around rule-following or conflict. Monitor situations that trigger difficulties.' },
    { label: 'Abnormal', range: [5, 10], description: 'Consistent behavioural difficulties. Consider a structured behaviour plan and professional support.' }
  ],
  hyperactivity: [
    { label: 'Normal', range: [0, 5], description: 'Attention and activity levels appear typical.' },
    { label: 'Borderline', range: [6, 6], description: 'Some restlessness or inattention. Encourage focused routines and check impact on learning.' },
    { label: 'Abnormal', range: [7, 10], description: 'High hyperactivity or inattention. Consider consultation to support self-regulation skills.' }
  ],
  peer: [
    { label: 'Normal', range: [0, 3], description: 'Peer relationships appear typical. Continue to nurture friendships.' },
    { label: 'Borderline', range: [4, 5], description: 'Some peer relationship challenges. Explore social supports and friendship opportunities.' },
    { label: 'Abnormal', range: [6, 10], description: 'Marked peer relationship difficulties. Targeted social skills support may be helpful.' }
  ],
  prosocial: [
    { label: 'Abnormal', range: [0, 4], description: 'Prosocial behaviours appear limited. Support empathy and helping opportunities.' },
    { label: 'Borderline', range: [5, 5], description: 'Prosocial skills are emerging. Reinforce positive helping behaviours.' },
    { label: 'Normal', range: [6, 10], description: 'Prosocial strengths evident. Continue to celebrate positive interactions.' }
  ],
  total: [
    { label: 'Normal', range: [0, 13], description: 'Overall difficulties are within the expected range.' },
    { label: 'Borderline', range: [14, 16], description: 'Mild elevation across difficulties. Monitor changes and consider supportive strategies.' },
    { label: 'Abnormal', range: [17, 40], description: 'Significant overall difficulties. A comprehensive professional assessment is recommended.' }
  ]
};

const responseOptions = [
  { value: 0, label: 'Not True' },
  { value: 1, label: 'Somewhat True' },
  { value: 2, label: 'Certainly True' }
];

const state = {
  currentIndex: 0,
  responses: Array(questions.length).fill(null)
};

const questionTextEl = document.getElementById('question-text');
const currentQuestionEl = document.getElementById('current-question');
const totalQuestionsEl = document.getElementById('total-questions');
const progressFillEl = document.querySelector('.progress__bar-fill');
const progressBarEl = document.querySelector('.progress__bar');
const formEl = document.getElementById('response-form');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const generateBtn = document.getElementById('generate-btn');
const exportBtn = document.getElementById('export-btn');
const resultsSection = document.getElementById('results');
const resultsGrid = document.getElementById('results-grid');
const resultsAnalysis = document.getElementById('results-analysis');

function init() {
  totalQuestionsEl.textContent = questions.length.toString();
  renderQuestion();
  attachEventListeners();
}

function attachEventListeners() {
  prevBtn.addEventListener('click', () => {
    if (state.currentIndex > 0) {
      state.currentIndex -= 1;
      renderQuestion();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (!isCurrentQuestionAnswered()) {
      formEl.classList.add('question__options--error');
      formEl.setAttribute('data-error', 'Please select an option before continuing.');
      return;
    }

    if (state.currentIndex < questions.length - 1) {
      state.currentIndex += 1;
      renderQuestion();
    }
  });

  formEl.addEventListener('change', (event) => {
    if (event.target && event.target.name === 'response') {
      const value = Number(event.target.value);
      state.responses[state.currentIndex] = value;
      formEl.classList.remove('question__options--error');
      formEl.removeAttribute('data-error');
      updateNavigationState();
    }
  });

  generateBtn.addEventListener('click', () => {
    if (!areAllQuestionsAnswered()) {
      alert('Please answer all questions before generating results.');
      return;
    }
    const scores = calculateScores();
    renderResults(scores);
    resultsSection.hidden = false;
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    exportBtn.disabled = false;
  });

  exportBtn.addEventListener('click', () => {
    window.print();
  });
}

function renderQuestion() {
  const question = questions[state.currentIndex];
  questionTextEl.textContent = question.text;
  currentQuestionEl.textContent = (state.currentIndex + 1).toString();
  progressFillEl.style.width = `${((state.currentIndex + 1) / questions.length) * 100}%`;
  progressBarEl.setAttribute('aria-valuenow', String(state.currentIndex + 1));

  formEl.innerHTML = '';
  formEl.classList.remove('question__options--error');
  formEl.removeAttribute('data-error');
  const template = document.getElementById('option-template');

  responseOptions.forEach((option) => {
    const optionNode = template.content.cloneNode(true);
    const input = optionNode.querySelector('input');
    const labelText = optionNode.querySelector('.option__text');
    input.value = option.value;
    input.checked = state.responses[state.currentIndex] === option.value;
    input.id = `q${question.id}-option-${option.value}`;
    input.name = 'response';
    labelText.textContent = option.label;
    optionNode.querySelector('label').setAttribute('for', input.id);
    formEl.appendChild(optionNode);
  });

  prevBtn.disabled = state.currentIndex === 0;
  nextBtn.textContent = state.currentIndex === questions.length - 1 ? 'End of Questions' : 'Next Question';
  generateBtn.disabled = !areAllQuestionsAnswered();

  updateNavigationState();
}

function updateNavigationState() {
  prevBtn.disabled = state.currentIndex === 0;
  const answered = state.responses[state.currentIndex] !== null;
  nextBtn.disabled = state.currentIndex === questions.length - 1 ? true : !answered;
  generateBtn.disabled = !areAllQuestionsAnswered();
}

function isCurrentQuestionAnswered() {
  return state.responses[state.currentIndex] !== null;
}

function areAllQuestionsAnswered() {
  return state.responses.every((value) => value !== null);
}

function calculateScores() {
  const subscaleScores = {
    emotional: 0,
    conduct: 0,
    hyperactivity: 0,
    peer: 0,
    prosocial: 0
  };

  questions.forEach((question, index) => {
    let value = state.responses[index];
    if (question.reverse) {
      value = 2 - value;
    }
    subscaleScores[question.subscale] += value;
  });

  const totalDifficulties =
    subscaleScores.emotional + subscaleScores.conduct + subscaleScores.hyperactivity + subscaleScores.peer;

  return {
    ...subscaleScores,
    total: totalDifficulties
  };
}

function findBand(subscale, score) {
  return scoringBands[subscale].find(({ range }) => score >= range[0] && score <= range[1]);
}

function renderResults(scores) {
  resultsGrid.innerHTML = '';
  const template = document.getElementById('result-card-template');

  Object.entries(scores).forEach(([subscale, score]) => {
    const band = findBand(subscale, score);
    const node = template.content.cloneNode(true);
    node.querySelector('.result-card__title').textContent = formatSubscaleName(subscale);
    node.querySelector('.result-card__score').textContent = `Score: ${score}`;
    node.querySelector('.result-card__band').textContent = `${band.label} range`;
    node.querySelector('.result-card__description').textContent = band.description;
    resultsGrid.appendChild(node);
  });

  const summaryLines = [
    `Total Difficulties score (${scores.total}) falls within the ${findBand('total', scores.total).label.toLowerCase()} range.`,
    summariseKeyElevations(scores)
  ].filter(Boolean);

  resultsAnalysis.innerHTML = `<h3>Interpretive Notes</h3><ul>${summaryLines
    .map((line) => `<li>${line}</li>`)
    .join('')}</ul>`;
}

function summariseKeyElevations(scores) {
  const difficultySubscales = ['emotional', 'conduct', 'hyperactivity', 'peer'];
  const elevated = difficultySubscales
    .map((subscale) => ({
      subscale,
      band: findBand(subscale, scores[subscale])
    }))
    .filter(({ band }) => band.label !== 'Normal');

  if (elevated.length === 0) {
    return 'No individual difficulty subscale scores fell in the borderline or abnormal ranges.';
  }

  return `Elevations noted in: ${elevated
    .map(({ subscale, band }) => `${formatSubscaleName(subscale)} (${band.label.toLowerCase()})`)
    .join(', ')}.`;
}

function formatSubscaleName(name) {
  return name === 'total'
    ? 'Total Difficulties'
    : name.charAt(0).toUpperCase() + name.slice(1);
}

init();
