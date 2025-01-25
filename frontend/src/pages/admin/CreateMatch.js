import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchService } from '../../services/matchService';

const CreateMatch = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    matchTitle: '',
    gameType: 'SOLO',
    mapName: 'ERANGEL',
    maxPlayers: 100,
    entryFee: 0,
    prizePerKill: 0,
    scheduledTime: '',
    roomDetailsVisible: false,
    rankPrizes: [
      { rank: 1, prizeAmount: 0 },
      { rank: 2, prizeAmount: 0 },
      { rank: 3, prizeAmount: 0 }
    ]
  });

  const formatDisplayTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Create date object from the input
      const scheduledDateTime = new Date(formData.scheduledTime);
      const now = new Date();
      
      // Debug logs
      console.log('Input scheduled time:', formData.scheduledTime);
      console.log('Parsed scheduled time:', scheduledDateTime);
      console.log('Current time:', now);
      
      if (scheduledDateTime.getTime() <= now.getTime()) {
        setError('Please select a future time');
        return;
      }

      const formattedData = {
        ...formData,
        scheduledTime: formData.scheduledTime // Send the original input value
      };
      
      await matchService.createMatch(formattedData);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create match');
      console.error('Error creating match:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxPlayers' || name === 'entryFee' || name === 'prizePerKill' 
        ? Number(value) 
        : value
    }));
  };

  const handleRankPrizeChange = (index, value) => {
    const updatedRankPrizes = [...formData.rankPrizes];
    updatedRankPrizes[index] = {
      ...updatedRankPrizes[index],
      prizeAmount: Number(value)
    };
    setFormData(prev => ({
      ...prev,
      rankPrizes: updatedRankPrizes
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Create New Match</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Match Title</label>
            <input
              type="text"
              name="matchTitle"
              value={formData.matchTitle}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Game Type</label>
            <select
              name="gameType"
              value={formData.gameType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="SOLO">Solo</option>
              <option value="DUO">Duo</option>
              <option value="SQUAD">Squad</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Map</label>
            <select
              name="mapName"
              value={formData.mapName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="ERANGEL">Erangel</option>
              <option value="MIRAMAR">Miramar</option>
              <option value="SANHOK">Sanhok</option>
              <option value="VIKENDI">Vikendi</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Max Players</label>
            <input
              type="number"
              name="maxPlayers"
              value={formData.maxPlayers}
              onChange={handleChange}
              min="1"
              max="100"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Entry Fee</label>
            <input
              type="number"
              name="entryFee"
              value={formData.entryFee}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Prize Per Kill</label>
            <input
              type="number"
              name="prizePerKill"
              value={formData.prizePerKill}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Scheduled Time
            </label>
            <div className="flex flex-col space-y-2">
              <input
                type="datetime-local"
                name="scheduledTime"
                value={formData.scheduledTime}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min={new Date().toISOString().slice(0, 16)}
              />
              {formData.scheduledTime && (
                <div className="text-sm text-gray-600">
                  Selected Time: {formatDisplayTime(formData.scheduledTime)}
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="roomDetailsVisible"
                checked={formData.roomDetailsVisible}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  roomDetailsVisible: e.target.checked
                }))}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Show Room Details</span>
            </label>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Rank Prizes</label>
            {formData.rankPrizes.map((prize, index) => (
              <div key={index} className="flex items-center space-x-4">
                <span className="text-sm font-medium">Rank {prize.rank}</span>
                <input
                  type="number"
                  value={prize.prizeAmount}
                  onChange={(e) => handleRankPrizeChange(index, e.target.value)}
                  min="0"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Match
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMatch; 