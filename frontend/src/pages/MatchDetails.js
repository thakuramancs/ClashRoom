import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { matchService } from '../services/matchService';
import MatchPlayers from '../components/MatchPlayers';

const MatchDetails = () => {
    const { matchId } = useParams();
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadMatch();
    }, [matchId]);

    const loadMatch = async () => {
        try {
            const data = await matchService.getMatch(matchId);
            setMatch(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load match details');
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!match) return <div>Match not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">{match.matchTitle}</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-600">Game Type: {match.gameType}</p>
                        <p className="text-gray-600">Map: {match.mapName}</p>
                        <p className="text-gray-600">Status: {match.status}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Players: {match.currentPlayers}/{match.maxPlayers}</p>
                        <p className="text-gray-600">Entry Fee: ${match.entryFee}</p>
                        <p className="text-gray-600">Prize per Kill: ${match.prizePerKill}</p>
                    </div>
                </div>
            </div>
            
            <MatchPlayers matchId={matchId} />
        </div>
    );
};

export default MatchDetails; 