import { useId, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Layers3 } from 'lucide-react';

const layers = [
  { id: 'light', label: 'Light', description: 'Amber and violet light give the translucent surface something to pick up.' },
  { id: 'portrait', label: 'Portrait', description: 'The original portrait stays sharp at the center of the frame.' },
  { id: 'glass', label: 'Glass', description: 'A frosted rim blurs the portrait underneath and catches light along its curved edge.' },
  { id: 'type', label: 'Type', description: 'The name, role, and links sit above the effects at full contrast.' }
];

export default function Hero() {
  const controlsId = useId();
  const [inspecting, setInspecting] = useState(false);
  const [activeLayer, setActiveLayer] = useState('glass');
  const [blur, setBlur] = useState(8);
  const layer = layers.find(({ id }) => id === activeLayer);

  function moveLight(event) {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--light-x', `${(event.clientX - left) / width * 100}%`);
    event.currentTarget.style.setProperty('--light-y', `${(event.clientY - top) / height * 100}%`);
  }

  function resetLight(event) {
    event.currentTarget.style.removeProperty('--light-x');
    event.currentTarget.style.removeProperty('--light-y');
  }

  return (
    <section id="hero" aria-label="Introduction" className="portfolio-width pb-8 pt-24 sm:pt-32">
      <div className="liquid-hero" data-inspecting={inspecting} data-layer={activeLayer} style={{ '--rim-blur': `${blur}px` }}>
        <div className="hero-copy">
          <p className="section-label">Frontend developer · Lagos, Nigeria</p>
          <h1>Daniel<br />Lawal<span>.</span></h1>
          <p className="hero-intro">I’m a computer science student building websites from the first sketch through to launch.</p>
          <div className="flex flex-wrap gap-3">
            <a href="#projects" className="hero-action bg-signal font-semibold text-void hover:bg-[#ff9a75]">
              View selected work <ArrowDownRight size={17} aria-hidden="true" />
            </a>
            <a href="/resume/Daniel_Lawal_Resume.pdf" target="_blank" rel="noopener noreferrer" className="hero-action liquid-button">
              Résumé <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <figure className="portrait-stage" onPointerMove={moveLight} onPointerLeave={resetLight}>
            <div className="portrait-light" aria-hidden="true" />
            <img className="portrait-image" src="/images/profile/pic.jpg" alt="Daniel Lawal" width="896" height="1107" fetchPriority="high" />
            <div className="portrait-rim" aria-hidden="true" />
          </figure>
          <button type="button" className="hero-action liquid-button xray-toggle" aria-expanded={inspecting} aria-controls={controlsId} onClick={() => setInspecting(!inspecting)}>
            <Layers3 size={16} aria-hidden="true" /> {inspecting ? 'Close X-Ray' : 'X-Ray'}
          </button>
        </div>

        <div id={controlsId} className="xray-controls glass-panel" hidden={!inspecting}>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Inspect a hero layer">
            {layers.map(({ id, label }) => (
              <button key={id} type="button" aria-pressed={activeLayer === id} className="layer-button" onClick={() => setActiveLayer(id)}>{label}</button>
            ))}
          </div>
          <p className="text-sm text-paper/80" aria-live="polite">{layer.description}</p>
          {activeLayer === 'glass' && (
            <label className="blur-control text-sm">
              Glass blur <input type="range" min="0" max="24" value={blur} onChange={(event) => setBlur(Number(event.target.value))} />
              <output>{blur} px</output>
            </label>
          )}
        </div>
      </div>
    </section>
  );
}
