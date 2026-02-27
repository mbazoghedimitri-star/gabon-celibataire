import { useState, useEffect } from 'react'
import { Heart, Compass, Users, User, LogOut } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import SwipeCards from './SwipeCards'
import Matches from './Matches'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('home')

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
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-yellow-500 to-blue-600 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-bounce mb-4">
            <Heart className="w-16 h-16 text-white mx-auto" fill="white" />
          </div>
          <p className="text-white text-lg font-semibold">Gabon-Love</p>
          <p className="text-white text-sm mt-2">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-green-600 via-yellow-500 to-blue-600 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full p-2">
              <Heart className="w-6 h-6 text-red-500" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Gabon-Love</h1>
              <p className="text-xs opacity-90">Rencontres 100% Gratuit</p>
            </div>
          </div>
          {user && (
            <button
              onClick={() => supabase.auth.signOut()}
              className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-full transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {!user ? (
          <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
            <div className="text-center max-w-2xl">
              <div className="mb-8">
                <div className="inline-block bg-gradient-to-r from-green-600 via-yellow-500 to-blue-600 p-4 rounded-full">
                  <Heart className="w-16 h-16 text-white" fill="white" />
                </div>
              </div>
              
              <h2 className="text-5xl font-bold mb-4 text-gray-900">Gabon-Love</h2>
              <p className="text-xl text-gray-600 mb-2">L'application de rencontre du Gabon 🇬🇦</p>
              <p className="text-gray-500 mb-8">Gratuit • Sécurisé • Pour tous</p>

              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h3 className="text-2xl font-bold mb-6 text-gray-900">Pourquoi Gabon-Love ?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-4xl mb-2">❤️</div>
                    <h4 className="font-bold text-gray-900 mb-2">100% Gratuit</h4>
                    <p className="text-sm text-gray-600">Pas de frais cachés, tout est gratuit</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-2">🔒</div>
                    <h4 className="font-bold text-gray-900 mb-2">Sécurisé</h4>
                    <p className="text-sm text-gray-600">Tes données sont protégées</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-2">🌍</div>
                    <h4 className="font-bold text-gray-900 mb-2">Pour Tous</h4>
                    <p className="text-sm text-gray-600">Gabon et diaspora</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  const email = prompt('Email:')
                  const password = prompt('Mot de passe:')
                  if (email && password) {
                    supabase.auth.signInWithPassword({ email, password })
                  }
                }}
                className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-full hover:shadow-lg transition-all text-lg font-bold"
              >
                Commencer →
              </button>

              <p className="text-sm text-gray-600 mt-6">
                Pas de compte ? Crée-en un maintenant !
              </p>
            </div>
          </div>
        ) : (
          <>
            <nav className="grid grid-cols-4 gap-2 p-4 bg-white border-b border-gray-200 sticky top-16 z-30">
              {[
                { id: 'home', label: 'Accueil', icon: Heart },
                { id: 'discover', label: 'Découvrir', icon: Compass },
                { id: 'matches', label: 'Matchs', icon: Users },
                { id: 'profile', label: 'Profil', icon: User }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setCurrentPage(id)}
                  className={`flex flex-col items-center gap-2 py-3 px-2 rounded-lg transition-all ${
                    currentPage === id
                      ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-semibold">{label}</span>
                </button>
              ))}
            </nav>

            <div className="p-4 md:p-8">
              {currentPage === 'home' && (
                <div className="max-w-4xl mx-auto">
                  <div className="bg-gradient-to-r from-green-600 via-yellow-500 to-blue-600 rounded-lg shadow-lg p-8 text-white mb-8">
                    <h2 className="text-3xl font-bold mb-2">Bienvenue ! 👋</h2>
                    <p className="text-lg opacity-90">Découvre de nouvelles personnes et trouve l'amour</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all">
                      <div className="text-4xl mb-4">💚</div>
                      <h3 className="font-bold text-lg mb-2">25 Likes/Jour</h3>
                      <p className="text-gray-600 text-sm">Limite quotidienne pour maintenir la qualité</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all">
                      <div className="text-4xl mb-4">💬</div>
                      <h3 className="font-bold text-lg mb-2">Messages Gratuits</h3>
                      <p className="text-gray-600 text-sm">Chat illimité avec tes matchs</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all">
                      <div className="text-4xl mb-4">🔒</div>
                      <h3 className="font-bold text-lg mb-2">100% Sécurisé</h3>
                      <p className="text-gray-600 text-sm">Tes données sont protégées</p>
                    </div>
                  </div>
                </div>
              )}

              {currentPage === 'discover' && (
                <div className="max-w-md mx-auto">
                  <SwipeCards />
                </div>
              )}

              {currentPage === 'matches' && (
                <Matches userId={user.id} />
              )}

              {currentPage === 'profile' && (
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
                  <h2 className="text-2xl font-bold mb-6">Mon Profil</h2>
                  <div className="space-y-4">
                    <div className="bg-gray-100 rounded p-4">
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-900">{user.email}</p>
                    </div>
                    <div className="bg-gray-100 rounded p-4">
                      <p className="text-sm text-gray-600">ID Utilisateur</p>
                      <p className="font-semibold text-gray-900 text-sm break-all">{user.id}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="bg-gray-900 text-white text-center py-6 mt-12">
        <p className="text-sm">Gabon-Love © 2026 • Créé avec ❤️ pour le Gabon</p>
        <p className="text-xs text-gray-500 mt-2">100% Gratuit • Sécurisé • Pour Tous</p>
      </footer>
    </div>
  )
}
