'use client'; 

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ComparePage() {
  const [colleges, setColleges] = useState([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [comparisonData, setComparisonData] = useState([]);

  useEffect(() => {
    fetch('https://college-select-app.vercel.app/api/colleges')
      .then(res => res.json())
      .then(data => setColleges(data));
  }, []);

  const toggleSelection = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      if (selectedIds.length >= 3) return alert("You can only compare up to 3 colleges!");
      setSelectedIds([...selectedIds, id]);
    }
  };

  const runComparison = async () => {
    if (selectedIds.length < 2) return alert("Please select at least 2 colleges to compare.");
    
    const res = await fetch('https://college-select-app.vercel.app/api/colleges/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedIds })
    });
    const data = await res.json();
    setComparisonData(data);
  };

  return (
    // TRUE DARK MODE: Deep slate background, light text
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-purple-400 hover:text-purple-300 font-semibold mb-8 inline-block transition">
          &larr; Back to Listings
        </Link>
        
        <h1 className="text-4xl font-extrabold mb-8 text-white">Compare Colleges</h1>

        {/* Selection Area */}
        <div className="bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700 mb-8">
          <h2 className="text-xl font-bold mb-6 text-slate-200">1. Select up to 3 colleges:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {colleges.map((college: any) => (
              <label key={college.id} className="flex items-center space-x-3 bg-slate-900/50 p-4 border border-slate-700 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-slate-800 transition group">
                <input 
                  type="checkbox" 
                  checked={selectedIds.includes(college.id)}
                  onChange={() => toggleSelection(college.id)}
                  className="w-5 h-5 accent-purple-500 rounded bg-slate-800 border-slate-600"
                />
                <span className="text-sm font-medium text-slate-300 group-hover:text-white truncate transition">{college.name}</span>
              </label>
            ))}
          </div>
          <button 
            onClick={runComparison}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-500 font-bold transition shadow-lg shadow-purple-900/20"
          >
            Generate Comparison
          </button>
        </div>

        {/* Results Table Area */}
        {comparisonData.length > 0 && (
          <div className="overflow-hidden bg-slate-800 rounded-xl shadow-lg border border-slate-700">
            <div className="p-6 bg-slate-900/80 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">2. Comparison Results:</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-900/50">
                    <th className="p-5 font-bold text-slate-400 uppercase tracking-wider text-xs">Feature</th>
                    {comparisonData.map((c: any) => (
                      <th key={c.id} className="p-5 font-extrabold text-lg text-white border-l border-slate-700">{c.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-700 hover:bg-slate-700/30 transition">
                    <td className="p-5 font-semibold text-slate-400">Location</td>
                    {comparisonData.map((c: any) => <td key={c.id} className="p-5 text-slate-200 border-l border-slate-700">{c.location}</td>)}
                  </tr>
                  <tr className="border-b border-slate-700 hover:bg-slate-700/30 transition">
                    <td className="p-5 font-semibold text-slate-400">Annual Fees</td>
                    {comparisonData.map((c: any) => <td key={c.id} className="p-5 text-slate-200 border-l border-slate-700">₹{c.fees.toLocaleString()}</td>)}
                  </tr>
                  <tr className="border-b border-slate-700 hover:bg-slate-700/30 transition">
                    <td className="p-5 font-semibold text-slate-400">Rating</td>
                    {comparisonData.map((c: any) => <td key={c.id} className="p-5 font-medium text-slate-200 border-l border-slate-700">⭐ {c.rating} / 5</td>)}
                  </tr>
                  <tr className="hover:bg-slate-700/30 transition">
                    <td className="p-5 font-semibold text-slate-400">Placement %</td>
                    {comparisonData.map((c: any) => (
                      <td key={c.id} className="p-5 font-bold text-emerald-400 border-l border-slate-700">{c.placement_percentage}%</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}