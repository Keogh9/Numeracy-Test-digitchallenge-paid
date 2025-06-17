import React from 'react';
import { fluencyQuestions } from '../data/fluencyQuestions';
import { vocabQuestions } from '../data/vocabQuestions';
import { spellingQuestions } from '../data/spellingQuestions';

export default function ResultsScreen({ userAnswers }) {
  // Combine all questions into one array
  const allQuestions = [
    ...fluencyQuestions,
    ...vocabQuestions,
    ...spellingQuestions
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <header className="bg-blue-900 text-white p-4 rounded">
        <h1 className="text-xl font-bold">Your Results</h1>
      </header>

      <div className="mt-6 space-y-4">
        {allQuestions.map(q => {
          const userAnswer = userAnswers[q.id];
          const isCorrect = userAnswer === q.correct;
          return (
            <div
              key={q.id}
              className={`p-4 rounded shadow ${
                userAnswer === '?'
                  ? 'bg-gray-100'
                  : isCorrect
                  ? 'bg-green-100'
                  : 'bg-red-100'
              }`}
            >
              <p className="font-medium">{q.prompt}</p>
              <p>
                Your answer: <strong>{userAnswer}</strong>
              </p>
              <p>
                Correct answer:{' '}
                <strong
                  className={
                    isCorrect ? 'text-green-800' : 'text-red-800'
                  }
                >
                  {q.correct}
                </strong>
              </p>
              {userAnswer === '?' && (
                <p className="mt-2 italic">You skipped this question.</p>
              )}
              {!isCorrect && userAnswer !== '?' && (
                <p className="mt-2 italic">Rationale: {q.rationale}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
