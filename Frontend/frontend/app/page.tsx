'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [colleges, setColleges] = useState([]);
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    fetch('https://college-select-app-88g1.vercel.app/api/colleges')
      .then(res => res.json())
      .then(data => setColleges(data));
    
    // Check if user was already logged in
    const savedUser = localStorage.getItem('college_user');
    if (savedUser) {
      setUsername(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('college_user', username);
      setIsLoggedIn(true);
    }
  };

  const handleSave = async (collegeId: number) => {
    if (!isLoggedIn) return alert("Please login first to save colleges!");
    
    const res = await fetch('https://college-select-app-88g1.vercel.app/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, college_id: collegeId })
    });

    if (res.ok) alert("College saved to your profile!");
    else alert("Already saved or error occurred.");
  };

  const filteredColleges = colleges.filter((c: any) => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (locationFilter === '' || c.location === locationFilter)
  );

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* TOP LOGIN BAR */}
        <div className="bg-slate-800 p-4 rounded-xl mb-8 flex justify-between items-center border border-slate-700">
          {!isLoggedIn ? (
            <form onSubmit={handleLogin} className="flex gap-3">
              <input 
                type="text" placeholder="Enter Username to Login" 
                className="bg-slate-900 border border-slate-600 rounded-lg p-2 text-sm text-white outline-none"
                value={username} onChange={e => setUsername(e.target.value)}
              />
              <button className="bg-blue-600 px-4 py-2 rounded-lg text-sm font-bold">Login</button>
            </form>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-emerald-400 font-bold">👤 Welcome, {username}</span>
              <Link href="/saved" className="text-sm text-blue-400 underline">View My Saved Items</Link>
              <button onClick={() => {setIsLoggedIn(false); localStorage.removeItem('college_user');}} className="text-xs text-red-400">Logout</button>
            </div>
          )}
        </div>

        {/* Header and Other Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-10 border-b border-slate-700 pb-6">
    <h1 className="text-3xl md:text-4xl font-extrabold text-white">College Discovery</h1>
    
    {/* flex-wrap ensures buttons wrap to a new line on very small screens instead of getting cut off */}
    <div className="flex flex-wrap gap-3 md:gap-4">
        <Link href="/qa" className="bg-amber-600 px-4 py-2 md:px-5 md:py-3 rounded-xl font-bold text-sm md:text-base">💬 Q&A</Link>
        <Link href="/predict" className="bg-blue-600 px-4 py-2 md:px-5 md:py-3 rounded-xl font-bold text-sm md:text-base">🔮 Predictor</Link>
        <Link href="/add" className="bg-emerald-600 px-4 py-2 md:px-5 md:py-3 rounded-xl font-bold text-sm md:text-base">+ Add</Link>
        <Link href="/compare" className="bg-purple-600 px-4 py-2 md:px-5 md:py-3 rounded-xl font-bold text-sm md:text-base">⚖️ Compare</Link>
    </div>
</div>

        {/* Search Bar */}
        <input 
            type="text" placeholder="Search colleges..." 
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 mb-10 text-white outline-none focus:border-purple-500"
            onChange={e => setSearchQuery(e.target.value)}
        />

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredColleges.map((college: any) => (
            <div key={college.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col h-full">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold text-white">{college.name}</h2>
                <button onClick={() => handleSave(college.id)} className="text-2xl hover:scale-110 transition">🔖</button>
              </div>
              <p className="text-slate-400 mb-6 flex-grow">📍 {college.location}</p>
              <Link href={`/college/${college.id}`} className="block w-full text-center bg-slate-700 py-3 rounded-xl font-semibold">View Details</Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}