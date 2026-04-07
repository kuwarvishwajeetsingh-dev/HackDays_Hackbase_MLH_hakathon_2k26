export function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function timeAgoFromMs(msAgo) {
  const s = Math.max(1, Math.round(msAgo / 1000));
  return `Updated ${s} second${s === 1 ? "" : "s"} ago`;
}

