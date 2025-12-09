// src/store.js
import {
    createContext,
    useContext,
    useEffect,
    useState,
  } from 'react'
  
  /* ---------- 初始数据 ---------- */
  
  const initialMockPosts = [
    {
      id: 1,
      title: 'Office Chair - Like New',
      type: 'sale', // 二手卖
      price: 25,
      description: 'Comfortable office chair, barely used. Great condition!',
      status: 'open',
      tags: ['furniture', 'office'],
      location: 'Lakeshore Dorms',
      images: [
        'https://images.pexels.com/photos/813691/pexels-photo-813691.jpeg',
      ],
      comments: [],
    },
    {
      id: 2,
      title: 'Free Bookshelf',
      type: 'free', // 二手免费
      description: 'Small bookshelf, free to good home. Pick up only.',
      status: 'open',
      tags: ['furniture', 'free'],
      location: 'Southeast Dorms',
      images: [
        'https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg',
      ],
      comments: [],
    },
    {
      id: 3,
      title: 'Need Help Moving Boxes',
      type: 'bounty', // 悬赏
      price: 30,
      description:
        'Looking for someone to help move boxes from apartment to storage unit. Should take about 2 hours.',
      status: 'open',
      tags: ['moving', 'help'],
      location: 'Downtown',
      images: [],
      comments: [],
    },
    {
      id: 4,
      title: 'IKEA Desk Assembly',
      type: 'bounty',
      price: 20,
      description:
        'Need someone to assemble a desk. Tools provided, just need the help!',
      status: 'claimed',
      tags: ['assembly', 'furniture'],
      location: 'Near Campus',
      images: [],
      comments: [],
    },
    {
      id: 5,
      title: 'Looking for Volleyball Teammates',
      type: 'activity', // 活动（找搭子）
      description:
        'Planning casual volleyball games on Sunday afternoons at the SERF. Looking for 3–4 more players.',
      status: 'open',
      tags: ['sports', 'activity'],
      location: 'SERF Gym',
      images: [],
      comments: [],
    },
  ]
  
  /* ---------- Posts Context ---------- */
  
  const PostsContext = createContext(null)
  
  export function PostsProvider({ children }) {
    const [posts, setPosts] = useState(() => {
      try {
        const saved = window.localStorage.getItem('madforum_posts')
        if (saved) return JSON.parse(saved)
      } catch (e) {
        console.warn('Failed to load posts from localStorage', e)
      }
      return initialMockPosts
    })
  
    useEffect(() => {
      try {
        window.localStorage.setItem('madforum_posts', JSON.stringify(posts))
      } catch (e) {
        console.warn('Failed to save posts to localStorage', e)
      }
    }, [posts])
  
    return (
      <PostsContext.Provider value={{ posts, setPosts }}>
        {children}
      </PostsContext.Provider>
    )
  }
  
  export function usePostsStore() {
    const ctx = useContext(PostsContext)
    if (!ctx) throw new Error('usePostsStore must be used within PostsProvider')
    return ctx
  }
  
  /* ---------- Auth / Register Context ---------- */
  
  const AuthContext = createContext(null)
  
  export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
      try {
        const saved = window.localStorage.getItem('madforum_user')
        if (saved) return JSON.parse(saved)
      } catch (e) {
        console.warn('Failed to load user from localStorage', e)
      }
      return null
    })
  
    useEffect(() => {
      try {
        if (user) {
          window.localStorage.setItem('madforum_user', JSON.stringify(user))
        } else {
          window.localStorage.removeItem('madforum_user')
        }
      } catch (e) {
        console.warn('Failed to save user to localStorage', e)
      }
    }, [user])
  
    const register = (name, email) => {
      // Generate a unique user ID
      const userId = Date.now().toString(36) + Math.random().toString(36).substr(2)
      setUser({
        id: userId,
        name: name || 'Anonymous',
        email: email || '',
      })
    }
  
    const logout = () => setUser(null)
  
    return (
      <AuthContext.Provider value={{ user, register, logout }}>
        {children}
      </AuthContext.Provider>
    )
  }
  
  export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
  }
  
  /* ---------- badge 工具函数，也导出去 ---------- */
  
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
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }
  