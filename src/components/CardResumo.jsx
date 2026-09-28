export default function CardResumo({ title, value, description }) {
  return <div className="summary-card"><span>{title}</span><strong>{value}</strong>{description && <small>{description}</small>}</div>
}
