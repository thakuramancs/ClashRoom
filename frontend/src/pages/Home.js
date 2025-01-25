import React, { useState, useEffect } from 'react';
import { matchService } from '../services/matchService';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const user = authService.getCurrentUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const data = await matchService.getAllMatches();
      console.log('Fetched matches:', data);
      console.log('Sample match object:', data[0]);
      setMatches(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleJoinMatch = async (matchId) => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }

      await matchService.joinMatch(matchId);
      setSuccessMessage('Successfully joined the match!');
      // Refresh matches to update current players count
      fetchMatches();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to join match');
      console.error('Error joining match:', error);
    }
  };

  const handleViewPlayers = (matchId) => {
    navigate(`/matches/${matchId}`);
  };

  const handleExit = async (matchId) => {
    try {
      await matchService.exitMatch(matchId);
      setSuccessMessage('Successfully exited from match');
      fetchMatches(); // Refresh matches list
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to exit match');
    }
  };

  const canExit = (scheduledTime) => {
    const matchTime = new Date(scheduledTime);
    const fifteenMinutesBefore = new Date(matchTime.getTime() - 15 * 60000);
    return new Date() < fifteenMinutesBefore;
  };

  const filterMatches = (matches) => {
    console.log('Filtering matches with status and joined:', 
      matches.map(m => ({ id: m.id, status: m.status, joined: m.joined }))
    );
    
    return {
      available: matches.filter(match => 
        !match.joined && match.status === 'UPCOMING'
      ),
      joined: matches.filter(match => 
        match.joined && match.status === 'UPCOMING'
      ),
      past: matches.filter(match => 
        match.joined && match.status === 'FINISHED'
      )
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Available Matches</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 mr-2 ${activeTab === 'available' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('available')}
        >
          Available Matches
        </button>
        <button
          className={`px-4 py-2 mr-2 ${activeTab === 'joined' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('joined')}
        >
          Joined Matches
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'past' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('past')}
        >
          Past Matches
        </button>
      </div>

      <div className="grid gap-4">
        {filterMatches(matches)[activeTab].map(match => (
          <div key={match.id} className="border p-4 rounded shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{match.matchTitle}</h3>
                <p>Status: {match.status}</p>
                <p>Scheduled: {formatDate(match.scheduledTime)}</p>
                <p>Entry Fee: ₹{match.entryFee}</p>
                <p>Prize/Kill: ₹{match.prizePerKill}</p>
              </div>
              <div className="flex flex-col gap-2">
                {match.joined && canExit(match.scheduledTime) && (
                  <button
                    onClick={() => handleExit(match.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Exit Match
                  </button>
                )}
                {!match.joined && match.status === 'UPCOMING' && (
                  <button
                    onClick={() => handleJoinMatch(match.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Join Match
                  </button>
                )}
                <button
                  onClick={() => handleViewPlayers(match.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  View Players
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home; 