import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import { usePostsStore, useAuth, useToast } from '../store'

const inputClass =
  'w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'

export default function EditBounty() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { posts, isLoading, updatePostFields } = usePostsStore()
  const { user } = useAuth()
  const { showToast } = useToast()

  const post = useMemo(
    () => posts.find((p) => String(p.id) === String(id)),
    [posts, id]
  )

  const isOwner =
    !!(user && post && post.ownerEmail && post.ownerEmail === user.email)

  const [title, setTitle] = useState('')
  const [type, setType] = useState('bounty')
  const [priceOrReward, setPriceOrReward] = useState('')
  const [location, setLocation] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [description, setDescription] = useState('')
  const [tagsInput, setTagsInput] = useState('')

  useEffect(() => {
    if (!post) return
    setTitle(post.title || '')
    setType(post.type || 'bounty')
    setPriceOrReward(
      post.type === 'bounty'
        ? post.reward ?? ''
        : post.type === 'sale' || post.type === 'free'
        ? post.price ?? ''
        : ''
    )
    setLocation(post.location || '')
    setLat(post.lat != null ? String(post.lat) : '')
    setLng(post.lng != null ? String(post.lng) : '')
    setDescription(post.description || '')
    setTagsInput((post.tags || []).join(', '))
  }, [post])

  const crumbs = [
    { label: 'Home', path: '/' },
    { label: 'Edit Post' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!post) return

    if (!title.trim()) {
      showToast('Title cannot be empty.', 'error')
      return
    }
    if (!description.trim()) {
      showToast('Description cannot be empty.', 'error')
      return
    }
    if (!location.trim()) {
      showToast('Location name is required.', 'error')
      return
    }

    const tags =
      tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean) || []

    const latNum = lat.trim() ? Number(lat) : null
    const lngNum = lng.trim() ? Number(lng) : null

    if (lat.trim() && Number.isNaN(latNum)) {
      showToast('Latitude must be a number.', 'error')
      return
    }
    if (lng.trim() && Number.isNaN(lngNum)) {
      showToast('Longitude must be a number.', 'error')
      return
    }

    const payload = {
      title: title.trim(),
      type,
      price:
        type === 'sale' || type === 'free'
          ? Number(priceOrReward) || 0
          : null,
      reward:
        type === 'bounty'
          ? Number(priceOrReward) || 0
          : null,
      description: description.trim(),
      location: location.trim(),
      lat: latNum,
      lng: lngNum,
      tags,
    }

    const ok = updatePostFields(post.id, payload, user)
    if (!ok) {
      showToast('Only the post owner can edit this post.', 'error')
      return
    }

    showToast('Post updated.', 'success')
    navigate(`/bounties/${post.id}`)
  }

  if (isLoading) {
    return (
      <Layout crumbs={crumbs}>
        <p className="text-gray-600 text-sm">Loading post…</p>
      </Layout>
    )
  }

  if (!post) {
    return (
      <Layout crumbs={crumbs}>
        <p className="text-sm text-gray-600">Post not found.</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-3 px-3 py-2 text-xs border rounded text-gray-600 hover:bg-gray-50"
        >
          Back to feed
        </button>
      </Layout>
    )
  }

  if (!isOwner) {
    return (
      <Layout crumbs={crumbs}>
        <p className="text-sm text-gray-700">
          Only the creator of this post can edit it.
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-3 py-2 text-xs border rounded text-gray-600 hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => navigate(`/bounties/${post.id}`)}
            className="px-3 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            View post
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout crumbs={crumbs}>
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold mb-4">
          Edit post
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Title
            </label>
            <input
              className={inputClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you need or what are you offering?"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Type
              </label>
              <select
                className={inputClass}
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="bounty">Bounty (help needed)</option>
                <option value="sale">Secondhand sale</option>
                <option value="free">Free item</option>
                <option value="activity">Activity / Find a buddy</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {type === 'sale'
                  ? 'Price ($)'
                  : type === 'bounty'
                  ? 'Reward ($)'
                  : 'Price / reward (optional)'}
              </label>
              <input
                type="number"
                min="0"
                step="1"
                className={inputClass}
                value={priceOrReward}
                onChange={(e) => setPriceOrReward(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Location name
              </label>
              <input
                className={inputClass}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Lakeshore Dorms, Downtown"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Latitude (optional)
                </label>
                <input
                  className={inputClass}
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  placeholder="43.07"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Longitude (optional)
                </label>
                <input
                  className={inputClass}
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  placeholder="-89.40"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea
              className={inputClass}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the task or item..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Tags (comma separated)
            </label>
            <input
              className={inputClass}
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="moving, furniture, UW"
            />
            <p className="mt-1 text-[11px] text-gray-600">
              Tip: tags make your post easier to find.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate(`/bounties/${post.id}`)}
              className="px-3 py-2 text-xs border rounded text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

