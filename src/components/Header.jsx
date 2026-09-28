import { NavLink } from 'react-router-dom'

export default function Header() {
  const links = [
    ['/', 'Dashboard'], [' /insumos'.trim(), 'Insumos'], [' /produtos'.trim(), 'Produtos'], [' /simulacao'.trim(), 'Simulação']
  ]
  return <header className="header">
    <div className="brand"><div className="brand-icon"> <img src="/logo.png" alt="Monate Doces" /></div><div><strong>Monate Doces</strong><small>Do Pepel para a Tela</small></div></div>
    <nav>{links.map(([to, label]) => <NavLink key={to} to={to} className={({isActive}) => isActive ? 'active' : ''}>{label}</NavLink>)}</nav>
  </header>
}
