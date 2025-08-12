import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { skillsAPI, quizzesAPI, authAPI, userAPI } from './api/client'

// Types
interface Skill {
  id: number
  name: string
  description?: string
  category?: string
  difficulty?: number
  created_at: string
  updated_at: string
}

interface Quiz {
  id: number
  title: string
  description?: string
  skill_id: number
  questions?: Array<{
    id: number
    question_type: string
    prompt: string
    order: number
  }>
}

interface User {
  id: number
  email: string
  display_name?: string
  is_active: boolean
}

// Skills Page Component
function SkillsPage() {
  const { data: skills, isLoading, error } = useQuery<Skill[]>({
    queryKey: ['skills'],
    queryFn: () => skillsAPI.getSkills().then(res => res.data)
  })

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading skills...</p>
      </div>
    </div>
  )
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center text-red-600">
        <p className="text-xl mb-2">⚠️ Error loading skills</p>
        <p className="text-sm">Please check your connection and try again</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-28 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎯 Master DSA Skills
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Build your foundation with {skills?.length || 0} carefully curated skills
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills?.map((skill) => (
            <div key={skill.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 flex-1">
                  {skill.name}
                </h3>
                {skill.difficulty && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    skill.difficulty <= 3 ? 'bg-green-100 text-green-800' :
                    skill.difficulty <= 6 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    Level {skill.difficulty}
                  </span>
                )}
              </div>
              
              {skill.description && (
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {skill.description}
                </p>
              )}
              
              {skill.category && (
                <div className="mb-4">
                  <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                    {skill.category}
                  </span>
                </div>
              )}
              
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transform hover:scale-105 transition-all duration-200">
                🚀 Start Learning
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Quizzes Page Component
function QuizzesPage() {
  const { data: quizzes, isLoading, error } = useQuery<Quiz[]>({
    queryKey: ['quizzes'],
    queryFn: () => quizzesAPI.getQuizzes().then(res => res.data)
  })

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading quizzes...</p>
      </div>
    </div>
  )
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="text-center text-red-600">
        <p className="text-xl mb-2">⚠️ Error loading quizzes</p>
        <p className="text-sm">Please check your connection and try again</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-28 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📝 Practice Quizzes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Test your knowledge with {quizzes?.length || 0} interactive quizzes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quizzes?.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {quiz.title}
              </h3>
              
              {quiz.description && (
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {quiz.description}
                </p>
              )}
              
              {quiz.questions && (
                <div className="mb-4">
                  <span className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    {quiz.questions.length} Questions
                  </span>
                </div>
              )}
              
              <button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transform hover:scale-105 transition-all duration-200">
                📝 Take Quiz
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Progress Page Component
function ProgressPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pt-28 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📊 Your Progress
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your learning journey and achievements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Skills Mastered</h3>
            <p className="text-3xl font-bold text-purple-600">0</p>
            <p className="text-gray-600 mt-2">Out of 16 total skills</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Quizzes Completed</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
            <p className="text-gray-600 mt-2">Keep practicing!</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
            <div className="text-4xl mb-4">🔥</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Learning Streak</h3>
            <p className="text-3xl font-bold text-orange-600">0</p>
            <p className="text-gray-600 mt-2">Days in a row</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🎯 Recommended Next Steps</h2>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl mr-4">📚</div>
              <div>
                <h3 className="font-semibold text-gray-900">Start with Arrays</h3>
                <p className="text-gray-600 text-sm">Master the fundamentals of array manipulation</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl mr-4">🔗</div>
              <div>
                <h3 className="font-semibold text-gray-900">Learn Linked Lists</h3>
                <p className="text-gray-600 text-sm">Understand dynamic data structures</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl mr-4">📝</div>
              <div>
                <h3 className="font-semibold text-gray-900">Take Practice Quiz</h3>
                <p className="text-gray-600 text-sm">Test your knowledge with interactive questions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Home Page Component
function HomePage() {
  const { data: skills } = useQuery<Skill[]>({
    queryKey: ['skills'],
    queryFn: () => skillsAPI.getSkills().then(res => res.data)
  })
  
  const { data: quizzes } = useQuery<Quiz[]>({
    queryKey: ['quizzes'],
    queryFn: () => quizzesAPI.getQuizzes().then(res => res.data)
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your Path to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">DSA Mastery</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Navigate through Data Structures & Algorithms with AI-powered personalized learning.
            Build your coding foundation step by step, at your own pace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/skills"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center"
            >
              🚀 Start Learning
            </Link>
            <Link 
              to="/quizzes"
              className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-4 rounded-lg shadow-lg border border-gray-200 transform hover:scale-105 transition-all duration-200 flex items-center"
            >
              📝 Take Quiz
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100 transform hover:scale-105 transition-all duration-300">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-3xl font-bold text-blue-600 mb-2">{skills?.length || 0}</h3>
            <p className="text-gray-700 font-medium">Skills Available</p>
            <p className="text-gray-500 text-sm mt-2">From beginner to advanced</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100 transform hover:scale-105 transition-all duration-300">
            <div className="text-5xl mb-4">🧠</div>
            <h3 className="text-3xl font-bold text-green-600 mb-2">{quizzes?.length || 0}</h3>
            <p className="text-gray-700 font-medium">Practice Quizzes</p>
            <p className="text-gray-500 text-sm mt-2">Test your knowledge</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100 transform hover:scale-105 transition-all duration-300">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-3xl font-bold text-purple-600 mb-2">AI-Powered</h3>
            <p className="text-gray-700 font-medium">Adaptive Learning</p>
            <p className="text-gray-500 text-sm mt-2">Personalized for you</p>
          </div>
        </div>

        {/* Featured Skills Preview */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            🌟 Featured Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills?.slice(0, 4).map((skill) => (
              <div key={skill.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {skill.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {skill.description}
                </p>
                <Link 
                  to="/skills"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                >
                  Learn more →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Main App Component
function App() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const queryClient = useQueryClient()

  // Check if user is authenticated on app load
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      setIsAuthenticated(true)
      // Fetch user profile
      userAPI.getProfile().then(response => {
        setUser(response.data)
      }).catch(() => {
        localStorage.removeItem('access_token')
        setIsAuthenticated(false)
      })
    }
  }, [])

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => 
      authAPI.login(email, password),
    onSuccess: (response) => {
      console.log('Login successful:', response.data)
      const { access_token } = response.data
      if (access_token) {
        localStorage.setItem('access_token', access_token)
        setIsAuthenticated(true)
        setShowLoginModal(false)
        // Fetch user profile
        userAPI.getProfile().then(profileResponse => {
          setUser(profileResponse.data)
        }).catch(err => {
          console.error('Profile fetch error:', err)
        })
        // Refetch data
        queryClient.invalidateQueries()
      } else {
        console.error('No access token in response:', response.data)
        alert('Login completed but no access token received. Please try again.')
      }
    },
    onError: (error: any) => {
      console.error('Login error details:', error)
      console.error('Error response:', error.response)
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          error.message || 
                          'Login failed - please check your credentials'
      alert(`Login failed: ${errorMessage}`)
    }
  })

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: ({ email, password, display_name }: { email: string; password: string; display_name: string }) => 
      authAPI.signup(email, password, display_name),
    onSuccess: (response) => {
      console.log('Signup successful:', response.data)
      const { access_token } = response.data
      if (access_token) {
        localStorage.setItem('access_token', access_token)
        setIsAuthenticated(true)
        setShowSignupModal(false)
        // Fetch user profile
        userAPI.getProfile().then(profileResponse => {
          setUser(profileResponse.data)
        }).catch(err => {
          console.error('Profile fetch error:', err)
        })
        // Refetch data
        queryClient.invalidateQueries()
      } else {
        console.error('No access token in response:', response.data)
        alert('Signup completed but no access token received. Please try logging in.')
      }
    },
    onError: (error: any) => {
      console.error('Signup error details:', error)
      console.error('Error response:', error.response)
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          error.message || 
                          'Signup failed - please try again'
      alert(`Signup failed: ${errorMessage}`)
    }
  })

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('access_token')
    setIsAuthenticated(false)
    setUser(null)
    queryClient.clear()
  }

  return (
    <Router>
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <span className="text-2xl">📘</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    CodePath
                  </span>
                </Link>
              </div>
              
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200">
                  🏠 Home
                </Link>
                <Link to="/skills" className="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200">
                  🎯 Skills
                </Link>
                <Link to="/quizzes" className="px-4 py-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium transition-all duration-200">
                  🧠 Quizzes
                </Link>
                <Link to="/progress" className="px-4 py-2 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-medium transition-all duration-200">
                  📊 Progress
                </Link>
                <div className="ml-4 pl-4 border-l border-gray-200 flex items-center space-x-4">
                  {isAuthenticated ? (
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-700">Welcome, {user?.display_name || user?.email}!</span>
                      <button 
                        onClick={handleLogout}
                        className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <>
                      <button 
                        onClick={() => setShowLoginModal(true)}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                      >
                        Login
                      </button>
                      <button 
                        onClick={() => setShowSignupModal(true)}
                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        Start Journey
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/quizzes" element={<QuizzesPage />} />
          <Route path="/progress" element={<ProgressPage />} />
        </Routes>

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                <button 
                  onClick={() => setShowLoginModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.target as HTMLFormElement)
                  const email = formData.get('email') as string
                  const password = formData.get('password') as string
                  loginMutation.mutate({ email, password })
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button 
                    onClick={() => {
                      setShowLoginModal(false)
                      setShowSignupModal(true)
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Signup Modal */}
        {showSignupModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Join CodePath</h2>
                <button 
                  onClick={() => setShowSignupModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.target as HTMLFormElement)
                  const display_name = formData.get('display_name') as string
                  const email = formData.get('email') as string
                  const password = formData.get('password') as string
                  signupMutation.mutate({ email, password, display_name })
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    name="display_name"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Create a password (min 6 characters)"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={signupMutation.isPending}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {signupMutation.isPending ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button 
                    onClick={() => {
                      setShowSignupModal(false)
                      setShowLoginModal(true)
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Router>
  )
}

export default App
