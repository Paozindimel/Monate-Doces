import { useEffect, useState } from 'react'
import CardInsumo from '../components/CardInsumo'
import Button from '../components/Button'
import FormField from '../components/FormField'
import { supabase } from '../lib/supabase'

const empty = { id: null, name: '', category_id: '', base_price: '', base_quantity: '', unit: 'g' }

export default function Insumos() {
  const [items, setItems] = useState([]), [categories, setCategories] = useState([]), [form, setForm] = useState(empty)
  const [filter, setFilter] = useState('todos'), [editing, setEditing] = useState(false), [error, setError] = useState(''), [saving, setSaving] = useState(false)

  async function load() {
    const { data, error } = await supabase.from('cost_items').select('*, categories(id,name,type)').order('name')
    if (error) setError(error.message); else setItems(data || [])
  }
  useEffect(() => { load(); supabase.from('categories').select('*').order('id').then(({data}) => setCategories(data || [])) }, [])

  const visible = filter === 'todos' ? items : items.filter(i => i.categories?.type === filter)
  const update = e => setForm({ ...form, [e.target.name]: e.target.value })

  async function save(e) {
    e.preventDefault(); setError('')
    if (!form.name || !form.category_id || !form.base_price || !form.base_quantity || !form.unit) return setError('Preencha todos os campos obrigatórios.')
    setSaving(true)
    const payload = { name: form.name.trim(), category_id: Number(form.category_id), base_price: Number(form.base_price), base_quantity: Number(form.base_quantity), unit: form.unit }
    const result = editing ? await supabase.from('cost_items').update(payload).eq('id', form.id) : await supabase.from('cost_items').insert(payload)
    if (result.error) setError(result.error.message); else { setForm(empty); setEditing(false); await load() }
    setSaving(false)
  }
  function edit(item) { setEditing(true); setForm({ ...item, category_id: item.category_id }); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  async function remove(item) { if (!confirm(`Excluir ${item.name}?`)) return; const { error } = await supabase.from('cost_items').delete().eq('id', item.id); if (error) setError(error.message); else load() }

  return <div>
    <div className="page-heading"><div><h1>Insumos e custos</h1><p>Cadastre os valores-base usados nas receitas.</p></div></div>
    <section className="form-panel"><h2>{editing ? 'Editar item' : 'Novo item de custo'}</h2>
      <form className="form-grid" onSubmit={save}>
        <FormField label="Nome"><input name="name" value={form.name} onChange={update} placeholder="Ex.: Chocolate" /></FormField>
        <FormField label="Categoria"><select name="category_id" value={form.category_id} onChange={update}><option value="">Selecione</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></FormField>
        <FormField label="Preço base"><input name="base_price" type="number" step="0.01" min="0" value={form.base_price} onChange={update} placeholder="0,00" /></FormField>
        <FormField label="Quantidade de referência"><input name="base_quantity" type="number" step="0.001" min="0" value={form.base_quantity} onChange={update} placeholder="1000" /></FormField>
        <FormField label="Unidade"><select name="unit" value={form.unit} onChange={update}><option value="g">g</option><option value="kg">kg</option><option value="ml">ml</option><option value="l">l</option><option value="un">un</option><option value="pacote">pacote</option></select></FormField>
        <div className="form-actions"><Button type="submit" disabled={saving}>{saving ? 'Salvando...' : editing ? 'Salvar alteração' : 'Cadastrar item'}</Button>{editing && <Button variant="secondary" onClick={() => { setEditing(false); setForm(empty) }}>Cancelar</Button>}</div>
      </form>{error && <p className="error">{error}</p>}
    </section>
    <div className="toolbar"><h2>Itens cadastrados</h2><div className="filters">{[['todos','Todos'],['insumo','Insumos'],['embalagem','Embalagens'],['gasto_indireto','Indiretos']].map(([value,label]) => <button key={value} className={filter===value?'filter-active':''} onClick={() => setFilter(value)}>{label}</button>)}</div></div>
    <div className="card-grid">{visible.map(item => <CardInsumo key={item.id} item={item} onEdit={edit} onDelete={remove} />)}</div>
    {!visible.length && <div className="empty-state">Nenhum item encontrado. Cadastre o primeiro acima.</div>}
  </div>
}
