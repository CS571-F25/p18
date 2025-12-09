import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

const now = Date.now()

// 初始假数据：每条都带上 lat / lng
const initialMockPosts = [
  {
    id: '1',
    createdAt: now - 1000 * 60 * 60 * 5,
    title: 'Office Chair - Like New',
    type: 'sale',
    status: 'open',
    price: 25,
    reward: null,
    description: 'Comfortable office chair, barely used. Great condition!',
    tags: ['furniture', 'chair', 'lakeshore'],
    location: 'Lakeshore Dorms',
    lat: 43.076,
    lng: -89.41,
    ownerName: 'Demo User',
    ownerEmail: 'demo1@wisc.edu',
    comments: [],
    watchers: [],
  },
  {
    id: '2',
    createdAt: now - 1000 * 60 * 60 * 10,
    title: 'Free Bookshelf',
    type: 'free',
    status: 'open',
    price: 0,
    reward: null,
    description: 'Small bookshelf, free to good home. Pick up only.',
    tags: ['furniture', 'bookshelf', 'free'],
    location: 'Southeast Dorms',
    lat: 43.071,
    lng: -89.39,
    ownerName: 'Demo User',
    ownerEmail: 'demo2@wisc.edu',
    comments: [],
    watchers: [],
  },
  {
    id: '3',
    createdAt: now - 1000 * 60 * 60 * 3,
    title: 'Need Help Moving Boxes',
    type: 'bounty',
    status: 'open',
    price: null,
    reward: 30,
    description:
      'Looking for someone to help move boxes from apartment to storage unit. Should take about 2 hours.',
    tags: ['moving', 'help', 'downtown'],
    location: 'Downtown',
    lat: 43.074,
    lng: -89.386,
    ownerName: 'Demo User',
    ownerEmail: 'demo3@wisc.edu',
    comments: [],
    watchers: [],
  },
  {
    id: '4',
    createdAt: now - 1000 * 60 * 60 * 2,
    title: 'IKEA Desk Assembly',
    type: 'bounty',
    status: 'claimed',
    price: null,
    reward: 20,
    description:
      'Need someone to assemble an IKEA desk. Tools provided, just need the help!',
    tags: ['assembly', 'desk', 'near campus'],
    location: 'Near Campus',
    lat: 43.073,
    lng: -89.399,
    ownerName: 'Demo User',
    ownerEmail: 'demo4@wisc.edu',
    claimedByName: 'Sample Student',
    claimedByEmail: 'sample@wisc.edu',
    comments: [],
    watchers: [],
  },
]

// ---------- Posts store ----------
const PostsContext = createContext(null)

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // 模拟"小后端"：从 localStorage 读取
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = window.localStorage.getItem('madforum_posts')
        if (stored) {
          const parsed = JSON.parse(stored)
          // Ensure lat/lng are numbers (they might be strings from localStorage)
          const normalized = parsed.map((post) => ({
            ...post,
            lat: post.lat != null ? Number(post.lat) : null,
            lng: post.lng != null ? Number(post.lng) : null,
          }))
          setPosts(normalized)
        } else {
          setPosts(initialMockPosts)
        }
      } catch (err) {
        console.warn('Failed to load posts from localStorage', err)
        setPosts(initialMockPosts)
      } finally {
        setIsLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // 写回 localStorage
  useEffect(() => {
    if (isLoading) return
    try {
      window.localStorage.setItem('madforum_posts', JSON.stringify(posts))
    } catch (err) {
      console.warn('Failed to save posts', err)
    }
  }, [posts, isLoading])

  const updatePost = (id, updater) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const next =
          typeof updater === 'function' ? updater(p) : { ...p, ...updater }
        return next
      })
    )
  }

  const createPost = (data, user) => {
    const t = Date.now()
    const id = String(t)
    const newPost = {
      id,
      createdAt: t,
      status: 'open',
      comments: [],
      watchers: [],
      ownerName: user?.name || 'Anonymous',
      ownerEmail: user?.email || '',
      // 这里 data 里可以带 lat / lng / location / 其他
      ...data,
    }
    setPosts((prev) => [newPost, ...prev])
    return id
  }

  const changeStatus = (id, status, user) => {
    updatePost(id, (post) => {
      const next = { ...post, status }
      if (status === 'claimed' && user) {
        next.claimedByName = user.name
        next.claimedByEmail = user.email
      }
      return next
    })
  }

  const toggleWatchlist = (id, user) => {
    if (!user) return
    updatePost(id, (post) => {
      const set = new Set(post.watchers || [])
      if (set.has(user.email)) set.delete(user.email)
      else set.add(user.email)
      return { ...post, watchers: Array.from(set) }
    })
  }

  const addComment = (id, text, user) => {
    const content = text.trim()
    if (!content) return
    updatePost(id, (post) => ({
      ...post,
      comments: [
        ...(post.comments || []),
        {
          id: String(Date.now()),
          text: content,
          authorName: user?.name || 'Anonymous',
          authorEmail: user?.email || '',
          createdAt: new Date().toISOString(),
        },
      ],
    }))
  }

  const updateComment = (id, commentId, text, user) => {
    const content = (text || '').trim()
    if (!content) return false
    if (!user?.email) return false
    let updated = false

    updatePost(id, (post) => {
      const comments = post.comments || []
      const nextComments = comments.map((c) => {
        if (c.id !== commentId) return c
        const isOwner = c.authorEmail && c.authorEmail === user.email
        if (!isOwner) return c
        updated = true
        return { ...c, text: content, editedAt: new Date().toISOString() }
      })
      return { ...post, comments: nextComments }
    })

    return updated
  }

  const deletePost = (id, user) => {
    if (!user?.email) return false
    let removed = false
    setPosts((prev) => {
      const next = prev.filter((p) => {
        if (p.id !== id) return true
        const isOwner = p.ownerEmail && p.ownerEmail === user.email
        if (!isOwner) return true
        removed = true
        return false
      })
      return next
    })
    return removed
  }

  // Update editable post fields with ownership check
  const updatePostFields = (id, data, user) => {
    let updated = false
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p

        // Only the creator (ownerEmail) can edit
        const isOwner =
          user && p.ownerEmail && p.ownerEmail === user.email
        if (!isOwner) return p

        updated = true
        return {
          ...p,
          ...data,
          updatedAt: Date.now(),
        }
      })
    )
    return updated
  }

  return (
    <PostsContext.Provider
      value={{
        posts,
        isLoading,
        createPost,
        changeStatus,
        toggleWatchlist,
        addComment,
        updateComment,
        updatePostFields,
        deletePost,
      }}
    >
      {children}
    </PostsContext.Provider>
  )
}

