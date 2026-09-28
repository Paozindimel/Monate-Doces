import { useEffect, useState } from 'react'
import FormField from '../components/FormField'
import SimulationResult from '../components/SimulationResult'
import { calculateItemCost } from '../lib/format'
import { supabase } from '../lib/supabase'

export default function Simulacao(){
 const [products,setProducts]=useState([]),[productId,setProductId]=useState(''),[quantity,setQuantity]=useState(1),[salePrice,setSalePrice]=useState(''),[result,setResult]=useState(null),[error,setError]=useState('')
 useEffect(()=>{supabase.from('products').select('*').order('name').then(({data})=>setProducts(data||[]))},[])
 async function simulate(e){e.preventDefault();setError('');const p=products.find(x=>x.id===Number(productId));if(!p)return setError('Selecione um produto.');const {data,error:er}=await supabase.from('product_items').select('quantity,cost_items(*)').eq('product_id',p.id);if(er)return setError(er.message);const unitCost=(data||[]).reduce((s,c)=>s+calculateItemCost(c.cost_items,c.quantity),0);const qty=Number(quantity);const price=Number(salePrice||p.sale_price||0);if(qty<=0||price<=0)return setError('Quantidade e preço de venda devem ser maiores que zero.');const totalCost=unitCost*qty,revenue=qty*price,profit=revenue-totalCost;setResult({totalCost,revenue,profit,margin:(profit/revenue)*100})}
 const choose=e=>{setProductId(e.target.value);const p=products.find(x=>x.id===Number(e.target.value));setSalePrice(p?.sale_price||'');setResult(null)}
 return <div><div className="page-heading"><div><h1>Simulação</h1><p>Teste uma produção antes de definir preço ou quantidade.</p></div></div><section className="form-panel"><form onSubmit={simulate}><div className="form-grid"><FormField label="Produto"><select value={productId} onChange={choose}><option value="">Selecione</option>{products.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></FormField><FormField label="Quantidade a produzir"><input type="number" min="1" value={quantity} onChange={e=>setQuantity(e.target.value)}/></FormField><FormField label="Preço de venda unitário"><input type="number" step="0.01" min="0" value={salePrice} onChange={e=>setSalePrice(e.target.value)} placeholder="10,00"/></FormField></div>{error&&<p className="error">{error}</p>}<button className="button button-primary" type="submit">Calcular simulação</button></form></section><SimulationResult result={result}/></div>
}
