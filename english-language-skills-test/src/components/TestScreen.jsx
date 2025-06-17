import React, { useState, useEffect } from 'react';
import Timer from './Timer';
import SectionIntro from './SectionIntro';
import Question from './Question';
import { fluencyQuestions } from '../data/fluencyQuestions';
import { vocabQuestions } from '../data/vocabQuestions';
import { spellingQuestions } from '../data/spellingQuestions';

const sections = [
  { key: 'fluency', title: 'Fluency Skills', data: fluencyQuestions, duration: 240 },
  { key: 'vocab', title: 'Vocabulary Skills', data: vocabQuestions, duration: 240 },
  { key: 'spelling', title: 'Spelling Skills', data: spellingQuestions, duration: 120 },
];

export default function TestScreen({ onComplete }) {
  const [secIndex, setSecIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(sections[0].duration);

  useEffect(() => {
    // shuffle questions when section changes
    const arr = [...sections[secIndex].data];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setQuestions(arr);
    setTimeLeft(sections[secIndex].duration);
    setStarted(false);
  }, [secIndex]);

  useEffect(() => {
    if (!started) return;
    if (timeLeft <= 0) {
      handleNext();
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [started, timeLeft]);

  function handleNext() {
    if (secIndex < sections.length - 1) {
      setSecIndex(i => i + 1);
    } else {
      onComplete(answers);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <header className="bg-blue-900 text-white p-4 rounded flex justify-between items-center">
        <h1 className="text-xl font-bold">English Language Skills Test</h1>
        <Timer time={timeLeft} />
      </header>

      {!started ? (
        <SectionIntro
          title={sections[secIndex].title}
          duration={sections[secIndex].duration}
          onBegin={() => setStarted(true)}
        />
      ) : (
        <div className="mt-6 space-y-6">
          {questions.map(q => (
            <Question
              key={q.id}
              question={q}
              selected={answers[q.id]}
              onSelect={opt => setAnswers(a => ({ ...a, [q.id]: opt }))}
            />
          ))}
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={handleNext}
            >
              Next Section
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
