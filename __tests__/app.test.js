const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

class MockElement {
  constructor(tagName, options = {}) {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.className = '';
    this.style = {};
    this.disabled = false;
    this.hidden = false;
    this._textContent = options.textContent || '';
    this._innerHTML = options.innerHTML || '';
    this.value = options.value || '';
    this.listeners = {};
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  addEventListener(event, handler) {
    this.listeners[event] = handler;
  }

  scrollIntoView() {}

  set textContent(value) {
    this._textContent = value;
  }

  get textContent() {
    return this._textContent;
  }

  set innerHTML(value) {
    this._innerHTML = value;
    this.children = [];
  }

  get innerHTML() {
    return this._innerHTML;
  }
}

function createMockDocument() {
  const elements = {};
  const ids = [
    'questionCard',
    'questionText',
    'responseForm',
    'progressIndicator',
    'progressFill',
    'prevButton',
    'nextButton',
    'resultsSection',
    'resultsGrid',
    'resultsSummary',
    'exportPdf',
    'retake',
    'questionnaireType',
    'identifier',
    'date',
    'resultsDetails'
  ];

  ids.forEach((id) => {
    const defaults = {};
    if (id === 'questionnaireType') {
      defaults.value = 'parent';
    }
    elements[id] = new MockElement('div', defaults);
  });

  elements.prevButton = new MockElement('button');
  elements.nextButton = new MockElement('button');
  elements.exportPdf = new MockElement('button');
  elements.retake = new MockElement('button');
  elements.responseForm = new MockElement('form');
  elements.identifier = new MockElement('input');
  elements.date = new MockElement('input');

  const document = {
    elements,
    getElementById(id) {
      if (!this.elements[id]) {
        this.elements[id] = new MockElement('div');
      }
      return this.elements[id];
    },
    createElement(tagName) {
      const element = new MockElement(tagName);
      if (tagName.toLowerCase() === 'input') {
        element.type = 'text';
        element.checked = false;
      }
      return element;
    }
  };

  return document;
}

let sdqApp;

describe('SDQ assessment app logic', () => {
  beforeEach(() => {
    global.document = createMockDocument();
    global.window = {
      jspdf: {
        jsPDF: function MockPDF() {
          this.setFont = () => {};
          this.setFontSize = () => {};
          this.text = () => {};
          this.addPage = () => {};
          this.splitTextToSize = (text) => [text];
          this.internal = { pageSize: { getWidth: () => 595.28, getHeight: () => 841.89 } };
          this.setTextColor = () => {};
          this.save = () => {};
        }
      },
      scrollTo: () => {}
    };
    global.alert = () => {};
    global.confirm = () => true;

    delete require.cache[require.resolve('../script.js')];
    sdqApp = require('../script.js');
  });

  it('calculates expected totals for parent questionnaire with high responses', () => {
    sdqApp.loadQuestionnaire('parent');
    const responses = new Array(25).fill(2);
    sdqApp.setResponsesForTesting(responses);

    const scores = sdqApp.calculateScores();

    assert.deepStrictEqual(scores, {
      'Emotional Symptoms': 10,
      'Conduct Problems': 8,
      Hyperactivity: 6,
      'Peer Problems': 6,
      Prosocial: 10,
      'Total Difficulties': 30
    });
  });

  it('classifies total difficulties score using current questionnaire bands', () => {
    sdqApp.loadQuestionnaire('parent');
    const classification = sdqApp.classifyScore('Total Difficulties', 30);
    assert.deepStrictEqual(classification, { label: 'Abnormal', key: 'abnormal' });
  });

  it('applies teacher questionnaire thresholds when classifying scores', () => {
    sdqApp.loadQuestionnaire('teacher');
    const classification = sdqApp.classifyScore('Total Difficulties', 12);
    assert.deepStrictEqual(classification, { label: 'Borderline', key: 'borderline' });
  });

  it('builds summary highlighting areas requiring follow up', () => {
    sdqApp.loadQuestionnaire('parent');
    const responses = new Array(25).fill(2);
    sdqApp.setResponsesForTesting(responses);
    const scores = sdqApp.calculateScores();

    const summary = sdqApp.buildSummary(scores);

    assert.ok(summary.includes('Total Difficulties score is 30'));
    assert.ok(summary.includes('abnormal band'));
    assert.ok(summary.includes('Key areas for follow up'));
  });

  it('loading the self questionnaire updates the question text', () => {
    sdqApp.loadQuestionnaire('self');
    const questionText = global.document.getElementById('questionText').textContent;
    assert.strictEqual(questionText, 'I try to be nice to other people. I care about their feelings.');
  });

  it('keeps the questionnaire selector in sync when loading a new version', () => {
    const selector = global.document.getElementById('questionnaireType');
    assert.strictEqual(selector.value, 'parent');

    sdqApp.loadQuestionnaire('teacher');
    assert.strictEqual(selector.value, 'teacher');
  });

  it('populates metadata details when generating results', () => {
    sdqApp.loadQuestionnaire('parent');
    sdqApp.setResponsesForTesting(new Array(25).fill(2));

    const identifierInput = global.document.getElementById('identifier');
    const dateInput = global.document.getElementById('date');
    identifierInput.value = 'Case-123';
    dateInput.value = '2024-03-15';

    sdqApp.generateResults();

    const details = global.document.getElementById('resultsDetails').children;
    assert.strictEqual(details.length, 6);
    assert.strictEqual(details[0].textContent, 'Questionnaire');
    assert.strictEqual(details[1].textContent, 'Parent / Carer Report');
    assert.strictEqual(details[2].textContent, 'Identifier / Name');
    assert.strictEqual(details[3].textContent, 'Case-123');
    assert.strictEqual(details[4].textContent, 'Date');
    assert.strictEqual(details[5].textContent, '2024-03-15');

    const resultsSection = global.document.getElementById('resultsSection');
    const questionCard = global.document.getElementById('questionCard');
    assert.strictEqual(resultsSection.hidden, false);
    assert.strictEqual(questionCard.hidden, true);
  });
});
