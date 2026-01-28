import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cfApi } from '../services/cfApi';
import { CFUser, RatingChange, Submission } from '../types';

interface DashboardProps {
  handle: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ handle }) => {
  const [user, setUser] = useState<CFUser | null>(null);
  const [ratingHistory, setRatingHistory] = useState<RatingChange[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersData, ratingsData, subsData] = await Promise.all([
          cfApi.getUserInfo(handle),
          cfApi.getUserRating(handle),
          cfApi.getUserStatus(handle, 15)
        ]);
        
        if (usersData && usersData.length > 0) setUser(usersData[0]);
        setRatingHistory(ratingsData || []);
        setRecentSubmissions(subsData || []);
      } catch (err: any) {
        setError(err.message || "Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    if (handle) fetchData();
  }, [handle]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading profile data...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (!user) return <div className="p-8 text-center text-gray-500">User not found</div>;

  // Helpers for styling rank colors
  const getRankColor = (rank: string) => {
    if (rank.includes('legendary') || rank.includes('grandmaster')) return 'text-red-500';
    if (rank.includes('master')) return 'text-orange-500';
    if (rank.includes('candidate')) return 'text-purple-500';
    if (rank.includes('expert')) return 'text-blue-500';
    if (rank.includes('specialist')) return 'text-cyan-500';
    if (rank.includes('pupil')) return 'text-green-500';
    return 'text-gray-500';
  };

  const chartData = ratingHistory.map(r => ({
    name: new Date(r.ratingUpdateTimeSeconds * 1000).toLocaleDateString(),
    rating: r.newRating,
    contest: r.contestName
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <img src={user.titlePhoto || user.avatar} alt="Avatar" className="w-32 h-32 rounded-lg object-cover shadow-md" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className={`text-3xl font-bold ${getRankColor(user.rank)}`}>
              {user.handle}
            </h1>
            <p className="text-gray-600 font-medium capitalize mt-1">{user.rank}</p>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
              <div className="bg-gray-100 px-3 py-1 rounded">
                Rating: <span className="font-bold text-gray-900">{user.rating}</span>
              </div>
              <div className="bg-gray-100 px-3 py-1 rounded">
                Max: <span className="font-bold text-gray-900">{user.maxRating}</span>
              </div>
              <div className="bg-gray-100 px-3 py-1 rounded">
                Contribution: <span className={`font-bold ${user.contribution >= 0 ? 'text-green-600' : 'text-red-600'}`}>{user.contribution}</span>
              </div>
            </div>
            {user.organization && <p className="mt-2 text-gray-500 text-sm">{user.organization}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating Graph */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Rating History</h2>
          <div className="h-72 w-full">
            {ratingHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="name" tick={{fontSize: 12}} hide />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Line type="monotone" dataKey="rating" stroke="#3b82f6" strokeWidth={2} dot={{r: 3}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
               <div className="h-full flex items-center justify-center text-gray-400">No rating history available</div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 overflow-hidden">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Submissions</h2>
          <div className="overflow-y-auto max-h-72 space-y-3 pr-2">
            {recentSubmissions.map((sub) => (
              <div key={sub.id} className="text-sm border-b border-gray-100 last:border-0 pb-2">
                <div className="flex justify-between items-start">
                  <a href={`https://codeforces.com/contest/${sub.contestId}/problem/${sub.problem.index}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-medium truncate max-w-[150px]">
                    {sub.problem.index}. {sub.problem.name}
                  </a>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(sub.creationTimeSeconds * 1000).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    sub.verdict === 'OK' ? 'bg-green-100 text-green-700' :
                    sub.verdict === 'WRONG_ANSWER' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {sub.verdict === 'OK' ? 'Accepted' : sub.verdict?.replace(/_/g, ' ') || 'Unknown'}
                  </span>
                  <span className="text-xs text-gray-500">{sub.programmingLanguage}</span>
                </div>
              </div>
            ))}
            {recentSubmissions.length === 0 && <p className="text-gray-400 text-sm">No recent submissions found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};