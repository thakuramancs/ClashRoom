import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { matchService } from '../../services/matchService';

const EditMatch = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showRoomForm, setShowRoomForm] = useState(false);
  
  const [formData, setFormData] = useState({
    matchTitle: '',
    gameType: 'SOLO',
    mapName: 'ERANGEL',
    maxPlayers: 100,
    entryFee: 0,
    prizePerKill: 0,
    scheduledTime: '',
    rankPrizes: [
      { rank: 1, prizeAmount: 0 },
      { rank: 2, prizeAmount: 0 },
      { rank: 3, prizeAmount: 0 }
    ]
  });

  const [roomData, setRoomData] = useState({
    roomId: '',
    roomPassword: ''
  });

  useEffect(() => {
    fetchMatch();
  }, [matchId]);

  const fetchMatch = async () => {
    try {
      const data = await matchService.getMatch(matchId);
      setFormData(data);
      if (data.roomId) {
        setRoomData({
          roomId: data.roomId || '',
          roomPassword: data.roomPassword || ''
        });
      }
    } catch (err) {
      setError('Failed to fetch match details');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoomChange = (e) => {
    const { name, value } = e.target;
    setRoomData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateMatch = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await matchService.updateMatch(matchId, formData);
      setSuccess('Match details updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to update match');
    }
  };

  const handleShareRoom = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await matchService.updateRoomDetails(matchId, roomData);
      setSuccess('Room credentials shared successfully');
      setShowRoomForm(false);
    } catch (err) {
      setError(err.message || 'Failed to share room credentials');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6">Edit Match</h2>

      <form onSubmit={handleUpdateMatch} className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700">Match Title</label>
          <input
            type="text"
            name="matchTitle"
            value={formData.matchTitle}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Game Type</label>
          <select
            name="gameType"
            value={formData.gameType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="SOLO">Solo</option>
            <option value="DUO">Duo</option>
            <option value="SQUAD">Squad</option>
          </select>
        </div>

        {/* Add other match fields similarly */}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update Match Details
        </button>
      </form>

      <div className="mt-8 border-t pt-6">
        <button
          onClick={() => setShowRoomForm(!showRoomForm)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {showRoomForm ? 'Hide Room Form' : 'Share Room Credentials'}
        </button>

        {showRoomForm && (
          <form onSubmit={handleShareRoom} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Room ID</label>
              <input
                type="text"
                name="roomId"
                value={roomData.roomId}
                onChange={handleRoomChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Room Password</label>
              <input
                type="text"
                name="roomPassword"
                value={roomData.roomPassword}
                onChange={handleRoomChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Share Room Credentials
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditMatch; 