import { useState, useEffect } from 'react'
import { Heart, X } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function SwipeCards() {
  const [profiles, setProfiles] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('demo_profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      setProfiles(data || [])
      setLoading(false)
    } catch (error) {
      console.error('Erreur:', error)
      setLoading(false)
    }
  }

  const handleLike = () => {
    setLiked(true)
    setTimeout(() => {
      nextCard()
    }, 300)
  }

  const handlePass = () => {
    nextCard()
  }

  const nextCard = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setLiked(false)
    } else {
      setCurrentIndex(0)
      fetchProfiles()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-br from-orange-500 to-blue-500">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Heart className="w-12 h-12 text-white" fill="white" />
          </div>
          <p className="text-white text-lg">Chargement des profils...</p>
        </div>
      </div>
    )
  }

  if (profiles.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Aucun profil disponible</p>
        </div>
      </div>
    )
  }

  const currentProfile = profiles[currentIndex]

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="relative">
        <div
          className={`
            bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300
            ${liked ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}
          `}
        >
          <div className="w-full h-96 bg-gradient-to-br from-orange-300 to-blue-300 flex items-center justify-center relative">
            <div className="text-center">
              <div className="text-6xl mb-4">
                {currentProfile.gender === 'femme' ? '👩' : '👨'}
              </div>
              <p className="text-white text-xl font-bold">{currentProfile.display_name}</p>
              <p className="text-white">{currentProfile.age} ans</p>
            </div>
            {currentProfile.is_bot && (
              <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                BOT
              </div>
            )}
          </div>

          <div className="p-4 space-y-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {currentProfile.display_name}, {currentProfile.age}
              </h2>
              <p className="text-sm text-gray-600">{currentProfile.province}</p>
            </div>

            <p className="text-gray-700 text-sm">{currentProfile.bio}</p>

            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">LOISIRS</p>
              <div className="flex flex-wrap gap-2">
                {currentProfile.hobbies?.map((hobby, i) => (
                  <span
                    key={i}
                    className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-100 p-2 rounded">
                <p className="font-semibold text-gray-600">Profession</p>
                <p className="text-gray-900">{currentProfile.profession}</p>
              </div>
              <div className="bg-gray-100 p-2 rounded">
                <p className="font-semibold text-gray-600">Éducation</p>
                <p className="text-gray-900">{currentProfile.education_level}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-4 text-sm text-gray-600">
          {currentIndex + 1} / {profiles.length}
        </div>

        <div className="flex gap-4 justify-center mt-6">
          <button
            onClick={handlePass}
            className="bg-gray-300 hover:bg-gray-400 text-white rounded-full p-4 transition-all transform hover:scale-110"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={handleLike}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 transition-all transform hover:scale-110"
          >
            <Heart className="w-6 h-6" fill="white" />
          </button>
        </div>
      </div>
    </div>
  )
}
