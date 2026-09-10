'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Dumbbell, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        if (error.message.toLowerCase().includes('email not confirmed') || error.message.toLowerCase().includes('not confirmed')) {
          setError('Necesitás confirmar tu email antes de ingresar. Revisá tu bandeja de entrada (o spam). También podés desactivar la confirmación de email en Supabase.')
        } else if (error.message.toLowerCase().includes('invalid login')) {
          setError('Email o contraseña incorrectos.')
        } else {
          setError(error.message)
        }
        setLoading(false)
        return
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/` }
      })
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      // If email confirmation is disabled, redirect directly
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-bg-dark">
      <div className="bg-bg-card border border-border-main rounded-2xl p-6 w-full max-w-sm flex flex-col gap-5">
        
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 mb-2">
          <div className="bg-accent/15 w-14 h-14 rounded-2xl flex items-center justify-center">
            <Dumbbell className="w-7 h-7 text-accent" />
          </div>
          <h1 className="text-2xl font-extrabold text-text-main">Elite Training</h1>
          <p className="text-sm text-text-muted">
            {mode === 'login' ? 'Ingresá a tu cuenta' : 'Creá tu cuenta'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs text-text-muted font-bold uppercase">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="bg-bg-elevated border border-border-main rounded-xl p-3 text-text-main text-base focus:outline-none focus:border-accent placeholder:text-[#48484A]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs text-text-muted font-bold uppercase">Contraseña</label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="bg-bg-elevated border border-border-main rounded-xl p-3 text-text-main text-base focus:outline-none focus:border-accent placeholder:text-[#48484A]"
            />
          </div>

          {error && (
            <div className="bg-red/15 border border-red rounded-xl p-3 text-sm text-red font-semibold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-accent text-black font-extrabold p-4 rounded-xl text-base flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'
            )}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null) }}
            className="text-sm text-text-muted"
          >
            {mode === 'login' ? (
              <>¿No tenés cuenta? <span className="text-accent font-bold">Registrate</span></>
            ) : (
              <>¿Ya tenés cuenta? <span className="text-accent font-bold">Iniciá sesión</span></>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}
