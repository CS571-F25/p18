import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import {
  usePostsStore,
  useAuth,
  useToast,
  getBadgeColor,
  getStatusColor,
} from '../store'

export default function BountyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    posts,
    isLoading,
    changeStatus,
    toggleWatchlist,
    addComment,
    updateComment,
    deletePost,
  } =
    usePostsStore()
  const { user } = useAuth()
  const { showToast } = useToast()

  const post = posts.find((p) => String(p.id) === String(id))
  const [commentText, setCommentText] = useState('')
  const [editCommentId, setEditCommentId] = useState(null)
  const [editCommentText, setEditCommentText] = useState('')

  const crumbs = [
    { label: 'Home', path: '/' },
    { label: 'Bounties', path: '/' },
    { label: post ? post.title : 'Loading...' },
  ]

  if (isLoading) {
    return (
      <Layout crumbs={crumbs}>
        <p className="text-gray-500 text-sm">Loading post…</p>
      </Layout>
    )
  }

  const handleDelete = () => {
    if (!isOwner) return
    const ok = deletePost(post.id, user)
    if (!ok) {
      showToast('Only the owner can delete this post.', 'error')
      return
    }
    showToast('Post deleted.')
    navigate('/')
  }

  if (!post) {
    return (
      <Layout crumbs={crumbs}>
        <p className="text-gray-500 text-sm">
          Post not found.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-3 px-3 py-2 text-xs border rounded text-gray-600 hover:bg-gray-50"
        >
          Back to feed
        </button>
      </Layout>
    )
  }

  const isOwner =
    user && post.ownerEmail && post.ownerEmail === user.email
  const hasClaimed =
    user && post.claimedByEmail && post.claimedByEmail === user.email

  const isWatched =
    user && (post.watchers || []).includes(user.email)

  const handleClaim = () => {
    if (!user) {
      showToast('Please register or sign in to claim.', 'error')
      return
    }
    if (post.status !== 'open') return
    changeStatus(post.id, 'claimed', user)
    showToast('You have claimed this task.')
  }

  const handleComplete = () => {
    if (!(isOwner || hasClaimed)) return
    if (post.status !== 'claimed') return
    changeStatus(post.id, 'completed', user)
    showToast('Marked as completed.')
  }

  const handleClose = () => {
    if (!isOwner) return
    if (post.status !== 'completed') return
    changeStatus(post.id, 'closed', user)
    showToast('Post closed.')
  }

  const handleStatusChange = (e) => {
    if (!isOwner) return
    const newStatus = e.target.value
    if (newStatus === post.status) return
    
    // Only allow changing between open, claimed, and closed
    if (!['open', 'claimed', 'closed'].includes(newStatus)) return
    
    changeStatus(post.id, newStatus, user)
    showToast(`Status changed to ${newStatus}.`)
  }

  const handleToggleWatch = () => {
    if (!user) {
      showToast('Please register to use watchlist.', 'error')
      return
    }
    toggleWatchlist(post.id, user)
    showToast('Updated watchlist.', 'success')
  }

  // ⭐ 导航逻辑：优先用经纬度，没有就用 location 名字
  const handleNavigate = () => {
    // 1) 优先用经纬度
    if (typeof post.lat === 'number' && typeof post.lng === 'number') {
      const destination = `${post.lat},${post.lng}`
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        destination
      )}&travelmode=walking`
      window.open(url, '_blank')
      return
    }

    // 2) 没有经纬度，但有地名，直接交给 Google Maps 搜
    if (post.location && post.location.trim()) {
      const query = `${post.location.trim()}, Madison, WI`
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        query
      )}&travelmode=walking`
      window.open(url, '_blank')
      return
    }

    // 3) 两个都没有
    showToast(
      'This post does not have a location yet. Please add a location name or coordinates when creating the post.',
      'error'
    )
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    const content = commentText.trim()
    if (!content) return
    addComment(post.id, content, user)
    setCommentText('')
    showToast('Comment posted.')
  }

  const handleCommentEditStart = (comment) => {
    setEditCommentId(comment.id)
    setEditCommentText(comment.text || '')
  }

  const handleCommentEditSave = (comment) => {
    const content = editCommentText.trim()
    if (!content) return
    const ok = updateComment(post.id, comment.id, content, user)
    if (!ok) {
      showToast('Only the comment author can edit this comment.', 'error')
      return
    }
    setEditCommentId(null)
    setEditCommentText('')
    showToast('Comment updated.')
  }

  const handleCommentEditCancel = () => {
    setEditCommentId(null)
    setEditCommentText('')
  }

  return (
    <Layout crumbs={crumbs}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* 主内容卡片 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
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
              <h2 className="text-xl font-semibold mb-1">
                {post.title}
              </h2>
              <p className="text-sm text-gray-600">
                {post.location}
              </p>
            </div>

            <div className="text-right flex flex-col items-end gap-2">
              {post.type === 'sale' || post.type === 'free' ? (
                <div className="text-2xl font-semibold text-gray-900">
                  {post.price ? `$${post.price}` : 'Free'}
                </div>
              ) : post.reward ? (
                <div className="text-2xl font-semibold text-gray-900">
                  ${post.reward}
                </div>
              ) : null}

              <button
                type="button"
                onClick={handleToggleWatch}
                className={`text-xl leading-none ${
                  isWatched ? 'text-red-500' : 'text-gray-500'
                }`}
              >
                {isWatched ? '★' : '☆'}
              </button>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-800 whitespace-pre-wrap">
            {post.description}
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600">
            <div>
              <span className="font-semibold">Posted by: </span>
              {post.ownerName || 'Anonymous'}
              {post.ownerEmail && (
                <span className="ml-1 text-gray-500">
                  ({post.ownerEmail})
                </span>
              )}
            </div>
            {post.claimedByName && (
              <div>
                <span className="font-semibold">Claimed by: </span>
                {post.claimedByName}
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-1">
            {(post.tags || []).map((t) => (
              <button
                key={t}
                onClick={() => navigate(`/?tag=${encodeURIComponent(t.toLowerCase())}`)}
                className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs hover:bg-gray-200 cursor-pointer transition-colors"
                title="Click to see all posts with this tag"
              >
                #{t}
              </button>
            ))}
          </div>

          {/* Owner Status Selector */}
          {isOwner && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Change Status (Owner Only):
              </label>
              <select
                value={post.status}
                onChange={handleStatusChange}
                className="px-3 py-2 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="open">Open</option>
                <option value="claimed">Claimed</option>
                <option value="closed">Closed</option>
              </select>
              <p className="mt-1 text-[10px] text-gray-600">
                Only you can change the status of your post.
              </p>
            </div>
          )}

          {/* 状态 + 导航按钮 */}
          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-3 py-2 border rounded text-gray-600 hover:bg-gray-50"
            >
              Back
            </button>

            {isOwner && (
              <button
                type="button"
                onClick={() => navigate(`/bounties/${post.id}/edit`)}
                className="px-3 py-2 bg-white border border-gray-200 rounded text-gray-700 hover:bg-gray-50"
              >
                Edit post
              </button>
            )}

            {isOwner && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded hover:bg-red-100"
              >
                Delete post
              </button>
            )}

            {post.status === 'open' && (
              <button
                type="button"
                onClick={handleClaim}
                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Claim task
              </button>
            )}

            {post.status === 'claimed' && (isOwner || hasClaimed) && (
              <button
                type="button"
                onClick={handleComplete}
                className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Mark as completed
              </button>
            )}

            {post.status === 'completed' && isOwner && (
              <button
                type="button"
                onClick={handleClose}
                className="px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
              >
                Close post
              </button>
            )}

            {/* ⭐ Take me there 按钮 */}
            <button
              type="button"
              onClick={handleNavigate}
              className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Take me there
            </button>
          </div>
        </div>

        {/* 评论区 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-semibold mb-3">
            Comments
          </h3>

          {(post.comments || []).length === 0 && (
            <p className="text-xs text-gray-600 mb-3">
              No comments yet. Be the first to ask a question or express
              interest.
            </p>
          )}

          <div className="space-y-3 mb-4">
            {(post.comments || []).map((c) => (
              <div
                key={c.id}
                className="border border-gray-100 rounded p-2 text-xs"
              >
                <div className="flex justify-between mb-1">
                  <span className="font-semibold">
                    {c.authorName || 'Anonymous'}
                  </span>
                  {c.createdAt && (
                    <span className="text-gray-500">
                      {new Date(c.createdAt).toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {editCommentId === c.id ? (
                    <textarea
                      className="w-full px-2 py-1 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={editCommentText}
                      onChange={(e) => setEditCommentText(e.target.value)}
                      rows={2}
                    />
                  ) : (
                    c.text
                  )}
                </p>
                {editCommentId === c.id ? (
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleCommentEditSave(c)}
                      className="px-2 py-1 text-[11px] bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleCommentEditCancel}
                      className="px-2 py-1 text-[11px] border rounded text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                ) : user?.email && c.authorEmail === user.email ? (
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleCommentEditStart(c)}
                      className="px-2 py-1 text-[11px] border rounded text-gray-600 hover:bg-gray-50"
                    >
                      Edit
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <form
            className="space-y-2"
            onSubmit={handleCommentSubmit}
          >
            <textarea
              className="w-full px-3 py-2 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Ask a question or leave a comment…"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-3 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Post comment
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
