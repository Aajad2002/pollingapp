import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';

function CreatePoll() {
  const navigate = useNavigate();
  const socket = useSocket();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState('');

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      setError('Please enter at least 2 options');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.trim(),
          options: validOptions,
        }),
      });

      if (!response.ok) throw new Error('Failed to create poll');

      const poll = await response.json();
      navigate(`/poll/${poll._id}`);
    } catch (err) {
      setError('Failed to create poll. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create a New Poll</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your question"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Options
          </label>
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    setOptions(newOptions);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={`Option ${index + 1}`}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          {options.length < 6 && (
            <button
              type="button"
              onClick={handleAddOption}
              className="mt-3 text-indigo-600 hover:text-indigo-800"
            >
              + Add Option
            </button>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Create Poll
        </button>
      </form>
    </div>
  );
}

export default CreatePoll;