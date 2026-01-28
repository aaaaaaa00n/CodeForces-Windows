import React, { useEffect, useState } from 'react';
import { cfApi } from '../services/cfApi';
import { Problem } from '../types';

export const ProblemList: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [minRating, setMinRating] = useState<number | ''>('');
  const [maxRating, setMaxRating] = useState<number | ''>('');

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const data = await cfApi.getProblems();
        // Limit initial load to keep UI snappy, user can search for specific ones
        setProblems(data.problems);
        setFilteredProblems(data.problems.slice(0, 100)); 
      } catch (error) {
        console.error("Failed to fetch problems", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  useEffect(() => {
    let result = problems;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lower) || 
        p.tags.some(t => t.toLowerCase().includes(lower))
      );
    }

    if (minRating !== '') {
      result = result.filter(p => (p.rating || 0) >= minRating);
    }
    
    if (maxRating !== '') {
      result = result.filter(p => (p.rating || 0) <= maxRating);
    }

    setFilteredProblems(result.slice(0, 100));
  }, [searchTerm, minRating, maxRating, problems]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading problemset...</div>;

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Problemset</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by name or tag..."
            className="md:col-span-2 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="number"
            placeholder="Min Rating"
            className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={minRating}
            onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : '')}
          />
          <input
            type="number"
            placeholder="Max Rating"
            className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={maxRating}
            onChange={(e) => setMaxRating(e.target.value ? Number(e.target.value) : '')}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Rating</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProblems.map((problem) => (
                <tr key={`${problem.contestId}${problem.index}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                    <a href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`} target="_blank" rel="noreferrer" className="hover:underline">
                      {problem.contestId}{problem.index}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {problem.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex flex-wrap gap-1">
                      {problem.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                      {problem.tags.length > 3 && <span className="text-xs text-gray-400">+{problem.tags.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">
                    {problem.rating ? (
                       <span className={
                         problem.rating >= 2400 ? 'text-red-500' :
                         problem.rating >= 1900 ? 'text-purple-500' :
                         problem.rating >= 1600 ? 'text-blue-500' :
                         problem.rating >= 1400 ? 'text-cyan-500' :
                         'text-green-500'
                       }>
                         {problem.rating}
                       </span>
                    ) : '-'}
                  </td>
                </tr>
              ))}
              {filteredProblems.length === 0 && (
                <tr>
                   <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No problems found matching criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};