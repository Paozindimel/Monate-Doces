import { money } from '../lib/format'
export default function SimulationResult({ result }) {
  if (!result) return <div className="empty-state">Informe os dados para calcular a simulação.</div>
  return <div className="simulation-result">
    <div><span>Custo total</span><strong>{money(result.totalCost)}</strong></div>
    <div><span>Faturamento</span><strong>{money(result.revenue)}</strong></div>
    <div><span>Lucro estimado</span><strong>{money(result.profit)}</strong></div>
    <div><span>Margem</span><strong>{result.margin.toFixed(1)}%</strong></div>
  </div>
}
