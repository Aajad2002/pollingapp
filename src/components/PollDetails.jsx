import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';

function PollDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const [poll, setPoll] = useState(null);
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPoll();

    if (socket) {
      socket.on('pollsUpdated', () => {
        fetchPoll();
      });
    }

    return () => {
      if (socket) {
        socket.off('pollsUpdated');
      }
    };
  }, [socket, id]);

  const fetchPoll = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/polls');
      const polls = await response.json();
      const currentPoll = polls.find(p => p._id === id);
      
      if (!currentPoll) {
        navigate('/');
        return;
      }
      
      setPoll(currentPoll);
    } catch (error) {
      setError('Error fetching poll');
    }
  };

  const handleVote = async (optionIndex) => {
    if (voted) return;

    try {
      const response = await fetch(`http://localhost:8080/api/polls/${id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ optionIndex }),
      });

      if (!response.ok) throw new Error('Failed to vote');

      setVoted(true);
      fetchPoll();
    } catch (err) {
      setError('Failed to submit vote. Please try again.');
    }
  };

  if (!poll) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{poll.question}</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {poll.options.map((option, index) => {
          const percentage = totalVotes > 0 
            ? Math.round((option.votes / totalVotes) * 100) 
            : 0;

          return (
            <div key={index} className="relative">
              <button
                onClick={() => handleVote(index)}
                disabled={voted}
                className={`w-full p-4 text-left rounded-lg border transition-colors relative z-10 ${
                  voted 
                    ? 'bg-gray-50 cursor-default' 
                    : 'hover:bg-indigo-50 hover:border-indigo-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{option.text}</span>
                  <span className="text-gray-600">
                    {option.votes} votes ({percentage}%)
                  </span>
                </div>
              </button>
              <div 
                className="absolute inset-0 bg-indigo-100 rounded-lg transition-all duration-500"
                style={{ width: `${percentage}%`, zIndex: 0 }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center text-gray-600">
        Total votes: {totalVotes}
      </div>
    </div>
  );
}

export default PollDetails;