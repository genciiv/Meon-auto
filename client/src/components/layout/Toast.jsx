export default function Toast({ type = "info", message }) {
  if (!message) return null;

  const styles = {
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid rgba(15,23,42,.12)",
    background:
      type === "error"
        ? "rgba(239,68,68,.10)"
        : type === "success"
        ? "rgba(34,197,94,.10)"
        : "rgba(37,99,235,.10)",
    marginBottom: 12,
    fontWeight: 700,
  };

  return <div style={styles}>{message}</div>;
}
