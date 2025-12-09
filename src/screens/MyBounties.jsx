import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import {
  usePostsStore,
  useAuth,
  getBadgeColor,
  getStatusColor,
} from '../store'

export default function MyBounties() {
  const { posts } = usePostsStore()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('posted') // posted | claimed | watchlist

  const crumbs = [
    { label: 'Home', path: '/' },
    { label: 'My Bounties' },
  ]

  const { posted, claimed, watchlist } = useMemo(() => {
    if (!user) {
      return { posted: [], claimed: [], watchlist: [] }
    }
    const email = user.email
    const posted = posts.filter(
      (p) => p.ownerEmail && p.ownerEmail === email
    )
    const claimed = posts.filter(
      (p) => p.claimedByEmail && p.claimedByEmail === email
    )
    const watchlist = posts.filter((p) =>
      (p.watchers || []).includes(email)
    )
    return { posted, claimed, watchlist }
  }, [posts, user])

  const currentList =
    tab === 'posted'
      ? posted
      : tab === 'claimed'
      ? claimed
      : watchlist

  if (!user) {
    return (
      <Layout crumbs={crumbs}>
        <p className="text-sm text-gray-600 mb-3">
          You are not registered yet. Register to see posts you created,
          claimed, and saved.
        </p>
        <button
          onClick={() => navigate('/register')}
          className="px-3 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Register
        </button>
      </Layout>
    )
  }

  return (
    <Layout crumbs={crumbs}>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-wrap gap-3 text-xs">
          <button
            type="button"
            onClick={() => setTab('posted')}
            className={`px-3 py-2 rounded ${
              tab === 'posted'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Posted by me ({posted.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('claimed')}
            className={`px-3 py-2 rounded ${
              tab === 'claimed'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Claimed by me ({claimed.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('watchlist')}
            className={`px-3 py-2 rounded ${
              tab === 'watchlist'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Watchlist ({watchlist.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentList.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-sm p-4 flex flex-col cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/bounties/${post.id}`)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-2 items-center">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getBadgeColor(
                    post.type
                  )}`}
                >
                  {post.type.toUpperCase()}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                    post.status
                  )}`}
                >
                  {post.status.toUpperCase()}
                </span>
              </div>
              {post.type === 'sale' || post.type === 'free' ? (
                <span className="text-lg font-semibold text-gray-900">
                  {post.price ? `$${post.price}` : 'Free'}
                </span>
              ) : post.reward ? (
                <span className="text-lg font-semibold text-gray-900">
                  ${post.reward}
                </span>
              ) : null}
            </div>

            <h2 className="text-lg font-semibold mb-1">
              {post.title}
            </h2>
            <p className="text-sm text-gray-700 mb-2 line-clamp-3">
              {post.description}
            </p>

            <div className="mt-auto text-xs text-gray-500">
              {post.location}
            </div>
          </div>
        ))}
      </div>

      {currentList.length === 0 && (
        <div className="text-center py-10 text-gray-500 text-sm">
          {tab === 'posted' && (
            <p>You haven&apos;t posted anything yet.</p>
          )}
          {tab === 'claimed' && (
            <p>You haven&apos;t claimed any tasks yet.</p>
          )}
          {tab === 'watchlist' && (
            <p>Your watchlist is empty.</p>
          )}
        </div>
      )}
    </Layout>
  )
}
