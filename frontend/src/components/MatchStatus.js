import React from 'react';

const MatchStatus = ({ status }) => {
    const getStatusColor = () => {
        switch (status) {
            case 'UPCOMING':
                return 'bg-blue-100 text-blue-800';
            case 'LIVE':
                return 'bg-green-100 text-green-800';
            case 'FINISHED':
                return 'bg-gray-100 text-gray-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor()}`}>
            {status}
        </span>
    );
};

export default MatchStatus; 