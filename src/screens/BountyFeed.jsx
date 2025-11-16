// src/screens/BountyFeed.jsx
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { usePostsStore, getBadgeColor, getStatusColor } from '../store'

export default function BountyFeed() {
  const { posts } = usePostsStore()
  const navigate = useNavigate()

  // all / bounty / resale / activity
  const [filter, setFilter] = useState('all')
  const [status, setStatus] = useState('all')
  const [min, setMin] = useState('')
  const [max, setMax] = useState('')
  const [tags, setTags] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // 顶部一排 nav tab
  const crumbs = [
    {
      label: 'Home',
      onClick: () => setFilter('all'),
      active: filter === 'all',
    },
    {
      label: 'Bounties',
      onClick: () => setFilter('bounty'),
      active: filter === 'bounty',
    },
    {
      label: 'Pre-owned',
      onClick: () => setFilter('resale'),
      active: filter === 'resale',
    },
    {
      label: 'Activity (Looking for partners)',
      onClick: () => setFilter('activity'),
      active: filter === 'activity',
    },
  ]

  const filteredPosts = useMemo(() => {
    const wantedTags = tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)

    return posts
      .filter((p) => !p.deleted)
      .filter((post) => {
        let matchesChannel = true
        if (filter === 'bounty') {
          matchesChannel = post.type === 'bounty'
        } else if (filter === 'resale') {
          matchesChannel = post.type === 'sale' || post.type === 'free'
        } else if (filter === 'activity') {
          matchesChannel = post.type === 'activity'
        }

        const matchesStatus = status === 'all' || post.status === status

        const price = post.price ?? 0
        const matchesMin = min === '' || price >= Number(min)
        const matchesMax = max === '' || price <= Number(max)

        const matchesTags =
          wantedTags.length === 0 ||
          wantedTags.every((t) =>
            (post.tags || []).map((x) => x.toLowerCase()).includes(t)
          )

        const q = searchQuery.toLowerCase()
        const matchesSearch =
          q === '' ||
          post.title.toLowerCase().includes(q) ||
          post.description.toLowerCase().includes(q) ||
          (post.location || '').toLowerCase().includes(q)

        return (
          matchesChannel &&
          matchesStatus &&
          matchesMin &&
          matchesMax &&
          matchesTags &&
          matchesSearch
        )
      })
  }, [posts, filter, status, min, max, tags, searchQuery])

  return (
    <Layout crumbs={crumbs}>
      {/* Filter 条（现在只保留搜索 / 状态 / 价格 / tags） */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            className="px-3 py-2 border rounded text-sm"
            placeholder="Search title, description, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            className="px-3 py-2 border rounded text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {['all', 'open', 'claimed', 'completed', 'closed'].map((s) => (
              <option key={s} value={s}>
                {s[0].toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <input
              className="w-1/2 px-3 py-2 border rounded text-sm"
              placeholder="Min $"
              value={min}
              onChange={(e) => setMin(e.target.value)}
            />
            <input
              className="w-1/2 px-3 py-2 border rounded text-sm"
              placeholder="Max $"
              value={max}
              onChange={(e) => setMax(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4">
          <input
            className="w-full px-3 py-2 border rounded text-sm"
            placeholder="Tags (comma separated, e.g. furniture, free)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
      </div>

      {/* 卡片列表 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredPosts.map((post) => (
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
              {post.price !== undefined && (
                <span className="text-lg font-semibold text-gray-900">
                  ${post.price}
                </span>
              )}
            </div>

            <h2 className="text-lg font-semibold mb-1">{post.title}</h2>
            <p className="text-sm text-gray-700 mb-2">{post.description}</p>

            <div className="flex flex-wrap gap-1 mb-2">
              {(post.tags || []).map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs"
                >
                  #{t}
                </span>
              ))}
            </div>

            <div className="mt-auto text-xs text-gray-500">
              {post.location}
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No posts found. Try adjusting your filters.
        </div>
      )}
    </Layout>
  )
}
