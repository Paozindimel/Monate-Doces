import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import BackButton from '../components/BackButton'
import { calculateItemCost, money } from '../lib/format'
import { supabase } from '../lib/supabase'

export default function ProdutoDetalhe() {
  const { id } = useParams(); const [product,setProduct]=useState(null); const [components,setComponents]=useState([]); const [error,setError]=useState('')
  useEffect(()=>{(async()=>{const {data:p,error:pe}=await supabase.from('products').select('*').eq('id',id).single(); const {data:c,error:ce}=await supabase.from('product_items').select('*, cost_items(*, categories(*))').eq('product_id',id); if(pe||ce)setError((pe||ce).message);setProduct(p);setComponents(c||[])})()},[id])
  if(error)return <p className="error">{error}</p>; if(!product)return <p>Carregando...</p>
  const total=components.reduce((s,c)=>s+calculateItemCost(c.cost_items,c.quantity),0), profit=Number(product.sale_price||0)-total, margin=Number(product.sale_price)>0?(profit/Number(product.sale_price))*100:0
  return <div><BackButton/><div className="page-heading"><div><h1>{product.name}</h1><p>Formação do custo do produto.</p></div></div><section className="detail-panel"><div className="detail-header"><div><span>Custo total</span><strong>{money(total)}</strong></div><div><span>Preço de venda</span><strong>{product.sale_price?money(product.sale_price):'—'}</strong></div><div><span>Lucro unitário</span><strong>{product.sale_price?money(profit):'—'}</strong></div><div><span>Margem</span><strong>{product.sale_price?`${margin.toFixed(1)}%`:'—'}</strong></div></div><h2>Composição</h2><div className="component-list">{components.map(c=><div className="component-row" key={c.id}><span>{c.cost_items.name}</span><span>{c.quantity} {c.unit}</span><span>{c.cost_items.categories?.name}</span><strong>{money(calculateItemCost(c.cost_items,c.quantity))}</strong></div>)}</div></section></div>
}
