import { Routes, Route } from 'react-router-dom'

import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Insumos from './pages/Insumos'
import Produtos from './pages/Produtos'
import ProdutoDetalhe from './pages/ProdutoDetalhe'
import Simulacao from './pages/Simulacao'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <>
                <Header />

                <main className="container">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/insumos" element={<Insumos />} />
                    <Route path="/produtos" element={<Produtos />} />
                    <Route
                      path="/produtos/:id"
                      element={<ProdutoDetalhe />}
                    />
                    <Route path="/simulacao" element={<Simulacao />} />
                  </Routes>
                </main>

                <footer>DoceCusto · MVP acadêmico</footer>
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}