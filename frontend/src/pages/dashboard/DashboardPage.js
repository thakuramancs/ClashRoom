import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();

  const tournaments = [
    { id: 1, name: 'Spring Championship', game: 'League of Legends', date: '2024-04-15', status: 'Upcoming' },
    { id: 2, name: 'Summer Cup', game: 'DOTA 2', date: '2024-05-20', status: 'Registration Open' },
  ];

  const matches = [
    { id: 1, team1: 'Team A', team2: 'Team B', game: 'CS:GO', time: '14:00', date: '2024-03-25' },
    { id: 2, team1: 'Team C', team2: 'Team D', game: 'Valorant', time: '16:00', date: '2024-03-25' },
  ];

  const handleTournamentClick = (tournamentId) => {
    navigate(`/tournament/${tournamentId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Tournaments Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Tournaments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tournaments.map((tournament) => (
              <div key={tournament.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2">{tournament.name}</h3>
                <div className="text-gray-600">
                  <p>Game: {tournament.game}</p>
                  <p>Date: {tournament.date}</p>
                  <p>Status: <span className="text-green-600">{tournament.status}</span></p>
                </div>
                <button 
                  onClick={() => handleTournamentClick(tournament.id)}
                  className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Matches Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Upcoming Matches</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {matches.map((match) => (
                <li key={match.id} className="hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium">{match.team1}</span>
                        <span className="text-gray-500">vs</span>
                        <span className="font-medium">{match.team2}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{match.game}</p>
                        <p className="text-sm text-gray-500">{match.date} - {match.time}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 