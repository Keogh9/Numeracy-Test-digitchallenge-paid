import React from 'react';

export default function Timer({ time }) {
  const minutes = String(Math.floor(time / 60)).padStart(2, '0');
  const seconds = String(time % 60).padStart(2, '0');
  return (
    <div className="font-mono text-lg">
      {minutes}:{seconds}
    </div>
  );
}
