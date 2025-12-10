import { useMemo, useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { usePostsStore } from '../store'

// Fix missing marker assets in Vite/React builds so Leaflet doesn't show "?"
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

export default function MapView() {
  const { posts, isLoading } = usePostsStore()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [mapReady, setMapReady] = useState(false)

  const crumbs = [
    { label: 'Home', path: '/' },
    { label: 'Map' },
  ]

  useEffect(() => {
    if (typeof window === 'undefined') return
    // Leaflet 只在浏览器端使用，这里标记为 ready
    setMapReady(true)
  }, [])

  // 只取有坐标的帖子
  const postsWithCoords = useMemo(() => {
    return posts
      .map((p) => {
        const lat = Number(p.lat)
        const lng = Number(p.lng)
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
        return { ...p, lat, lng }
      })
      .filter(Boolean)
  }, [posts])

  // 搜索过滤
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return postsWithCoords
    return postsWithCoords.filter((p) => {
      const loc = (p.location || '').toLowerCase()
      const title = (p.title || '').toLowerCase()
      return loc.includes(q) || title.includes(q)
    })
  }, [postsWithCoords, query])

  const defaultCenter = [43.075, -89.4]
  const center =
    visible.length > 0
      ? [visible[0].lat, visible[0].lng]
      : defaultCenter

  const noPostsPinned = postsWithCoords.length === 0
  const noSearchResults = query.trim() && visible.length === 0

  // 在地图里复用和详情页类似的导航逻辑
  const openMaps = (post) => {
    if (typeof post.lat === 'number' && typeof post.lng === 'number') {
      const destination = `${post.lat},${post.lng}`
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        destination
      )}&travelmode=walking`
      window.open(url, '_blank')
      return
    }

    if (post.location && post.location.trim()) {
      const q = `${post.location.trim()}, Madison, WI`
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        q
      )}&travelmode=walking`
      window.open(url, '_blank')
      return
    }
  }

  // ⭐ 注意：所有 hooks 都已经在上面执行完了
  // 现在再根据 isLoading 提前 return 就不会违反 hooks 规则了
  if (isLoading) {
    return (
      <Layout crumbs={crumbs}>
        <p className="text-gray-600 text-sm">Loading posts…</p>
      </Layout>
    )
  }

  return (
    <Layout crumbs={crumbs}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 左侧：地图 */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Map view</h2>
            <p className="text-[11px] text-gray-500">
              Pins are posts with latitude &amp; longitude.
            </p>
          </div>

          <div className="mb-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search place name (location or title)…"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-[11px] text-gray-600">
              Example: &quot;Lakeshore&quot;, &quot;Lucky&quot;, &quot;desk&quot;.
            </p>
          </div>

          <div className="h-[420px] rounded-lg overflow-hidden border border-gray-200">
            {mapReady ? (
              <MapContainer
                center={center}
                zoom={14}
                key={center.join(',')}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                {visible.map((post) => (
                  <Marker
                    key={post.id}
                    position={[post.lat, post.lng]}
                  >
                    <Popup>
                      <div className="text-xs space-y-1">
                        <div className="font-semibold">
                          {post.title}
                        </div>
                        <div className="text-gray-600">
                          {post.location}
                        </div>
                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={() =>
                              navigate(`/bounties/${post.id}`)
                            }
                            className="px-2 py-1 rounded bg-blue-600 text-white text-[11px]"
                          >
                            View post
                          </button>
                          <button
                            onClick={() => openMaps(post)}
                            className="px-2 py-1 rounded bg-indigo-600 text-white text-[11px]"
                          >
                            Take me there
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                Loading map...
              </div>
            )}
          </div>

          {noPostsPinned && (
            <p className="mt-2 text-[11px] text-gray-600">
              No posts have pinned locations yet. Create a post with
              latitude and longitude to see it on the map.
            </p>
          )}

          {noSearchResults && !noPostsPinned && (
            <p className="mt-2 text-[11px] text-gray-600">
              No posts found for this place name.
            </p>
          )}
        </div>

        {/* 右侧：列表 */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-sm font-semibold mb-2">
            Posts on map ({visible.length})
          </h2>

          {visible.length === 0 ? (
            <p className="text-[12px] text-gray-500">
              {noPostsPinned
                ? 'No posts have coordinates yet.'
                : 'No posts match your search.'}
            </p>
          ) : (
            <ul className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {visible.map((post) => (
                <li key={post.id} className="border-b border-gray-100 pb-2 last:border-0">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="text-sm font-semibold">
                        {post.title}
                      </div>
                      <div className="text-[11px] text-gray-600">
                        {post.location || 'Location not specified'}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {(post.tags || []).map((t) => (
                          <button
                            key={`${post.id}-${t}`}
                            type="button"
                            onClick={() => setQuery(t)}
                            className="inline-flex items-center rounded-full border border-gray-200 px-2 py-[2px] text-[10px] text-gray-700 bg-gray-50"
                            title="Click to search this place / tag"
                          >
                            #{t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-1 flex gap-2">
                    <button
                      onClick={() =>
                        navigate(`/bounties/${post.id}`)
                      }
                      className="text-[11px] text-blue-600 hover:underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => openMaps(post)}
                      className="text-[11px] text-indigo-600 hover:underline"
                    >
                      Take me there
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  )
}
