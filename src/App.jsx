import { SiteStateProvider } from './hooks/useSiteState.jsx';
import { useHashScroll } from './hooks/useHashScroll.js';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Hero from './sections/Hero.jsx';
import About from './sections/About.jsx';
import Skills from './sections/Skills.jsx';
import Projects from './sections/Projects.jsx';
import Experience from './sections/Experience.jsx';
import Contact from './sections/Contact.jsx';

function AppContent() {
  // Runs after every section below has mounted and registered its
  // ScrollTrigger (see hooks/useHashScroll.js for why this is needed
  // at all in a client-rendered SPA).
  useHashScroll();

  return (
    <>
      <Navbar />

      <main id="main-content" className="relative">
        <Hero />
        <Projects />
        <About />
        <Skills />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <SiteStateProvider>
      <AppContent />
    </SiteStateProvider>
  );
}
