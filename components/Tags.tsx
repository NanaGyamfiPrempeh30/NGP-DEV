export function Tags({ items, max }: { items: string[]; max?: number }) {
  const shown = max ? items.slice(0, max) : items;
  if (shown.length === 0) return null;
  return (
    <ul role="list" className="tags" aria-label="Tools used">
      {shown.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
