import { useState, useEffect } from 'react'
import { Heart, MessageCircle } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import ChatWindow from './ChatWindow'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function Matches({ userId }) {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMatch, setSelectedMatch] = useState(null)

  useEffect(() => {
    fetchMatches()
    
    const subscription = supabase
      .channel(`matches:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
          filter: `user1_id=eq.${userId},user2_id=eq.${userId}`
        },
        () => {
          fetchMatches()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [userId])

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*, user1:user1_id(display_name), user2:user2_id(display_name)')
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .order('created_at', { ascending: false })

      if (error) throw error
      setMatches(data || [])
      setLoading(false)
    } catch (error) {
      console.error('Erreur:', error)
      setLoading(false)
    }
  }

  const getOtherUser = (match) => {
    return match.user1_id === userId ? match.user2 : match.user1
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-br from-orange-500 to-blue-500">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Heart className="w-12 h-12 text-white" fill="white" />
          </div>
          <p className="text-white text-lg">Chargement des matchs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Mes Matchs</h1>

      {matches.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Heart className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Aucun match pour l'instant</h2>
          <p className="text-gray-600">Swipe pour trouver de nouvelles personnes !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((match) => {
            const otherUser = getOtherUser(match)
            return (
              <div
                key={match.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
                onClick={() => setSelectedMatch(match)}
              >
                <div className="bg-gradient-to-r from-orange-400 to-blue-400 h-32 flex items-center justify-center relative">
                  <div className="text-center">
                    <div className="text-5xl mb-2">💕</div>
                    <p className="text-white font-bold">{otherUser?.display_name || 'Utilisateur'}</p>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        Match depuis{' '}
                        {new Date(match.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <MessageCircle className="w-6 h-6 text-orange-500" />
                  </div>

                  <button
                    className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition-all font-semibold"
                    onClick={() => setSelectedMatch(match)}
                  >
                    Ouvrir le chat
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md">
            <ChatWindow
              matchId={selectedMatch.id}
              currentUserId={userId}
              otherUserName={getOtherUser(selectedMatch)?.display_name || 'Utilisateur'}
              onClose={() => setSelectedMatch(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
