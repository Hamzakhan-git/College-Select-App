import Link from 'next/link';

// Fetch single college data from your Express backend
async function getCollege(id: string) {
  const res = await fetch(`https://college-select-app.vercel.app/api/colleges/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch college');
  return res.json();
}

export default async function CollegeDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const college = await getCollege(resolvedParams.id);

  return (
    // TRUE DARK MODE: Deep slate background, light text, matching padding
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-purple-400 hover:text-purple-300 font-semibold mb-8 inline-block transition">
          &larr; Back to Listings
        </Link>
        
        {/* Detail Card with dark background and slate borders */}
        <div className="bg-slate-800 p-10 rounded-2xl shadow-lg border border-slate-700">
          <div className="flex justify-between items-start mb-8">
            <div>
              {/* Force clean white for the title */}
              <h1 className="text-4xl font-extrabold mb-3 text-white tracking-tight">{college.name}</h1>
              <p className="text-xl text-slate-300 font-medium">{college.location}</p>
            </div>
            <div className="text-right">
              {/* Updated rating badge to match compare page style */}
              <span className="bg-slate-700/80 text-slate-100 text-lg font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 border border-slate-600">
                ⭐ {college.rating} / 5
              </span>
            </div>
          </div>

          {/* Slate divider */}
          <div className="border-t border-slate-700 my-8"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              {/* Section labels in lighter slate */}
              <h3 className="text-slate-400 uppercase tracking-wider text-sm font-bold mb-3">Annual Fees</h3>
              {/* Pure white for the value */}
              <p className="text-2xl font-extrabold text-white">₹{college.fees.toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-slate-400 uppercase tracking-wider text-sm font-bold mb-3">Placement Rate</h3>
              {/* Vibrant emerald green for placement */}
              <p className="text-2xl font-extrabold text-emerald-400">{college.placement_percentage}%</p>
            </div>
          </div>

          {/* Slate divider */}
          <div className="border-t border-slate-700 my-8"></div>

          <div>
            {/* Forced slate-200 for subtitles */}
            <h2 className="text-2xl font-bold mb-6 text-slate-200">Courses Offered</h2>
            <div className="flex flex-wrap gap-3">
              {college.courses.map((course: string, index: number) => (
                // Darker course badges that pop against the card
                <span key={index} className="bg-slate-900/50 border border-slate-700 text-slate-300 px-5 py-3 rounded-xl font-medium transition hover:border-purple-500 hover:text-white hover:bg-slate-800">
                  {course}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}