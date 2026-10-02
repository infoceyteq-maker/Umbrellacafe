"use client";

/**
 * Permanently animated side tab that opens the offers panel.
 * It sits vertically centred on the right edge on every screen size.
 */
export default function OffersButton({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={count > 0 ? `View ${count} offers` : "View offers"}
      className="offers-tab group"
    >
      <span className="offers-tab-glow" aria-hidden="true" />
      <span className="offers-tab-ring" aria-hidden="true" />
      <span className="offers-tab-inner">
        <span className="offers-tab-icon" aria-hidden="true">
          🏷️
        </span>
        <span className="offers-tab-label">Offers</span>
        {count > 0 && <span className="offers-tab-count">{count}</span>}
      </span>
      <span className="offers-tab-shine" aria-hidden="true" />
    </button>
  );
}
