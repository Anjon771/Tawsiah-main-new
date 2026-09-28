import React from "react";
import { BsHeart, BsStar, BsSearch, BsCartX, BsMap, BsExclamationTriangle } from "react-icons/bs";
import EmptyState from "../EmptyState";

export function EmptyStateFavorites({ onAction }) {
  return (
    <EmptyState
      icon={<BsHeart size={48} color="var(--color-danger)" opacity={0.6} />}
      title="No favorites yet"
      subtitle="Save places you love to see them here."
      actionLabel="Explore Places"
      onAction={onAction}
    />
  );
}

export function EmptyStateReviews({ onAction }) {
  return (
    <EmptyState
      icon={<BsStar size={48} color="var(--color-warning)" opacity={0.6} />}
      title="No reviews yet"
      subtitle="Be the first to share your experience!"
      actionLabel="Write a Review"
      onAction={onAction}
    />
  );
}

export function EmptyStateSearch({ onAction }) {
  return (
    <EmptyState
      icon={<BsSearch size={48} color="var(--color-text-muted)" opacity={0.6} />}
      title="No places found"
      subtitle="Try adjusting your filters or search for a different city."
      actionLabel="Clear Filters"
      onAction={onAction}
    />
  );
}

export function EmptyStateCart({ onAction }) {
  return (
    <EmptyState
      icon={<BsCartX size={48} color="var(--color-text-muted)" opacity={0.6} />}
      title="Your cart is empty"
      subtitle="Add tickets to your order to get started."
      actionLabel="Browse Events"
      onAction={onAction}
    />
  );
}

export function EmptyStateMap({ onAction }) {
  return (
    <EmptyState
      icon={<BsMap size={48} color="var(--color-text-muted)" opacity={0.6} />}
      title="No locations to show"
      subtitle="We couldn't find any places on the map right now."
      actionLabel="Explore Places"
      onAction={onAction}
    />
  );
}

export function EmptyStateError({ onAction }) {
  return (
    <EmptyState
      icon={<BsExclamationTriangle size={48} color="var(--color-warning)" opacity={0.6} />}
      title="Something went wrong"
      subtitle="We couldn't load the data. Please try again later."
      actionLabel="Retry"
      onAction={onAction}
    />
  );
}
