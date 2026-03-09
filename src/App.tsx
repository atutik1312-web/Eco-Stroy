import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProjectProvider } from './context/ProjectContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Portfolio from './pages/Portfolio';
import Calculator from './pages/Calculator';
import Technologies from './pages/Technologies';
import About from './pages/About';
import Contacts from './pages/Contacts';
import ProjectDetails from './pages/ProjectDetails';
import Admin from './pages/Admin';

export default function App() {
  return (
    <ProjectProvider>
      <Router>
        <div className="relative flex min-h-screen w-full flex-col overflow-x-clip">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/:id" element={<ProjectDetails />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/technologies" element={<Technologies />} />
            <Route path="/about" element={<About />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ProjectProvider>
  );
}
