import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { supabase } from '../lib/supabase'

import '../styles.css'

export default function Login() {
  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')

  const [error, setError] = useState('')

  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()

    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('E-mail ou senha incorretos.')
      setLoading(false)
      return
    }

    navigate('/')
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <img
          src="/logo.png"
          alt="Monate Doces"
          className="login-logo"
        />

        <h1>Acesso restrito</h1>

        <p>Entre para acessar o Monate Doces.</p>

        <form onSubmit={handleLogin}>
          <label>
            E-mail

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </label>

          <label>
            Senha

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
            />
          </label>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
