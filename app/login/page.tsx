import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <form className="bg-bg-card p-6 rounded-2xl border border-border-main w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-2xl font-extrabold text-accent mb-2">Ingresar a GYM</h1>
        
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm text-text-muted font-bold">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="bg-bg-elevated border border-border-main rounded-lg p-3 text-text-main text-base focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm text-text-muted font-bold">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="bg-bg-elevated border border-border-main rounded-lg p-3 text-text-main text-base focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex gap-2 mt-4">
          <button formAction={login} className="flex-1 bg-text-main text-bg-dark font-bold p-3 rounded-xl">
            Iniciar Sesión
          </button>
          <button formAction={signup} className="flex-1 bg-transparent border border-text-main text-text-main font-bold p-3 rounded-xl">
            Registrarse
          </button>
        </div>
      </form>
    </div>
  )
}
