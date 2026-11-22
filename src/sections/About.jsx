import { createElement } from 'react';
import { Code2, GraduationCap, PanelsTopLeft } from 'lucide-react';

const focusAreas = [
  {
    title: 'Interface design',
    description: 'I organize content around what a visitor needs to do next. For Prestige Beauty, that meant making it easy to go from browsing services to booking an appointment.',
    Icon: PanelsTopLeft
  },
  {
    title: 'Web development',
    description: 'I build responsive interfaces with HTML, CSS, JavaScript, and React, and use PHP or APIs when a project needs a backend.',
    Icon: Code2
  },
  {
    title: 'Computer science',
    description: 'I study Computer Science at LASUED and use independent projects to put what I learn into practice.',
    Icon: GraduationCap
  }
];

export default function About() {
  return (
    <section id="about" className="portfolio-width py-12 sm:py-20" aria-labelledby="about-title">
      <div className="work-heading">
        <div>
          <p className="section-label">About</p>
          <h2 id="about-title">How I build<span>.</span></h2>
        </div>
        <p>I’m Daniel Lawal, a frontend developer and Computer Science student based in Lagos.</p>
      </div>
      <ul className="about-grid">
        {focusAreas.map(({ title, description, Icon }) => (
          <li className="glass-panel rounded-2xl p-5 sm:p-7" key={title}>
            {createElement(Icon, { className: 'mb-5 text-signal', size: 23, 'aria-hidden': true })}
            <h3 className="font-display text-xl font-semibold">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-paper/80">{description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
