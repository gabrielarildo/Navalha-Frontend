export default function Loading({ label = "Carregando..." }) {
  return (
    <div className="row" style={{ padding: "32px 0", justifyContent: "center" }}>
      <span className="spinner" />
      <span className="text-muted">{label}</span>
    </div>
  );
}
