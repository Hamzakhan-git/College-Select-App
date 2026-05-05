'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PredictorPage() {
  const [formData, setFormData] = useState({ exam: 'JEE Main', rank: '' });
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.rank) return alert("Please enter your rank!");

    const res = await fetch('http://localhost:5000/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const data = await res.json();
    setResults(data);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-400 hover:text-blue-300 font-semibold mb-8 inline-block transition">
          &larr; Back to Dashboard
        </Link>
        
        <h1 className="text-4xl font-extrabold mb-2 text-white">College Predictor</h1>
        <p className="text-slate-400 mb-8">Enter your exam rank to see which colleges you might qualify for.</p>

        {/* Input Form */}
        <form onSubmit={handlePredict} className="bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-700 mb-10 flex flex-col md:flex-row gap-6 items-end">
          <div className="w-full md:w-1/3">
            <label className="text-slate-300 text-sm font-bold mb-2 block">Select Exam</label>
            <select 
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
              value={formData.exam}
              onChange={(e) => setFormData({...formData, exam: e.target.value})}
            >
              <option value="JEE Main">JEE Main</option>
              <option value="JEE Advanced">JEE Advanced</option>
              <option value="BITSAT">BITSAT</option>
              <option value="State CET">State CET</option>
            </select>
          </div>
          <div className="w-full md:w-1/3">
            <label className="text-slate-300 text-sm font-bold mb-2 block">Your Rank</label>
            <input 
              type="number" 
              placeholder="e.g. 15000" 
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
              value={formData.rank}
              onChange={(e) => setFormData({...formData, rank: e.target.value})}
            />
          </div>
          <div className="w-full md:w-1/3">
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-500 transition shadow-lg shadow-blue-900/20 border border-blue-500/50">
              🔮 Predict Colleges
            </button>
          </div>
        </form>

        {/* Results Area */}
        {hasSearched && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-slate-200">
              Recommended for Rank {formData.rank} ({formData.exam}):
            </h2>
            
            {results.length === 0 ? (
              <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 text-center text-slate-400">
                No exact matches found for this rank tier right now.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((college: any) => (
                  <div key={college.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-blue-500/50 transition">
                    <h3 className="text-lg font-bold text-white">{college.name}</h3>
                    <p className="text-slate-400 text-sm mb-3">{college.location}</p>
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-emerald-400">⭐ {college.rating} Rating</span>
                      <span className="text-slate-300">₹{college.fees.toLocaleString()}/yr</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}