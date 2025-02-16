import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            Real-time Polls
          </Link>
          <Link
            to="/create"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create Poll
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;