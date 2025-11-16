// src/screens/MyBounties.jsx
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { usePostsStore, getStatusColor } from '../store'

export default function MyBounties() {
  const { posts } = usePostsStore()
  const navigate = useNavigate()

  // prototype：先简单展示所有 bounty 帖子
  const grouped = useMemo(() => {
    const result = {
      open: [],
      claimed: [],
      completed: [],
      closed: [],
    }
    posts
      .filter((p) => p.type === 'bounty' && !p.deleted)
      .forEach((p) => {
        if (!result[p.status]) result[p.status] = []
        result[p.status].push(p)
      })
    return result
  }, [posts])

  const order = ['open', 'claimed', 'completed', 'closed']

  return (
    <Layout
      crumbs={[
        { label: 'Home', path: '/' },
        { label: '悬赏', path: '/' },
        { label: 'My Bounties' },
      ]}
    >
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">My Bounties</h1>
        <p className="text-sm text-gray-600 mb-4">
          Prototype view of all bounty posts, grouped by status.
        </p>

        {order.map((statusKey) => {
          const list = grouped[statusKey] || []
          if (list.length === 0) return null
          return (
            <div key={statusKey} className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                    statusKey
                  )}`}
                >
                  {statusKey.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500">
                  {list.length} bounties
                </span>
              </div>

              <div className="bg-white rounded-lg shadow-sm divide-y">
                {list.map((post) => (
                  <div
                    key={post.id}
                    className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/bounties/${post.id}`)}
                  >
                    <div>
                      <div className="text-sm font-medium">{post.title}</div>
                      <div className="text-xs text-gray-500">
                        {post.location}
                      </div>
                    </div>
                    {post.price !== undefined && (
                      <div className="text-sm font-semibold">
                        ${post.price}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {order.every((k) => (grouped[k] || []).length === 0) && (
          <p className="text-sm text-gray-500">
            No bounty posts yet. Try creating one from the “New Post” button.
          </p>
        )}
      </div>
    </Layout>
  )
}
