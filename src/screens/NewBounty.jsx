import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { usePostsStore, useAuth, useToast } from '../store'

const inputClass =
  'w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'

export default function NewBounty() {
  const navigate = useNavigate()
  const { createPost } = usePostsStore()
  const { user } = useAuth()
  const { showToast } = useToast()

  const [title, setTitle] = useState('')
  const [type, setType] = useState('bounty')
  const [priceOrReward, setPriceOrReward] = useState('')
  const [location, setLocation] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [description, setDescription] = useState('')
  const [tagsInput, setTagsInput] = useState('')

  const crumbs = [
    { label: 'Home', path: '/' },
    { label: 'New Post' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()

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

    let latNum = null
    let lngNum = null

    if (lat.trim()) {
      latNum = Number(lat)
      if (Number.isNaN(latNum)) {
        showToast('Latitude must be a number.', 'error')
        return
      }
    }
    if (lng.trim()) {
      lngNum = Number(lng)
      if (Number.isNaN(lngNum)) {
        showToast('Longitude must be a number.', 'error')
        return
      }
    }

    const payload = {
      title: title.trim(),
      type,
      status: 'open',
      price:
        type === 'sale' || type === 'free'
          ? Number(priceOrReward) || 0
          : null,
      reward:
        type === 'bounty'
          ? Number(priceOrReward) || 0
          : null,
      description: description.trim(),
      location: location.trim(), // 地点名称（和地图搜索对应）
      lat: latNum,
      lng: lngNum,
      tags,
    }

    const id = createPost(payload, user)
    showToast('Post created!', 'success')
    navigate(`/bounties/${id}`)
  }

  return (
    <Layout crumbs={crumbs}>
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold mb-4">
          Create a new post
        </h1>

        {!user && (
          <p className="mb-4 text-xs text-yellow-800 bg-yellow-50 border border-yellow-200 rounded px-3 py-2">
            You are not registered yet. You can still post anonymously, but
            registering will attach posts to your name.
          </p>
        )}

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

          {/* 地点名称 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Location name (dorm / apartment / place)
            </label>
            <input
              className={inputClass}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Lucky, The James, Lakeshore Dorms"
            />
            <p className="mt-1 text-[11px] text-gray-600">
              This name will appear on the card and in map search.
            </p>
          </div>

          {/* 经纬度（可选） */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Latitude (optional)
              </label>
              <input
                className={inputClass}
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="e.g. 43.0735"
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
                placeholder="-89.399"
              />
            </div>
          </div>
          <p className="text-[11px] text-gray-600">
            If you fill latitude and longitude, this post will appear as a
            pin on the map and can be sorted by distance. You can copy
            coordinates from Google Maps.
          </p>

          {/* Tags + 提示 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Tags (comma separated)
            </label>
            <input
              className={inputClass}
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder='e.g. furniture, moving, "Lakeshore Dorms"'
            />
            <p className="mt-1 text-[11px] text-gray-600">
              If you add a tag for the location, please type the place name
              exactly as it appears on the map（和地图上的地名保持一致）.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea
              className={`${inputClass} min-h-[120px]`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add important details: time, size, pickup instructions, etc."
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Publish
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
