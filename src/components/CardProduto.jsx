import { Link } from 'react-router-dom'
import { money } from '../lib/format'

export default function CardProduto({ product, cost }) {
  const profit = Number(product.sale_price || 0) - Number(cost || 0)
  return <article className="data-card">
    <div className="card-top"><h3>{product.name}</h3><span className="mini-label">Produto</span></div>
    <div className="metric-row"><span>Custo</span><strong>{money(cost)}</strong></div>
    <div className="metric-row"><span>Venda</span><strong>{product.sale_price ? money(product.sale_price) : '—'}</strong></div>
    {product.sale_price && <div className="metric-row"><span>Lucro unitário</span><strong>{money(profit)}</strong></div>}
    <Link className="button button-secondary full" to={`/produtos/${product.id}`}>Ver detalhes</Link>
  </article>
}
