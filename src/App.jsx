import { lazy, Suspense } from 'react'
import Header from './components/Header/Header'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

// Contexts
import { LanguageProvider } from './context/LanguageProvider';
import { AuthProvider } from './context/AuthProvider';

// Главная — в основном бандле, остальные страницы подгружаются по требованию
import Main from './pages/Main';
import Footer from './components/Footer/Footer';

const NewsPage = lazy(() => import('./pages/NewsPage'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const Login = lazy(() => import('./pages/login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const HistoryLLII = lazy(() => import('./pages/HistoryLLII'));
const Structure = lazy(() => import('./pages/Structure'));
const DepartmentDetail = lazy(() => import('./pages/DepartmentDetail'));
const GraphicPerson = lazy(() => import('./pages/GraphicPerson'));
const Science = lazy(() => import('./pages/Science'));
const LegalSupport = lazy(() => import('./pages/LegalSupport'));
const Branches = lazy(() => import('./pages/Branches'));
const Cooperation = lazy(() => import('./pages/Cooperation'));
const CallCenter = lazy(() => import('./pages/CallCenter'));
const Corruption = lazy(() => import('./pages/Corruption'));
const LegalActs = lazy(() => import('./pages/LegalActs'));
const Editions = lazy(() => import('./pages/Editions'));
const RLA = lazy(() => import('./pages/RLA'));
const Contacts = lazy(() => import('./pages/Contacts'));

function RouteFallback() {
  return <div className="route-loading" aria-busy="true" />;
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Header />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/HistoryLLII" element={<HistoryLLII />} />
              <Route path="/Structure" element={<Structure />} />
              <Route path="/department/:id" element={<DepartmentDetail />} />
              <Route path="/GraphicPerson" element={<GraphicPerson />} />
              <Route path="/Science" element={<Science />} />
              <Route path="/LegalSupport" element={<LegalSupport />} />
              <Route path="/Branches" element={<Branches />} />
              <Route path="/Cooperation" element={<Cooperation />} />
              <Route path="/CallCenter" element={<CallCenter />} />
              <Route path="/Corruption" element={<Corruption />} />
              <Route path="/LegalActs" element={<LegalActs />} />
              <Route path="/Editions" element={<Editions />} />
              <Route path="/RLA" element={<RLA />} />
              <Route path="/Contacts" element={<Contacts />} />
            </Routes>
          </Suspense>
          <Footer />
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App
