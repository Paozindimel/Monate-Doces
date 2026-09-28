import Button from './Button'
import CategoryBadge from './CategoryBadge'
import { money } from '../lib/format'

export default function CardInsumo({ item, onEdit, onDelete }) {
  return <article className="data-card">
    <div className="card-top"><h3>{item.name}</h3><CategoryBadge type={item.categories?.type} /></div>
    <p>Preço base: <strong>{money(item.base_price)}</strong></p>
    <p>Referência: {item.base_quantity} {item.unit}</p>
    <div className="card-actions"><Button variant="secondary" onClick={() => onEdit(item)}>Editar</Button><Button variant="danger" onClick={() => onDelete(item)}>Excluir</Button></div>
  </article>
}
