import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CardResumo from '../components/CardResumo'
import Button from '../components/Button'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState({ items: 0, products: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ count: items }, { count: products }] = await Promise.all([
        supabase.from('cost_items').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true })
      ])
      setStats({ items: items || 0, products: products || 0 }); setLoading(false)
    }
    load()
  }, [])

  return <div>
    <div className="page-heading"><div><h1>Visão Geral</h1><p>Visão geral dos seus custos e produtos.</p></div></div>
    {loading ? <p>Carregando...</p> : <div className="summary-grid">
      <CardResumo title="Itens de custo" value={stats.items} description="Insumos, embalagens e indiretos" />
      <CardResumo title="Produtos" value={stats.products} description="Receitas cadastradas" />
      <CardResumo title="Categorias" value="3" description="Insumo, embalagem e indireto" />
    </div>}
    <div className="quick-grid">
      <div className="quick-card"><h2>Comece pelos custos</h2><p>Cadastre os ingredientes, embalagens e gastos indiretos que você usa na produção.</p><Link to="/insumos"><Button>Cadastrar insumo</Button></Link></div>
      <div className="quick-card"><h2>Monte um produto</h2><p>Adicione componentes e quantidades para calcular automaticamente o custo.</p><Link to="/produtos"><Button>Cadastrar produto</Button></Link></div>
      <div className="quick-card"><h2>Faça uma simulação</h2><p>Teste quantidade, preço de venda, faturamento, lucro e margem.</p><Link to="/simulacao"><Button>Simular produção</Button></Link></div>
    </div>
  </div>
}
