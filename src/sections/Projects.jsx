import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import ProjectOverlay from '../components/ProjectOverlay.jsx';
import { projects } from '../data/projects.js';

const accents = ['#d28855', '#8e9ef5', '#cc7870'];
const projectHash = (id) => `#project/${id}`;

function readProject() {
  return projects.find(({ id, caseStudy }) => caseStudy && projectHash(id) === window.location.hash);
}

export default function Projects() {
  const listRef = useRef(null);
  const triggerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openProject, setOpenProject] = useState(readProject);
  const activeProject = projects[activeIndex];

  useEffect(() => {
    function syncProject() {
      setOpenProject(readProject());
    }
    window.addEventListener('hashchange', syncProject);
    window.addEventListener('popstate', syncProject);
    return () => {
      window.removeEventListener('hashchange', syncProject);
      window.removeEventListener('popstate', syncProject);
    };
  }, []);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible) setActiveIndex(Number(visible.target.dataset.index));
    }, { rootMargin: '-38% 0px -54% 0px' });
    const cards = listRef.current.querySelectorAll('[data-index]');
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  function showProject(event, project) {
    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    event.preventDefault();
    triggerRef.current = event.currentTarget;
    window.history.pushState({ portfolioCaseStudy: true }, '', projectHash(project.id));
    setOpenProject(project);
  }

  function closeProject() {
    if (window.history.state?.portfolioCaseStudy) {
      window.history.back();
      return;
    }
    window.history.replaceState(null, '', '#projects');
    setOpenProject(undefined);
  }

  return (
    <section id="projects" className="portfolio-width py-12 sm:py-20" aria-labelledby="work-title">
      <div className="work-heading">
        <div>
          <p className="section-label">Portfolio</p>
          <h2 id="work-title">Selected work<span>.</span></h2>
        </div>
        <p>From an early foundation site to a full salon experience, these projects show what I’ve learned by building.</p>
      </div>

      <div className="project-spotlight">
        <ul ref={listRef} className="work-list">
          {projects.map((project, index) => (
            <li key={project.id} data-index={index} data-active={activeIndex === index} className="work-entry glass-panel" onPointerEnter={() => setActiveIndex(index)} onFocus={() => setActiveIndex(index)}>
              <img className="work-mobile-image" src={project.image} alt={`${project.title} homepage`} loading="lazy" width="1200" height="750" />
              <p className="section-label">{project.caseStudy?.role ?? 'In progress'}</p>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <ul className="work-tags" aria-label="Technologies">
                {project.technologies.map((tech) => <li key={tech}>{tech}</li>)}
              </ul>
              {project.caseStudy && <a href={projectHash(project.id)} className="work-link" onClick={(event) => showProject(event, project)}>Read case study <ArrowUpRight size={16} aria-hidden="true" /></a>}
            </li>
          ))}
        </ul>

        <div className="spotlight-frame glass-panel" style={{ '--spotlight-accent': accents[activeIndex] }} aria-hidden="true">
          <div className="spotlight-images">
            {projects.map((project, index) => (
              <img key={project.id} className={index === activeIndex ? 'is-visible' : ''} src={project.image} alt="" width="1200" height="750" loading={index === 0 ? 'eager' : 'lazy'} />
            ))}
          </div>
          <p>{activeProject.title}</p>
        </div>
      </div>

      {openProject && <ProjectOverlay key={openProject.id} project={openProject} onClose={closeProject} triggerRef={triggerRef} />}
    </section>
  );
}
