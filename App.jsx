import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import ChatWindow from './ChatWindow'
import Matches from './Matches'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 to-blue-500 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-white mx-auto mb-4 animate-pulse" fill="white" />
          <p className="text-white text-lg">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-orange-500" fill="currentColor" />
            <h1 className="text-2xl font-bold text-gray-900">Gabon-Love</h1>
          </div>
          {user && (
            <button
              onClick={() => supabase.auth.signOut()}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Déconnexion
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        {!user ? (
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Bienvenue sur Gabon-Love</h2>
            <p className="text-xl text-gray-600 mb-8">L'application de rencontre 100% gratuite pour Gabon et la Diaspora</p>
            <button
              onClick={() => {
                const email = prompt('Email:')
                const password = prompt('Mot de passe:')
                if (email && password) {
                  supabase.auth.signInWithPassword({ email, password })
                }
              }}
              className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-lg font-semibold"
            >
              Se Connecter
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-4 mb-8 justify-center">
              <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold">
                Accueil
              </button>
              <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold">
                Swipe
              </button>
              <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold">
                Mes Matchs
              </button>
              <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold">
                Profil
              </button>
            </div>
            <Matches userId={user.id} />
          </>
        )}
      </main>
    </div>
  )
}
