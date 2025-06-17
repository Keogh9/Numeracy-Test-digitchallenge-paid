import React, { useState } from 'react';
import InstructionScreen from './components/InstructionScreen';
import TestScreen from './components/TestScreen';
import ResultsScreen from './components/ResultsScreen';

export default function App() {
  const [phase, setPhase] = useState('instructions'); // 'instructions', 'test', 'results'
  const [allAnswers, setAllAnswers] = useState({});

  return (
    <div className="min-h-screen">
      {phase === 'instructions' && <InstructionScreen onStart={() => setPhase('test')} />}
      {phase === 'test' && (
        <TestScreen
          onComplete={answers => {
            setAllAnswers(answers);
            setPhase('results');
          }}
        />
      )}
      {phase === 'results' && <ResultsScreen userAnswers={allAnswers} />}
    </div>
  );
}
