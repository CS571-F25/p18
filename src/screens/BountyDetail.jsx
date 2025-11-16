// src/screens/BountyDetail.jsx
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import {
  usePostsStore,
  getBadgeColor,
  getStatusColor,
} from '../store'

export default function BountyDetail() {
  const { posts, setPosts } = usePostsStore()
  const { id } = useParams()
  const navigate = useNavigate()
  const post = posts.find((p) => String(p.id) === String(id))

  const [comment, setComment] = useState('')
  const [imageIndex, setImageIndex] = useState(0)

  if (!post || post.deleted) {
    return (
      <Layout
        crumbs={[
          { label: 'Home', path: '/' },
          { label: '悬赏', path: '/' },
          { label: 'Post not found' },
        ]}
      >
        <p className="text-gray-700">Post not found or has been removed.</p>
      </Layout>
    )
  }

  const addComment = () => {
    if (!comment.trim()) return
    const next = posts.map((p) =>
      p.id === post.id
        ? {
            ...p,
            comments: [
              ...(p.comments || []),
              { id: Date.now(), text: comment.trim() },
            ],
          }
        : p
    )
    setPosts(next)
    setComment('')
  }

  const changeStatus = (nextStatus) => {
    const next = posts.map((p) =>
      p.id === post.id ? { ...p, status: nextStatus } : p
    )
    setPosts(next)
  }

  const softDelete = () => {
    const next = posts.map((p) =>
      p.id === post.id ? { ...p, deleted: true, status: 'closed' } : p
    )
    setPosts(next)
    navigate('/')
  }

  const images = post.images || []
  const canPrev = imageIndex > 0
  const canNext = imageIndex < images.length - 1

  return (
    <Layout
      crumbs={[
        { label: 'Home', path: '/' },
        { label: '悬赏', path: '/' },
        { label: post.title },
      ]}
    >
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl">
        {images.length > 0 && (
          <div className="mb-4">
            <div className="aspect-[4/3] rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
              <img
                src={images[imageIndex]}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex items-center justify-between mt-2 text-xs">
                <button
                  onClick={() => canPrev && setImageIndex(imageIndex - 1)}
                  disabled={!canPrev}
                  className="px-2 py-1 border rounded disabled:opacity-40"
                >
                  Prev
                </button>
                <span>
                  {imageIndex + 1} / {images.length}
                </span>
                <button
                  onClick={() => canNext && setImageIndex(imageIndex + 1)}
                  disabled={!canNext}
                  className="px-2 py-1 border rounded disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 mb-2">
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

        <h1 className="text-2xl font-bold mb-1">{post.title}</h1>
        {post.price !== undefined && (
          <p className="text-2xl font-bold mb-2">${post.price}</p>
        )}

        <p className="text-gray-700 my-3">{post.description}</p>

        <div className="flex flex-wrap gap-2 mb-2">
          {(post.tags || []).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs"
            >
              #{t}
            </span>
          ))}
        </div>

        <p className="text-sm text-gray-500 mb-4">{post.location}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {['open', 'claimed', 'completed', 'closed'].map((s) => (
            <button
              key={s}
              onClick={() => changeStatus(s)}
              className={`px-3 py-2 rounded text-xs border ${
                post.status === s
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-100 text-gray-700 border-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
          <button
            onClick={softDelete}
            className="px-3 py-2 rounded text-xs bg-red-50 text-red-700 border border-red-200 ml-auto"
          >
            Soft delete
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-2">Questions &amp; Comments</h2>
        <div className="space-y-2 mb-3">
          {(post.comments || []).map((c) => (
            <div
              key={c.id}
              className="px-3 py-2 rounded bg-gray-50 text-sm text-gray-800"
            >
              {c.text}
            </div>
          ))}
          {(!post.comments || post.comments.length === 0) && (
            <p className="text-sm text-gray-500">No comments yet.</p>
          )}
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 px-3 py-2 border rounded text-sm"
            placeholder="Ask a question or express interest..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            onClick={addComment}
            className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Post
          </button>
        </div>
      </div>
    </Layout>
  )
}
