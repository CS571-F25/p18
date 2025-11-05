import { useState } from 'react'
import './App.css'

interface Post {
  id: number
  title: string
  type: 'sale' | 'free' | 'bounty'
  price?: number
  description: string
  status: 'open' | 'claimed' | 'completed' | 'closed'
  tags: string[]
  location: string
}

const mockPosts: Post[] = [
  {
    id: 1,
    title: 'Office Chair - Like New',
    type: 'sale',
    price: 25,
    description: 'Comfortable office chair, barely used. Great condition!',
    status: 'open',
    tags: ['furniture', 'office'],
    location: 'Lakeshore Dorms'
  },
  {
    id: 2,
    title: 'Free Bookshelf',
    type: 'free',
    description: 'Small bookshelf, free to good home. Pick up only.',
    status: 'open',
    tags: ['furniture', 'free'],
    location: 'Southeast Dorms'
  },
  {
    id: 3,
    title: 'Need Help Moving Boxes',
    type: 'bounty',
    price: 30,
    description: 'Looking for someone to help move boxes from apartment to storage unit. Should take about 2 hours.',
    status: 'open',
    tags: ['moving', 'help'],
    location: 'Downtown'
  },
  {
    id: 4,
    title: 'IKEA Desk Assembly',
    type: 'bounty',
    price: 20,
    description: 'Need someone to assemble a desk. Tools provided, just need the help!',
    status: 'claimed',
    tags: ['assembly', 'furniture'],
    location: 'Near Campus'
  }
]

function App() {
  const [filter, setFilter] = useState<'all' | 'sale' | 'free' | 'bounty'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = mockPosts.filter(post => {
    const matchesFilter = filter === 'all' || post.type === filter
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'sale': return 'bg-blue-100 text-blue-800'
      case 'free': return 'bg-green-100 text-green-800'
      case 'bounty': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800'
      case 'claimed': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">MadForum</h1>
          <p className="text-gray-600 mt-1">Campus Forum for Rehoming & Bounty Tasks</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('sale')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'sale'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                For Sale
              </button>
              <button
                onClick={() => setFilter('free')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'free'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Free
              </button>
              <button
                onClick={() => setFilter('bounty')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'bounty'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Bounty
              </button>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-semibold text-gray-900 flex-1">
                  {post.title}
                </h2>
              </div>

              <div className="flex gap-2 mb-3 flex-wrap">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getBadgeColor(post.type)}`}>
                  {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(post.status)}`}>
                  {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                </span>
              </div>

              {post.price !== undefined && (
                <div className="mb-3">
                  <span className="text-2xl font-bold text-gray-900">
                    ${post.price}
                  </span>
                </div>
              )}

              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center text-sm text-gray-500">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {post.location}
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No posts found matching your criteria.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            MadForum - Proof of Concept | CS571 Web Project
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App

