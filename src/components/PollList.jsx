import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';

function PollList() {
  const [polls, setPolls] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    fetchPolls();

    if (socket) {
      socket.on('pollsUpdated', () => {
        fetchPolls();
      });
    }

    return () => {
      if (socket) {
        socket.off('pollsUpdated');
      }
    };
  }, [socket]);

  const fetchPolls = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/polls');
      const data = await response.json();
      setPolls(data);
    } catch (error) {
      console.error('Error fetching polls:', error);
    }
  };

  return (
    <div className="grid gap-6">
      {polls.map((poll) => (
        <Link
          key={poll._id}
          to={`/poll/${poll._id}`}
          className="block bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {poll.question}
          </h3>
          <div className="flex justify-between text-gray-600">
            <span>{poll.options.length} options</span>
            <span>
              {poll.options.reduce((sum, option) => sum + option.votes, 0)} votes
            </span>
          </div>
        </Link>
      ))}
      {polls.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No polls available. Create one!
        </div>
      )}
    </div>
  );
}

export default PollList;