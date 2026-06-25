export default function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state">
      <h4 style={{ marginBottom: 6 }}>{title}</h4>
      {description && <p style={{ marginBottom: action ? 16 : 0 }}>{description}</p>}
      {action}
    </div>
  );
}
