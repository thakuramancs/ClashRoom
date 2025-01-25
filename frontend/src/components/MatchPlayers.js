import React, { useState, useEffect, useCallback } from 'react';
import { matchService } from '../services/matchService';

const MatchPlayers = ({ matchId }) => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [roomDetails, setRoomDetails] = useState(null);
    const [match, setMatch] = useState(null);

    const loadPlayers = useCallback(async () => {
        try {
            const matchData = await matchService.getMatch(matchId);
            const playersData = await matchService.getMatchPlayers(matchId);
            setMatch(matchData);
            setPlayers(playersData);
            
            // Only fetch room details if user is authenticated
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const roomData = await matchService.getMatchDetails(matchId);
                    setRoomDetails(roomData);
                } catch (err) {
                    console.error('Room details error:', err);
                    // Don't set error state for room details failure
                }
            }
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Failed to fetch data');
            setLoading(false);
        }
    }, [matchId]);

    useEffect(() => {
        loadPlayers();
        const interval = setInterval(loadPlayers, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, [loadPlayers]);

    if (loading) return <div>Loading players...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            {roomDetails && roomDetails.joined && (
                <div className="mb-6 p-4 bg-gray-50 rounded border">
                    <h3 className="font-bold mb-2">Room Details</h3>
                    {roomDetails.roomDetailsVisible ? (
                        <div className="grid grid-cols-2 gap-4">
                            <p><strong>Room ID:</strong> {roomDetails.roomId}</p>
                            <p><strong>Password:</strong> {roomDetails.roomPassword}</p>
                        </div>
                    ) : (
                        <p className="text-gray-600">
                            Room details will be available 15 minutes before match start
                            {roomDetails.timeToVisibility && 
                                ` (${roomDetails.timeToVisibility} minutes remaining)`
                            }
                        </p>
                    )}
                </div>
            )}

            <div className="bg-white shadow rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Joined Players</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Username
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    In-Game Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Joined At
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {players.map((player) => (
                                <tr key={player.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {player.username}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {player.inGameName || 'Not set'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(player.joinedAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            player.status === 'JOINED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {player.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MatchPlayers; 