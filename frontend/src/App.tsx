import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { skillsAPI, quizzesAPI } from './api/client'

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Master Your Skills</h1>
          <p className="text-xl text-gray-600 mb-2">Choose from {skills?.length || 0} carefully curated skills</p>
          <p className="text-gray-500">Build your foundation step by step</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills?.map((skill: Skill) => (
            <div key={skill.id} className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">{skill.name}</h3>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-lg ${i < (skill.difficulty || 1) ? 'text-yellow-400' : 'text-gray-300'}`}>
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">{skill.description}</p>
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                  {skill.category?.toUpperCase()}
                </span>
                <span className="text-sm text-gray-500">
                  Level {skill.difficulty}/5
                </span>
              </div>
              
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transform hover:scale-105 transition-all duration-200">
                  📚 Start Learning
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-all duration-200">
                  📊 View Progress
                </button>
              </div>
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Practice Quizzes</h1>
          <p className="text-xl text-gray-600 mb-2">Test your knowledge with {quizzes?.length || 0} interactive quizzes</p>
          <p className="text-gray-500">Adaptive learning powered by AI</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {quizzes?.map((quiz: Quiz) => (
            <div key={quiz.id} className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{quiz.description}</p>
                </div>
                <div className="ml-4 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl">🧩</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{quiz.questions?.length || 0}</div>
                  <div className="text-sm text-gray-500">Questions</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">~15</div>
                  <div className="text-sm text-gray-500">Minutes</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-sm bg-gradient-to-r from-green-100 to-blue-100 text-green-800 px-3 py-1 rounded-full font-medium">
                    🎯 Adaptive
                  </span>
                  <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
                    ⭐ Featured
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Difficulty: Mixed
                </div>
              </div>
              
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg">
                  🚀 Start Quiz
                </button>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-all duration-200">
                    📊 View Stats
                  </button>
                  <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-all duration-200">
                    👁️ Preview
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {(!quizzes || quizzes.length === 0) && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🧩</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No quizzes available yet</h3>
            <p className="text-gray-600">Check back soon for new practice quizzes!</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Home Page Component
function HomePage() {
  const { data: skills, isLoading: skillsLoading } = useQuery<Skill[]>({
    queryKey: ['skills'],
    queryFn: () => skillsAPI.getSkills().then(res => res.data)
  })
  
  const { data: quizzes, isLoading: quizzesLoading } = useQuery<Quiz[]>({
    queryKey: ['quizzes'],
    queryFn: () => quizzesAPI.getQuizzes().then(res => res.data)
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 py-20 mt-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-12">
            <h1 className="text-6xl font-extrabold text-gray-900 mb-8 leading-tight z-10 relative block">
              Your Path to DSA Mastery
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Navigate through Data Structures & Algorithms with AI-powered personalized learning. 
              Build your coding foundation step by step, at your own pace.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/skills" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 text-lg">
                🚀 Start Learning
              </Link>
              <Link to="/quizzes" className="bg-white hover:bg-gray-50 text-gray-900 font-semibold px-10 py-4 rounded-xl shadow-lg border-2 border-gray-200 transform hover:scale-105 transition-all duration-200 text-lg">
                📝 Take Quiz
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-all duration-200">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {skillsLoading ? "..." : skills?.length || 0}
            </h3>
            <p className="text-gray-600 font-medium">Skills Available</p>
            <p className="text-sm text-gray-500 mt-2">From beginner to advanced</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-all duration-200">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🧩</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {quizzesLoading ? "..." : quizzes?.length || 0}
            </h3>
            <p className="text-gray-600 font-medium">Practice Quizzes</p>
            <p className="text-sm text-gray-500 mt-2">Test your knowledge</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-all duration-200">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">AI-Powered</h3>
            <p className="text-gray-600 font-medium">Adaptive Learning</p>
            <p className="text-sm text-gray-500 mt-2">Personalized for you</p>
          </div>
        </div>
      </div>

      {/* Featured Skills Preview */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Skills</h2>
          <p className="text-gray-600">Start with these fundamental concepts</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills?.slice(0, 4).map((skill) => (
            <div key={skill.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{skill.name}</h3>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-sm ${i < (skill.difficulty || 1) ? 'text-yellow-400' : 'text-gray-300'}`}>
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{skill.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {skill.category?.toUpperCase()}
                </span>
                <Link to="/skills" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Learn →
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link to="/skills" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200">
            View All {skills?.length || 0} Skills
          </Link>
        </div>
      </div>
    </div>
  )
}

// Authentication Modals
function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transform hover:scale-105 transition-all duration-200"
          >
            🛤️ Continue Journey
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">Don't have an account? 
            <button className="text-blue-600 hover:text-blue-700 font-medium ml-1">Sign up</button>
          </p>
        </div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>
      </div>
    </div>
  );
}

function SignupModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Your Journey!</h2>
          <p className="text-gray-600">Create your personalized learning path</p>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transform hover:scale-105 transition-all duration-200"
          >
            🚀 Begin Learning
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">Already have an account? 
            <button className="text-blue-600 hover:text-blue-700 font-medium ml-1">Login</button>
          </p>
        </div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>
      </div>
    </div>
  );
}

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <Router>
      <div className="min-h-screen w-full bg-gray-50">
        <nav className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-gray-100 w-full">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                  <span className="text-3xl">🛤️</span>
                  <span>CodePath</span>
                </Link>
              </div>
              <div className="flex items-center space-x-1">
                <Link to="/skills" className="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200">
                  📚 Skills
                </Link>
                <Link to="/quizzes" className="px-4 py-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium transition-all duration-200">
                  🧩 Quizzes
                </Link>
                <Link to="/progress" className="px-4 py-2 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-medium transition-all duration-200">
                  📊 Progress
                </Link>
                <div className="ml-4 pl-4 border-l border-gray-200 flex items-center space-x-2">
                  <button 
                    onClick={() => setShowLogin(true)}
                    className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => setShowSignup(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transform hover:scale-105 transition-all duration-200"
                  >
                    🛤️ Start Journey
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="w-full pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/quizzes" element={<QuizzesPage />} />
            <Route path="/progress" element={
              <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
                <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                  <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-12">Your Learning Progress</h1>
                    <p className="text-xl text-gray-600 mb-2">Track your mastery across all skills</p>
                    <p className="text-gray-500">Powered by AI-driven adaptive learning</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🎯</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">0%</h3>
                      <p className="text-gray-600 font-medium">Overall Mastery</p>
                      <p className="text-sm text-gray-500 mt-2">Complete quizzes to track progress</p>
                    </div>
                    
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚡</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">0</h3>
                      <p className="text-gray-600 font-medium">Skills Mastered</p>
                      <p className="text-sm text-gray-500 mt-2">Out of 16 available</p>
                    </div>
                    
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🏆</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">0</h3>
                      <p className="text-gray-600 font-medium">Quizzes Completed</p>
                      <p className="text-sm text-gray-500 mt-2">Start practicing to see progress</p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl">📊</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Learning?</h3>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                      Take your first quiz to begin tracking your progress. Our AI-powered system will adapt to your learning style and help you master each skill efficiently.
                    </p>
                    <div className="flex justify-center space-x-4">
                      <Link to="/skills" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200">
                        📚 Browse Skills
                      </Link>
                      <Link to="/quizzes" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200">
                        🧩 Take Quiz
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </main>
        
        {/* Authentication Modals */}
        <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
        <SignupModal isOpen={showSignup} onClose={() => setShowSignup(false)} />
      </div>
    </Router>
  )
}

export default App
