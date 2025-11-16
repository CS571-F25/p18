// src/screens/NewBounty.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { usePostsStore } from '../store'

export default function NewBounty() {
  const { posts, setPosts } = usePostsStore()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [type, setType] = useState('bounty')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [imageUrls, setImageUrls] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.')
      return
    }

    if (type === 'bounty' && price !== '') {
      const n = Number(price)
      if (Number.isNaN(n) || n < 0) {
        setError('Reward must be a non-negative number.')
        return
      }
    }

    const nextId = posts.length ? Math.max(...posts.map((p) => p.id)) + 1 : 1
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    const images = imageUrls
      .split(',')
      .map((u) => u.trim())
      .filter(Boolean)

    const newPost = {
      id: nextId,
      title: title.trim(),
      type,
      price: price === '' ? undefined : Number(price),
      description: description.trim(),
      status: 'open',
      tags,
      location: location.trim(),
      images,
      comments: [],
    }

    setPosts([...posts, newPost])
    navigate(`/bounties/${nextId}`)
  }

  return (
    <Layout
      crumbs={[
        { label: 'Home', path: '/' },
        { label: '悬赏', path: '/' },
        { label: 'New Bounty' },
      ]}
    >
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">Create a New Bounty</h1>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              className="w-full px-3 py-2 border rounded text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Need help moving boxes"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                className="w-full px-3 py-2 border rounded text-sm"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="bounty">Bounty</option>
                <option value="sale">Sale</option>
                <option value="free">Free</option>
                <option value="activity">Activity</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Reward / Price
              </label>
              <input
                type="number"
                min="0"
                className="w-full px-3 py-2 border rounded text-sm"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={
                  type === 'free' || type === 'activity'
                    ? 'N/A for this type'
                    : '$'
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Location
              </label>
              <input
                className="w-full px-3 py-2 border rounded text-sm"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Downtown"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded text-sm"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you need help with, estimated time, any tools required..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Tags (comma separated)
            </label>
            <input
              className="w-full px-3 py-2 border rounded text-sm"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="moving, heavy, car-needed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Image URLs (optional, comma separated)
            </label>
            <input
              className="w-full px-3 py-2 border rounded text-sm"
              value={imageUrls}
              onChange={(e) => setImageUrls(e.target.value)}
              placeholder="https://..., https://..."
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Publish Bounty
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