export function usePostsStore() {
  const ctx = useContext(PostsContext)
  if (!ctx) throw new Error('usePostsStore must be used within PostsProvider')
  return ctx
}

// ---------- Auth ----------
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = window.localStorage.getItem('madforum_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [users, setUsers] = useState(() => {
    try {
      const stored = window.localStorage.getItem('madforum_users')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Persist current user
  useEffect(() => {
    try {
      if (user) {
        window.localStorage.setItem('madforum_user', JSON.stringify(user))
      } else {
        window.localStorage.removeItem('madforum_user')
      }
    } catch (err) {
      console.warn('Failed to store user', err)
    }
  }, [user])

  // Persist user list
  useEffect(() => {
    try {
      window.localStorage.setItem('madforum_users', JSON.stringify(users))
    } catch (err) {
      console.warn('Failed to store users', err)
    }
  }, [users])

  const register = (username, email, password) => {
    const uname = (username || '').trim()
    const emailNorm = (email || '').trim().toLowerCase()
    const pwd = (password || '').trim()

    if (!uname || !emailNorm || !pwd) {
      return { ok: false, error: 'All fields are required.' }
    }

    const existsUsername = users.some(
      (u) => u.username.toLowerCase() === uname.toLowerCase()
    )
    if (existsUsername) {
      return { ok: false, error: 'Username already taken.' }
    }

    const existsEmail = users.some((u) => u.email === emailNorm)
    if (existsEmail) {
      return { ok: false, error: 'Email already registered.' }
    }

    const newUser = { username: uname, email: emailNorm, password: pwd }
    setUsers((prev) => [...prev, newUser])
    setUser({ name: uname, email: emailNorm })
    return { ok: true }
  }

  const login = (identifier, password) => {
    const idNorm = (identifier || '').trim().toLowerCase()
    const pwd = (password || '').trim()
    if (!idNorm || !pwd) {
      return { ok: false, error: 'Email/username and password are required.' }
    }
    const found = users.find(
      (u) =>
        u.email === idNorm ||
        u.username.toLowerCase() === idNorm
    )
    if (!found) {
      return { ok: false, error: 'Account not found.' }
    }
    if (found.password !== pwd) {
      return { ok: false, error: 'Incorrect password.' }
    }
    setUser({ name: found.username, email: found.email })
    return { ok: true }
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout, users }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

// ---------- Toast ----------
const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = (message, type = 'success') => {
    const id = String(Date.now())
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

// ---------- 辅助：badge 颜色 ----------
export function getBadgeColor(type) {
  switch (type) {
    case 'sale':
      return 'bg-blue-100 text-blue-800'
    case 'free':
      return 'bg-green-100 text-green-800'
    case 'bounty':
      return 'bg-purple-100 text-purple-800'
    case 'activity':
      return 'bg-teal-100 text-teal-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function getStatusColor(status) {
  switch (status) {
    case 'open':
      return 'bg-green-100 text-green-800'
    case 'claimed':
      return 'bg-yellow-100 text-yellow-800'
    case 'completed':
      return 'bg-blue-100 text-blue-800'
    case 'closed':
      return 'bg-gray-200 text-gray-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}
