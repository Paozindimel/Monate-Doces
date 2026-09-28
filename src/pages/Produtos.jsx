import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CardProduto from '../components/CardProduto'
import Button from '../components/Button'
import FormField from '../components/FormField'
import { calculateItemCost, money } from '../lib/format'
import { supabase } from '../lib/supabase'

export default function Produtos() {
  const [products, setProducts] = useState([]), [items, setItems] = useState([]), [name, setName] = useState(''), [salePrice, setSalePrice] = useState(''), [components, setComponents] = useState([]), [selected, setSelected] = useState(''), [quantity, setQuantity] = useState(''), [error, setError] = useState(''), [saving, setSaving] = useState(false)

  async function load() {
    const { data: ps, error: pe } = await supabase.from('products').select('*').order('name'); if (pe) return setError(pe.message)
    const { data: cis, error: ce } = await supabase.from('product_items').select('*, cost_items(*)'); if (ce) return setError(ce.message)
    const costs = Object.fromEntries((cis || []).map(x => [x.product_id, (Object.values((cis || []).filter(y => y.product_id === x.product_id)).reduce((s, y) => s + calculateItemCost(y.cost_items, y.quantity), 0))]))
    setProducts((ps || []).map(p => ({ ...p, cost: costs[p.id] || 0 })))
  }
  useEffect(() => { load(); supabase.from('cost_items').select('*, categories(*)').order('name').then(({data}) => setItems(data || [])) }, [])

  const addComponent = () => { const item = items.find(i => i.id === Number(selected)); if (!item || !quantity || Number(quantity) <= 0) return setError('Selecione um item e informe uma quantidade válida.'); if (components.some(c => c.cost_item_id === item.id)) return setError('Esse item já foi adicionado.'); setComponents([...components, { cost_item_id: item.id, quantity: Number(quantity), unit: item.unit, item }]); setSelected(''); setQuantity(''); setError('') }
  const removeComponent = id => setComponents(components.filter(c => c.cost_item_id !== id))
  const partialCost = components.reduce((s, c) => s + calculateItemCost(c.item, c.quantity), 0)
  async function save(e) {
    e.preventDefault(); setError(''); if (!name.trim()) return setError('Informe o nome do produto.'); if (!components.length) return setError('Adicione pelo menos um componente.'); setSaving(true)
    const { data: product, error: pe } = await supabase.from('products').insert({ name: name.trim(), sale_price: salePrice ? Number(salePrice) : null }).select().single()
    if (pe) { setError(pe.message); setSaving(false); return }
    const { error: ce } = await supabase.from('product_items').insert(components.map(c => ({ product_id: product.id, cost_item_id: c.cost_item_id, quantity: c.quantity, unit: c.unit })))
    if (ce) { await supabase.from('products').delete().eq('id', product.id); setError(ce.message) } else { setName(''); setSalePrice(''); setComponents([]); await load() }
    setSaving(false)
  }

  return <div>
    <div className="page-heading"><div><h1>Produtos</h1><p>Monte receitas e veja o custo calculado.</p></div></div>
    <section className="form-panel"><h2>Novo produto</h2><form onSubmit={save}>
      <div className="form-grid"><FormField label="Nome"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Ex.: Brownie Tradicional" /></FormField><FormField label="Preço de venda unitário"><input type="number" step="0.01" min="0" value={salePrice} onChange={e=>setSalePrice(e.target.value)} placeholder="10,00" /></FormField></div>
      <div className="component-builder"><h3>Adicionar componente</h3><div className="form-grid compact"><FormField label="Item cadastrado"><select value={selected} onChange={e=>setSelected(e.target.value)}><option value="">Selecione</option>{items.map(i=><option key={i.id} value={i.id}>{i.name} — {i.unit}</option>)}</select></FormField><FormField label="Quantidade utilizada"><input type="number" step="0.001" min="0" value={quantity} onChange={e=>setQuantity(e.target.value)} placeholder="Ex.: 200" /></FormField><div className="form-actions"><Button type="button" onClick={addComponent}>Adicionar</Button></div></div>
        {!items.length && <p className="warning">Nenhum item cadastrado. Cadastre primeiro em <Link to="/insumos">Insumos</Link>.</p>}
        {components.length > 0 && <div className="component-list">{components.map(c => <div className="component-row" key={c.cost_item_id}><span>{c.item.name}</span><span>{c.quantity} {c.unit}</span><strong>{money(calculateItemCost(c.item,c.quantity))}</strong><button type="button" onClick={()=>removeComponent(c.cost_item_id)}>Remover</button></div>)}</div>}
        <div className="partial-cost">Custo parcial: <strong>{money(partialCost)}</strong></div>
      </div>
      {error && <p className="error">{error}</p>}<Button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar produto'}</Button>
    </form></section>
    <div className="toolbar"><h2>Produtos cadastrados</h2></div><div className="card-grid">{products.map(p => <CardProduto key={p.id} product={p} cost={p.cost} />)}</div>{!products.length && <div className="empty-state">Nenhum produto cadastrado ainda.</div>}
  </div>
}
