import React, { useEffect, useState } from 'react';
import { cfApi } from '../services/cfApi';
import { Contest } from '../types';

export const ContestList: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'UPCOMING' | 'FINISHED'>('UPCOMING');

  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true);
        const data = await cfApi.getContests(false);
        setContests(data);
      } catch (error) {
        console.error("Failed to fetch contests", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, []);

  const filteredContests = contests.filter(c => {
    if (filter === 'UPCOMING') return c.phase === 'BEFORE';
    if (filter === 'FINISHED') return c.phase === 'FINISHED';
    return true;
  });

  // Sort upcoming by start time (ascending), finished by start time (descending)
  filteredContests.sort((a, b) => {
      const tA = a.startTimeSeconds || 0;
      const tB = b.startTimeSeconds || 0;
      return filter === 'UPCOMING' ? tA - tB : tB - tA;
  });

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}:${mins.toString().padStart(2, '0')}`;
  };

  const formatDate = (seconds?: number) => {
    if (!seconds) return '-';
    return new Date(seconds * 1000).toLocaleString();
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading contests...</div>;

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-wrap gap-4 items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Contests</h2>
        <div className="flex space-x-2">
          {(['UPCOMING', 'FINISHED', 'ALL'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Length</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContests.slice(0, 50).map((contest) => (
                <tr key={contest.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{contest.name}</div>
                    <div className="text-xs text-gray-500">{contest.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(contest.startTimeSeconds)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDuration(contest.durationSeconds)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                       contest.phase === 'BEFORE' ? 'bg-green-100 text-green-800' : 
                       contest.phase === 'CODING' ? 'bg-red-100 text-red-800 animate-pulse' :
                       'bg-gray-100 text-gray-800'
                     }`}>
                       {contest.phase === 'BEFORE' ? 'Upcoming' : contest.phase === 'CODING' ? 'Live' : 'Finished'}
                     </span>
                  </td>
                </tr>
              ))}
              {filteredContests.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No contests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};