import { useEffect, useId, useRef, useState } from 'react';
import { X } from 'lucide-react';

export default function ProjectOverlay({ project, onClose, triggerRef }) {
  const titleId = useId();
  const [activeImage, setActiveImage] = useState(0);
  const overlayRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    closeBtnRef.current?.focus();

    const onKeydown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const overlay = overlayRef.current;
      const focusables = overlay?.querySelectorAll('a[href], button:not([disabled])');
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeydown);
    document.body.style.overflow = 'hidden';

    const trigger = triggerRef?.current;
    return () => {
      document.removeEventListener('keydown', onKeydown);
      document.body.style.overflow = '';
      trigger?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!project) return null;
  const cs = project.caseStudy;
  const screenshots = [
    { image: project.image, alt: `${project.title} homepage`, caption: 'Homepage' },
    ...(cs?.gallery ?? [])
  ];
  const screenshot = screenshots[activeImage];

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[95] overflow-y-auto bg-void/90 backdrop-blur-xl"
    >
      <div className="glass-panel relative mx-auto my-4 w-[calc(100%_-_1.5rem)] max-w-4xl rounded-[1.75rem] px-6 py-16 sm:my-8 sm:px-10">
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Close project detail"
          className="absolute right-6 top-6 flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-muted hover:text-paper"
        >
          Close <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>

        <p className="font-mono text-eyebrow uppercase tracking-widest text-signal">{project.category}</p>
        <h2 id={titleId} className="mt-3 font-display text-display-1 text-paper">{project.title}</h2>
        <p className="mt-4 max-w-2xl font-body text-paper/70">{project.description}</p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {project.technologies.map((t) => (
            <li key={t} className="rounded-full border border-depth-2 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted">
              {t}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex gap-4">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener"
              className="rounded-full bg-signal px-5 py-2 font-mono text-xs uppercase tracking-widest text-void"
            >
              Live site
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener"
              className="rounded-full border border-paper/30 px-5 py-2 font-mono text-xs uppercase tracking-widest text-paper"
            >
              Source
            </a>
          )}
        </div>

        <figure className="case-gallery mt-8 rounded-2xl border border-paper/15 bg-void/60 p-2 sm:p-3">
          <img src={screenshot.image} alt={screenshot.alt} className="case-screenshot w-full rounded-xl" />
          <figcaption className="px-2 py-3 text-sm text-paper/80" aria-live="polite">{screenshot.caption}</figcaption>
          {screenshots.length > 1 && (
            <div className="flex flex-wrap gap-2 px-2 pb-2" role="group" aria-label="Case study screenshots">
              {screenshots.map(({ image }, index) => (
                <button key={image} type="button" className="layer-button" aria-pressed={activeImage === index} onClick={() => setActiveImage(index)}>
                  {index === 0 ? 'Homepage' : `Project view ${index}`}
                </button>
              ))}
            </div>
          )}
        </figure>

        {cs ? (
          <>
            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="font-mono text-[11px] uppercase tracking-widest text-muted">Overview</h3>
                <p className="mt-2 font-body text-paper/75">{cs.overview}</p>
              </div>
              <div>
                <h3 className="font-mono text-[11px] uppercase tracking-widest text-muted">Role</h3>
                <p className="mt-2 font-body text-paper/75">{cs.role}</p>
              </div>
              <div>
                <h3 className="font-mono text-[11px] uppercase tracking-widest text-muted">Problem</h3>
                <p className="mt-2 font-body text-paper/75">{cs.problem}</p>
              </div>
              <div>
                <h3 className="font-mono text-[11px] uppercase tracking-widest text-muted">Solution</h3>
                <p className="mt-2 font-body text-paper/75">{cs.solution}</p>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="font-mono text-[11px] uppercase tracking-widest text-muted">Key features</h3>
              <ul className="mt-2 space-y-1">
                {cs.keyFeatures.map((f) => (
                  <li key={f} className="font-body text-paper/75">
                    — {f}
                  </li>
                ))}
              </ul>
            </div>
            {cs.designDecision && (
              <aside className="mt-8 rounded-2xl border border-signal/30 bg-signal/5 p-5 sm:p-7">
                <p className="section-label">Design decision</p>
                <h3 className="mt-2 font-display text-2xl text-paper">{cs.designDecision.title}</h3>
                <p className="mt-3 max-w-prose leading-relaxed text-paper/80">{cs.designDecision.description}</p>
              </aside>
            )}
          </>
        ) : (
          <p className="mt-12 rounded-xl border border-dashed border-depth-2 p-6 font-mono text-xs uppercase tracking-widest text-muted">
            Case study coming soon.
          </p>
        )}
      </div>
    </div>
  );
}
