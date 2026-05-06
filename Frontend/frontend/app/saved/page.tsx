'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SavedCollegesPage() {
  const [savedColleges, setSavedColleges] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('college_user');
    if (user) {
      setUsername(user);
      // Fetch only the colleges saved by this specific user
      fetch(`https://college-select-app-88g1.vercel.app/api/saved/${user}`)
        .then(res => res.json())
        .then(data => setSavedColleges(data))
        .catch(err => console.error("Error fetching saved items:", err));
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-400 hover:text-blue-300 font-semibold mb-8 inline-block transition">
          &larr; Back to Dashboard
        </Link>
        
        <h1 className="text-4xl font-extrabold mb-2 text-white">My Saved Colleges</h1>
        <p className="text-slate-400 mb-10">Personalized list for 👤 <span className="text-emerald-400 font-bold">{username}</span></p>

        {savedColleges.length === 0 ? (
          <div className="bg-slate-800 p-12 rounded-2xl border border-slate-700 text-center">
            <p className="text-slate-400 text-lg mb-6">You haven't saved any colleges yet.</p>
            <Link href="/" className="bg-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-500 transition">
              Browse Colleges
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedColleges.map((college: any) => (
              <div key={college.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-2">{college.name}</h2>
                <p className="text-slate-400 mb-4">📍 {college.location}</p>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-emerald-400 font-bold">⭐ {college.rating}</span>
                  <span className="text-slate-200 font-medium">₹{college.fees.toLocaleString()} / yr</span>
                </div>
                <Link 
                  href={`/college/${college.id}`} 
                  className="block w-full text-center bg-slate-700 hover:bg-slate-600 py-2 rounded-lg text-sm font-semibold transition"
                >
                  View Full Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}