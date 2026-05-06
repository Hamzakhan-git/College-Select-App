'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function QAPage() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [answerInputs, setAnswerInputs] = useState<{ [key: number]: string }>({});

  // Fetch questions on load
  const fetchQuestions = async () => {
    const res = await fetch('https://college-select-app.vercel.app/api/questions');
    const data = await res.json();
    setQuestions(data);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Submit a new question
  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    await fetch('https://college-select-app.vercel.app/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: newQuestion })
    });
    
    setNewQuestion('');
    fetchQuestions(); // Refresh list
  };

  // Submit an answer
  const handleAnswer = async (id: number) => {
    const answerText = answerInputs[id];
    if (!answerText || !answerText.trim()) return;

    await fetch(`https://college-select-app.vercel.app/api/questions/${id}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer: answerText })
    });

    // Clear input and refresh
    setAnswerInputs({ ...answerInputs, [id]: '' });
    fetchQuestions();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-amber-400 hover:text-amber-300 font-semibold mb-8 inline-block transition">
          &larr; Back to Dashboard
        </Link>
        
        <h1 className="text-4xl font-extrabold mb-2 text-white">Community Q&A</h1>
        <p className="text-slate-400 mb-10">Ask questions about colleges, exams, and placements. Help others by answering!</p>

        {/* Ask Question Form */}
        <form onSubmit={handleAskQuestion} className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 mb-10 flex gap-4">
          <input 
            type="text" 
            placeholder="What do you want to know?" 
            className="flex-1 bg-slate-900 border border-slate-600 rounded-lg p-4 text-white focus:border-amber-500 focus:outline-none"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <button type="submit" className="bg-amber-600 text-white px-8 font-bold rounded-lg hover:bg-amber-500 transition shadow-lg border border-amber-500/50">
            Ask
          </button>
        </form>

        {/* Questions List */}
        <div className="space-y-6">
          {questions.map((q: any) => (
            <div key={q.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-bold text-white mb-4">Q: {q.question}</h3>
              
              {q.answer ? (
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  <span className="text-emerald-400 font-bold mr-2">Answer:</span>
                  <span className="text-slate-300">{q.answer}</span>
                </div>
              ) : (
                <div className="flex gap-3 mt-4 pt-4 border-t border-slate-700">
                  <input 
                    type="text" 
                    placeholder="Type your answer here..." 
                    className="flex-1 bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none text-sm"
                    value={answerInputs[q.id] || ''}
                    onChange={(e) => setAnswerInputs({ ...answerInputs, [q.id]: e.target.value })}
                  />
                  <button 
                    onClick={() => handleAnswer(q.id)}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-500 transition text-sm"
                  >
                    Submit Answer
                  </button>
                </div>
              )}
            </div>
          ))}
          {questions.length === 0 && (
            <div className="text-center text-slate-400 py-10">No questions yet. Be the first to ask!</div>
          )}
        </div>
      </div>
    </div>
  );
}