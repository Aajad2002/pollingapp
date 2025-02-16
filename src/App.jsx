import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PollList from './components/PollList';
import CreatePoll from './components/CreatePoll';
import PollDetails from './components/PollDetails';
import { SocketProvider } from './context/SocketContext';

function App() {
  return (
    <Router>
      <SocketProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<PollList />} />
              <Route path="/create" element={<CreatePoll />} />
              <Route path="/poll/:id" element={<PollDetails />} />
            </Routes>
          </main>
        </div>
      </SocketProvider>
    </Router>
  );
}

export default App;