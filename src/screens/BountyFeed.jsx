import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import {
  usePostsStore,
  useAuth,
  useToast,
  getBadgeColor,
  getStatusColor,
} from '../store'

function distanceInMeters(a, b) {
  const R = 6371000
  const toRad = (deg) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const sinDLat = Math.sin(dLat / 2)
  const sinDLng = Math.sin(dLng / 2)
  const h =
    sinDLat * sinDLat +
    Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
  return R * c
}

function relevanceScore(post, query) {
  if (!query) return 0
  const q = query.toLowerCase()
  let score = 0
  if ((post.title || '').toLowerCase().includes(q)) score += 3
  if ((post.description || '').toLowerCase().includes(q)) score += 2
  if ((post.location || '').toLowerCase().includes(q)) score += 1
  if (
    (post.tags || []).some((t) =>
      t.toLowerCase().includes(q)
    )
  ) {
    score += 4
  }
  return score
}

function typeLabel(type) {
  if (type === 'bounty') return 'Bounty'
  if (type === 'sale') return 'Sale'
  if (type === 'free') return 'Free'
  if (type === 'activity') return 'Activity'
  return 'Post'
}

export default function BountyFeed() {
  const navigate = useNavigate()
  const { posts, toggleWatchlist } = usePostsStore()
  const { user } = useAuth()
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [typeFilter, setTypeFilter] = useState('all') // all | bounty | secondhand | activity
  const [sortMode, setSortMode] = useState('newest') // newest | distance | relevance
  const [userLocation, setUserLocation] = useState(null)

  const crumbs = [
    { label: 'Home', path: '/' },
    {
      label: 'Bounties',
      onClick: () => setTypeFilter('bounty'),
      active: typeFilter === 'bounty',
    },
    {
      label: 'Secondhand',
      onClick: () => setTypeFilter('secondhand'),
      active: typeFilter === 'secondhand',
    },
    {
      label: 'Activities',
      onClick: () => setTypeFilter('activity'),
      active: typeFilter === 'activity',
    },
    { label: 'Map', path: '/map' },
  ]

  // 浏览器定位
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
      },
      (err) => {
        console.warn('Geolocation error', err)
      },
      { enableHighAccuracy: true }
    )
  }, [])

  const tagFilterList = useMemo(
    () =>
      tagsInput
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    [tagsInput]
  )

  const filteredPosts = useMemo(() => {
    let result = posts.slice()
    const q = search.trim().toLowerCase()

    // 类型
    result = result.filter((p) => {
      if (typeFilter === 'bounty') return p.type === 'bounty'
      if (typeFilter === 'secondhand')
        return p.type === 'sale' || p.type === 'free'
      if (typeFilter === 'activity') return p.type === 'activity'
      return true
    })

    // 搜索文本
    if (q) {
      result = result.filter((p) => {
        const haystack = [
          p.title,
          p.description,
          p.location,
          ...(p.tags || []),
        ]
          .join(' ')
          .toLowerCase()
        return haystack.includes(q)
      })
    }

    // 标签
    if (tagFilterList.length > 0) {
      result = result.filter((p) => {
        const ptags = (p.tags || []).map((t) => t.toLowerCase())
        return tagFilterList.every((tag) => ptags.includes(tag))
      })
    }

    // 排序
    if (sortMode === 'distance' && userLocation) {
      result.sort((a, b) => {
        const hasA = typeof a.lat === 'number' && typeof a.lng === 'number'
        const hasB = typeof b.lat === 'number' && typeof b.lng === 'number'
        const da = hasA ? distanceInMeters(userLocation, a) : Infinity
        const db = hasB ? distanceInMeters(userLocation, b) : Infinity
        return da - db
      })
    } else if (sortMode === 'relevance' && q) {
      result.sort(
        (a, b) =>
          relevanceScore(b, q) - relevanceScore(a, q)
      )
    } else {
      result.sort(
        (a, b) =>
          (b.createdAt || 0) - (a.createdAt || 0)
      )
    }

    return result
  }, [posts, typeFilter, search, tagFilterList, sortMode, userLocation])

  const onToggleWatch = (post) => {
    if (!user) {
      showToast('Please register to use watchlist.', 'error')
      return
    }
    toggleWatchlist(post.id, user)
    showToast('Updated watchlist.', 'success')
  }

  return (
    <Layout crumbs={crumbs}>
      {/* Filter + Sort */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search title, description, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <select
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value)}
            >
              <option value="newest">Sort: Newest</option>
              <option value="distance">Sort: Closest</option>
              <option value="relevance">Sort: Most relevant</option>
            </select>
          </div>

          <div>
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Filter by tags (comma separated)"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'bounty', label: 'Bounties' },
            { id: 'secondhand', label: 'Secondhand' },
            { id: 'activity', label: 'Activities' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id)}
              className={`px-3 py-1 rounded-lg text-sm ${
                typeFilter === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {filteredPosts.map((post) => {
          const isWatched =
            user &&
            (post.watchers || []).includes(user.email)

          return (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-sm p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold text-sm">
                    <Link
                      to={`/bounties/${post.id}`}
                      className="hover:underline"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <div className="text-sm font-semibold">
                    {post.type === 'sale' || post.type === 'free'
                      ? post.price
                        ? `$${post.price}`
                        : 'Free'
                      : post.reward
                      ? `$${post.reward}`
                      : ''}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${getBadgeColor(
                      post.type
                    )}`}
                  >
                    {typeLabel(post.type).toUpperCase()}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${getStatusColor(
                      post.status
                    )}`}
                  >
                    {post.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-gray-600 mb-2 line-clamp-3">
                  {post.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-2">
                  {(post.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="text-xs text-gray-500">
                  {post.location}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <button
                  onClick={() => onToggleWatch(post)}
                  className={`text-xs px-2 py-1 rounded-md border ${
                    isWatched
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {isWatched ? 'Watching' : 'Watch'}
                </button>

                <button
                  onClick={() => navigate(`/bounties/${post.id}`)}
                  className="text-xs px-3 py-1 rounded-md bg-gray-900 text-white hover:bg-black"
                >
                  Details
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {filteredPosts.length === 0 && (
        <p className="mt-6 text-center text-sm text-gray-500">
          No posts match your filters yet.
        </p>
      )}
    </Layout>
  )
}
