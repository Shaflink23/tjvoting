import React from 'react';
import { ArrowLeft, Trophy, TrendingUp, TrendingDown, Users, MessageSquare, Calendar } from 'lucide-react';
import { useApp } from '../App';

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const { employees, votes, setIsAdmin } = useApp();

  const handleLogout = () => {
    setIsAdmin(false);
    onBack();
  };

  // Calculate vote counts per employee
  const voteCount = votes.reduce((acc, vote) => {
    acc[vote.employeeId] = (acc[vote.employeeId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Find winner (most voted)
  const mostVotedId = Object.keys(voteCount).reduce((a, b) => 
    voteCount[a] > voteCount[b] ? a : b, Object.keys(voteCount)[0]
  );

  // Find least voted (among those with votes)
  const leastVotedId = Object.keys(voteCount).reduce((a, b) => 
    voteCount[a] < voteCount[b] ? a : b, Object.keys(voteCount)[0]
  );

  const winner = employees.find(emp => emp.id === mostVotedId);
  const leastVoted = employees.find(emp => emp.id === leastVotedId);

  // Get comments for winner (anonymized)
  const winnerComments = votes
    .filter(vote => vote.employeeId === mostVotedId)
    .map(vote => vote.comment);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={handleLogout}
          className="flex items-center bg-[#f6931b] text-white px-5 py-2 rounded-full font-semibold hover:bg-orange-500 mb-2 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Logout
        </button>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Employee of the Month - September 2025</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Previous Big Winner Card - Employee of the Month */}
      <div className="w-full md:w-1/2 lg:w-1/3 bg-white rounded-xl shadow-lg p-6 flex flex-col items-center mb-6 border border-orange-200 mx-auto">
        {winner && votes.length > 0 ? (
          <>
            <div className="flex items-center mb-4">
              <div className="w-20 h-20 rounded-full bg-[#f6931b] flex items-center justify-center mr-4 overflow-hidden">
                {winner.avatar ? (
                  <img src={winner.avatar} alt={winner.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-3xl font-bold text-white">{(() => { const names = winner.name.trim().split(' '); const first = names[0]?.[0] || ''; const last = names.length > 1 ? names[names.length - 1][0] : ''; return (first + last).toUpperCase(); })()}</span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#f6931b]">Employee of the Month</h2>
                <p className="text-gray-700 font-semibold">{winner.name}</p>
                <p className="text-sm text-gray-500">September 2025</p>
              </div>
            </div>
            <div className="w-full bg-[#f6931b] bg-opacity-10 rounded-lg p-4 mt-2">
              <p className="text-gray-700 text-center">Outstanding performance and dedication.</p>
            </div>
          </>
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-8">
            <h2 className="text-xl font-bold text-[#f6931b] mb-2">Employee of the Month</h2>
            <p className="text-gray-500">No votes have been cast yet. The winner will appear here once voting begins.</p>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Votes</p>
              <p className="text-2xl font-bold text-gray-900">{votes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Participation</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round((votes.length / employees.length) * 100)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center">
            <Trophy className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Winner Votes</p>
              <p className="text-2xl font-bold text-gray-900">
                {mostVotedId ? voteCount[mostVotedId] : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Winner */}
        {winner && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#f6931b]/40">
            <div className="flex items-center mb-6">
              <Trophy className="h-8 w-8 text-[#f6931b] mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Employee of the Month Winner</h2>
            </div>
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px] rounded-full flex items-center justify-center overflow-hidden shadow mr-4" style={{ background: '#f6931b', boxSizing: 'border-box', border: '3px solid #fff' }}>
                {winner.avatar ? (
                  <img src={winner.avatar} alt={winner.name} className="w-full h-full object-cover rounded-full" style={{width:'64px',height:'64px'}} />
                ) : (
                  <span className="text-white font-bold text-2xl select-none text-center w-full">
                    {(() => {
                      const names = winner.name.trim().split(' ');
                      const first = names[0]?.[0] || '';
                      const last = names.length > 1 ? names[names.length - 1][0] : '';
                      return (first + last).toUpperCase();
                    })()}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{winner.name}</h3>
                <p className="text-lg font-semibold text-[#f6931b]">
                  {voteCount[winner.id]} votes
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Recent Comments:</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {winnerComments.slice(-3).map((comment, index) => (
                  <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    "{comment}"
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Least Voted */}
        {leastVoted && leastVoted.id !== mostVotedId && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-200">
            <div className="flex items-center mb-6">
              <TrendingDown className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Needs Recognition</h2>
            </div>
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px] rounded-full flex items-center justify-center overflow-hidden shadow mr-4" style={{ background: '#3b82f6', boxSizing: 'border-box', border: '3px solid #fff' }}>
                {leastVoted.avatar ? (
                  <img src={leastVoted.avatar} alt={leastVoted.name} className="w-full h-full object-cover rounded-full" style={{width:'64px',height:'64px'}} />
                ) : (
                  <span className="text-white font-bold text-2xl select-none text-center w-full">
                    {(() => {
                      const names = leastVoted.name.trim().split(' ');
                      const first = names[0]?.[0] || '';
                      const last = names.length > 1 ? names[names.length - 1][0] : '';
                      return (first + last).toUpperCase();
                    })()}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{leastVoted.name}</h3>
                <p className="text-lg font-semibold text-blue-700">
                  {voteCount[leastVoted.id] || 0} votes
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-blue-600 bg-blue-100 p-3 rounded">
              Consider recognizing this employee's contributions to boost team morale.
            </p>
          </div>
        )}
      </div>

      {/* All Employees Vote Count */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Vote Distribution</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {employees.map((employee) => (
            <div key={employee.id} className="bg-gray-50 rounded-lg p-4 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px] rounded-full flex items-center justify-center overflow-hidden shadow mb-3" style={{ background: '#f6931b', boxSizing: 'border-box', border: '3px solid #fff' }}>
                {employee.avatar ? (
                  <img src={employee.avatar} alt={employee.name} className="w-full h-full object-cover rounded-full" style={{width:'64px',height:'64px'}} />
                ) : (
                  <span className="text-white font-bold text-2xl select-none text-center w-full">
                    {(() => {
                      const names = employee.name.trim().split(' ');
                      const first = names[0]?.[0] || '';
                      const last = names.length > 1 ? names[names.length - 1][0] : '';
                      return (first + last).toUpperCase();
                    })()}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{employee.name}</h3>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                employee.id === mostVotedId 
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {voteCount[employee.id] || 0} votes
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;