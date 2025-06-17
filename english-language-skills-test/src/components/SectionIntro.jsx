import React from 'react';
import { fluencyQuestions } from '../data/fluencyQuestions';
import { vocabQuestions } from '../data/vocabQuestions';
import { spellingQuestions } from '../data/spellingQuestions';

export default function ResultsScreen({ userAnswers }) {
  // merge all questions
  const all = [...fluencyQuestions, ...vocabQuestions, ...spellingQuestions];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <header className="bg-blue-900 text-white p-4 rounded">
        <h1 className="text-xl font-bold">Your Results</h1>
      </header>

      <div className="mt-6 space-y-4">
        {all.map(q => {
          const user = userAnswers[q.id];
          const correct = q.correct;
          const right = user === correct;
          return (
            <div
              key={q.id}
              className={`p-4 rounded shadow ${
                user === '?'
                  ? 'bg-gray-100'
                  : right
                  ? 'bg-green-100'
                  : 'bg-red-100'
              }`}
            >
              <p className="font-medium">{q.prompt}</p>
              <p>
                Your answer: <strong>{user}</strong>
              </p>
              <p>
                Correct answer:{' '}
                <strong className={right ? 'text-green-800' : 'text-red-800'}>
                  {correct}
                </strong>
              </p>
              {!right && user !== '?' && (
                <p className="mt-2 italic">Rationale: {q.rationale}</p>
              )}
              {user === '?' && (
                <p className="mt-2 italic">You skipped this question.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
