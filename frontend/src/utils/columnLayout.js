import { useEffect, useState } from "react";

function getColumnCount() {
  const w = window.innerWidth;
  if (w >= 1400) return 4;
  if (w >= 992) return 3;
  if (w >= 576) return 2;
  return 1;
}

export function useColumnCount() {
  const [cols, setCols] = useState(getColumnCount());
  useEffect(() => {
    function handleResize() {
      setCols(getColumnCount());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return cols;
}

export function distributeIntoColumns(entries, columnCount) {
  const columns = Array.from({ length: columnCount }, () => []);
  const heights = Array(columnCount).fill(0);

  const sorted = [...entries].sort((a, b) => b[1].length - a[1].length);

  sorted.forEach(([category, bookmarks]) => {
    const weight = bookmarks.length + 2;
    const minIndex = heights.indexOf(Math.min(...heights));
    columns[minIndex].push([category, bookmarks]);
    heights[minIndex] += weight;
  });

  return columns;
}
