import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import BulkBuyPage from './pages/BulkBuyPage'
import ColdStoragePage from './pages/ColdStoragePage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        {/* Simple Header */}
        <header className="border-b border-gray-200">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/bulk-buy" className="text-2xl font-bold text-primary">
              Bulk Buy
            </Link>
            <nav className="flex gap-4">
              <Link to="/bulk-buy" className="text-secondary font-semibold hover:text-opacity-80">
                Start Negotiation
              </Link>
              <Link to="/cold-storage" className="text-secondary font-semibold hover:text-opacity-80">
                Cold Storage
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<BulkBuyPage />} />
            <Route path="/bulk-buy" element={<BulkBuyPage />} />
            <Route path="/cold-storage" element={<ColdStoragePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 