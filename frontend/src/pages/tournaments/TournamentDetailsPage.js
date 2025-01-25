import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TournamentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);

  // Add this to fetch tournament details based on ID
  useEffect(() => {
    const fetchTournamentDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/tournaments/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setTournament(data);
        }
      } catch (error) {
        console.error('Error fetching tournament details:', error);
      }
    };

    fetchTournamentDetails();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Tournament Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{tournament?.name}</h1>
              <p className="mt-2 text-gray-600">{tournament?.game}</p>
            </div>
            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800">
              {tournament?.status}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-gray-500">Start Date</span>
              <p className="font-medium">{tournament?.startDate}</p>
            </div>
            <div>
              <span className="text-gray-500">End Date</span>
              <p className="font-medium">{tournament?.endDate}</p>
            </div>
            <div>
              <span className="text-gray-500">Prize Pool</span>
              <p className="font-medium text-green-600">{tournament?.prizePool}</p>
            </div>
          </div>
          <p className="mt-4 text-gray-600">{tournament?.description}</p>
        </div>

        {/* Teams Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Participating Teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tournament?.teams.map((team) => (
              <div key={team.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{team.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    team.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {team.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Members: {team.members}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Tournament Schedule</h2>
          <div className="space-y-4">
            {tournament?.schedule.map((event) => (
              <div key={event.id} className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="font-semibold">{event.round}</h3>
                  <p className="text-sm text-gray-500">{event.date}</p>
                </div>
                <span className="text-indigo-600 font-medium">{event.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={() => navigate('/dashboard')}
        className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default TournamentDetailsPage; 