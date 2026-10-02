/**
 * Animated emerald / dark-green cosmic backdrop.
 * Purely decorative: fixed behind every page, no pointer events,
 * and it freezes itself when the visitor prefers reduced motion.
 */
export default function CosmicBackground() {
  return (
    <div className="cosmic-bg" aria-hidden="true">
      <div className="cosmic-aurora" />
      <div className="cosmic-nebula cosmic-nebula-1" />
      <div className="cosmic-nebula cosmic-nebula-2" />
      <div className="cosmic-nebula cosmic-nebula-3" />
      <div className="cosmic-stars" />
      <div className="cosmic-stars cosmic-stars-slow" />
    </div>
  );
}
