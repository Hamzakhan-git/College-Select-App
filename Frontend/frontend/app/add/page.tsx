'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AddCollegePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    fees: '',
    rating: '',
    placement_percentage: '',
    courses: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert strings to proper numbers and arrays before sending
    const payload = {
      ...formData,
      fees: Number(formData.fees),
      rating: Number(formData.rating),
      placement_percentage: Number(formData.placement_percentage),
      courses: formData.courses.split(',').map(c => c.trim())
    };

    const res = await fetch('https://college-select-app.vercel.app/api/colleges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert("College added successfully!");
      router.push('/'); // Send them back to the homepage
    } else {
      alert("Failed to add college.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-700">
        <Link href="/" className="text-purple-400 hover:text-purple-300 font-semibold mb-6 inline-block">
          &larr; Back to Listings
        </Link>
        <h1 className="text-3xl font-extrabold mb-8 text-white">Add New College</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-300 mb-2 font-medium">College Name</label>
            <input required type="text" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none" 
              onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-2 font-medium">Location</label>
              <input required type="text" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none" 
                onChange={e => setFormData({...formData, location: e.target.value})} />
            </div>
            <div>
              <label className="block text-slate-300 mb-2 font-medium">Annual Fees (₹)</label>
              <input required type="number" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none" 
                onChange={e => setFormData({...formData, fees: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-2 font-medium">Rating (Out of 5)</label>
              <input required type="number" step="0.1" max="5" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none" 
                onChange={e => setFormData({...formData, rating: e.target.value})} />
            </div>
            <div>
              <label className="block text-slate-300 mb-2 font-medium">Placement %</label>
              <input required type="number" max="100" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none" 
                onChange={e => setFormData({...formData, placement_percentage: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-2 font-medium">Courses (comma separated)</label>
            <input required type="text" placeholder="e.g. B.Tech CS, MBA, BBA" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none" 
              onChange={e => setFormData({...formData, courses: e.target.value})} />
          </div>

          <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-500 transition shadow-lg mt-4">
            Save College
          </button>
        </form>
      </div>
    </div>
  );
}