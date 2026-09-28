import React from "react";
import SkeletonCard from "../SkeletonCard";

function SkeletonGrid({ count = 6, columns = 3, gap = "18px" }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
        marginTop: "var(--space-4)",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default SkeletonGrid;
