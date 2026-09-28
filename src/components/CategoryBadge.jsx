export default function CategoryBadge({ type }) {
  const labels = { insumo: 'Insumo', embalagem: 'Embalagem', gasto_indireto: 'Gasto indireto' }
  return <span className="badge">{labels[type] || type}</span>
}
