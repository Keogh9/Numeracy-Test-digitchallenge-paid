import React from 'react';
export default function InstructionScreen({ onStart }) {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <header className="bg-blue-900 text-white p-4 rounded">
        <h1 className="text-2xl font-bold">English Language Skills Test</h1>
      </header>
      <section className="mt-6 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Instructions</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Total duration: 10 minutes (4 fluency / 4 vocabulary / 2 spelling).</li>
          <li>Select the best answer or “?” to skip with no penalty.</li>
          <li>A countdown timer will appear; when time expires you advance automatically.</li>
          <li>You may move to the next section early if you finish before the timer.</li>
        </ul>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="px-4 py-2 border rounded"
            onClick={() => window.location.reload()}
          >
            Home
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={onStart}>
            Start Test
          </button>
        </div>
      </section>
    </div>
  );
}
