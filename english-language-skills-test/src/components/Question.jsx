import React from 'react';

export default function Question({ question, selected, onSelect }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p className="mb-2 font-medium">{question.prompt}</p>
      <ul className="space-y-1">
        {question.options.map(opt => (
          <li key={opt}>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name={question.id}
                checked={selected === opt}
                onChange={() => onSelect(opt)}
              />
              <span>{opt}</span>
            </label>
          </li>
        ))}
        <li>
          <label className="
