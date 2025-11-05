import { useEffect, useMemo, useState } from 'react'
import { Link, Routes, Route, useNavigate, useParams } from 'react-router-dom'
import './App.css'

const initialMockPosts = [
  {
    id: 1,
    title: 'Office Chair - Like New',
    type: 'sale',
    price: 25,
    description: 'Comfortable office chair, barely used. Great condition!',
    status: 'open',
    tags: ['furniture', 'office'],
    location: 'Lakeshore Dorms'
  },
  {
    id: 2,
    title: 'Free Bookshelf',
    type: 'free',
    description: 'Small bookshelf, free to good home. Pick up only.',
    status: 'open',
    tags: ['furniture', 'free'],
    location: 'Southeast Dorms'
  },
  {
    id: 3,
    title: 'Need Help Moving Boxes',
    type: 'bounty',
    price: 30,
    description: 'Looking for someone to help move boxes from apartment to storage unit. Should take about 2 hours.',
    status: 'open',
    tags: ['moving', 'help'],
    location: 'Downtown'
  },
  {
    id: 4,
    title: 'IKEA Desk Assembly',
    type: 'bounty',
    price: 20,
    description: 'Need someone to assemble a desk. Tools provided, just need the help!',
    status: 'claimed',
    tags: ['assembly', 'furniture'],
    location: 'Near Campus'
  }
]

function usePostsStore() {
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('madforum_posts')
    if (saved) return JSON.parse(saved)
    return initialMockPosts
  })

  useEffect(() => {
    localStorage.setItem('madforum_posts', JSON.stringify(posts))
  }, [posts])

  return { posts, setPosts }
}

function getBadgeColor(type) {
    switch (type) {
      case 'sale': return 'bg-blue-100 text-blue-800'
      case 'free': return 'bg-green-100 text-green-800'
      case 'bounty': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

function getStatusColor(status) {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800'
      case 'claimed': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
function Feed() {
  const navigate = useNavigate()
  const { posts } = usePostsStore()

  const [filter, setFilter] = useState('all')
  const [status, setStatus] = useState('all')
  const [min, setMin] = useState('')
  const [max, setMax] = useState('')
  const [tags, setTags] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = useMemo(() => {
    const wantedTags = tags
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean)

    return posts.filter(post => {
      const matchesType = filter === 'all' || post.type === filter
      const matchesStatus = status === 'all' || post.status === status
      const matchesMin = min === '' || (post.price ?? 0) >= Number(min)
      const matchesMax = max === '' || (post.price ?? 0) <= Number(max)
      const matchesTags = wantedTags.length === 0 || wantedTags.every(t => post.tags.map(x=>x.toLowerCase()).includes(t))
      const q = searchQuery.toLowerCase()
      const matchesSearch = q === '' || post.title.toLowerCase().includes(q) || post.description.toLowerCase().includes(q)
      return matchesType && matchesStatus && matchesMin && matchesMax && matchesTags && matchesSearch
    })
  }, [posts, filter, status, min, max, tags, searchQuery])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">MadForum</h1>
            <p className="text-gray-600 mt-1">Campus Forum for Rehoming & Bounty Tasks</p>
          </div>
          <button onClick={() => navigate('/new')} className="px-4 py-2 bg-blue-600 text-white rounded-lg">New Post</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input className="px-3 py-2 border rounded" placeholder="Search" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} />
            <div className="flex gap-2 flex-wrap">
              {['all','sale','free','bounty'].map(t => (
                <button key={t} onClick={()=>setFilter(t)} className={`px-3 py-2 rounded ${filter===t?'bg-blue-600 text-white':'bg-gray-100 text-gray-700'}`}>{t[0].toUpperCase()+t.slice(1)}</button>
              ))}
            </div>
            <select className="px-3 py-2 border rounded" value={status} onChange={e=>setStatus(e.target.value)}>
              {['all','open','claimed','completed','closed'].map(s => <option key={s} value={s}>{s[0].toUpperCase()+s.slice(1)}</option>)}
            </select>
            <div className="flex gap-2">
              <input className="px-3 py-2 border rounded w-full" placeholder="Min $" value={min} onChange={e=>setMin(e.target.value)} />
              <input className="px-3 py-2 border rounded w-full" placeholder="Max $" value={max} onChange={e=>setMax(e.target.value)} />
            </div>
          </div>
          <div className="mt-4">
            <input className="px-3 py-2 border rounded w-full" placeholder="Tags (comma separated)" value={tags} onChange={e=>setTags(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-start justify-between mb-3">
                <Link to={`/post/${post.id}`} className="text-xl font-semibold text-gray-900 flex-1 hover:underline">
                  {post.title}
                </Link>
              </div>
              <div className="flex gap-2 mb-3 flex-wrap">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getBadgeColor(post.type)}`}>{post.type[0].toUpperCase()+post.type.slice(1)}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(post.status)}`}>{post.status[0].toUpperCase()+post.status.slice(1)}</span>
              </div>
              {post.price !== undefined && (
                <div className="mb-3"><span className="text-2xl font-bold text-gray-900">${post.price}</span></div>
              )}
              <p className="text-gray-600 mb-4 line-clamp-3">{post.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map(tag => (<span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">#{tag}</span>))}
              </div>
              <div className="flex items-center text-sm text-gray-500">{post.location}</div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12"><p className="text-gray-500 text-lg">No posts found.</p></div>
        )}
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">MadForum - Proof of Concept | CS571 Web Project</p>
        </div>
      </footer>
    </div>
  )
}

function PostDetail() {
  const { posts, setPosts } = usePostsStore()
  const { id } = useParams()
  const navigate = useNavigate()
  const post = posts.find(p => String(p.id) === String(id))
  const [comment, setComment] = useState('')
  const [imagesIdx, setImagesIdx] = useState(0)

  if (!post) return <div className="max-w-3xl mx-auto p-6">Post not found.</div>

  const addComment = () => {
    if (!comment.trim()) return
    const next = posts.map(p => p.id===post.id ? { ...p, comments: [...(p.comments||[]), { id: Date.now(), text: comment }] } : p)
    setPosts(next)
    setComment('')
  }

  const changeStatus = (nextStatus) => {
    setPosts(posts.map(p => p.id===post.id ? { ...p, status: nextStatus } : p))
  }

  const softDelete = () => {
    setPosts(posts.map(p => p.id===post.id ? { ...p, deleted: true } : p))
    navigate('/')
  }

  const imgs = post.images || []

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button className="mb-4 text-blue-600" onClick={()=>navigate(-1)}>&larr; Back</button>
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <div className="flex gap-2 mb-3 flex-wrap">
        <span className={`px-2 py-1 rounded text-xs font-medium ${getBadgeColor(post.type)}`}>{post.type}</span>
        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(post.status)}`}>{post.status}</span>
      </div>
      {imgs.length > 0 && (
        <div className="mb-4">
          <img alt="preview" src={imgs[imagesIdx]} className="w-full max-h-96 object-cover rounded" />
          <div className="flex gap-2 mt-2">
            {imgs.map((src, i)=>(
              <img key={i} onClick={()=>setImagesIdx(i)} alt="thumb" src={src} className={`h-16 w-16 object-cover rounded cursor-pointer ${i===imagesIdx?'ring-2 ring-blue-500':''}`} />
            ))}
          </div>
        </div>
      )}
      {post.price !== undefined && (<p className="text-2xl font-bold">${post.price}</p>)}
      <p className="text-gray-700 my-4">{post.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">{post.tags.map(t=> <span key={t} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">#{t}</span>)}</div>
      <p className="text-sm text-gray-500 mb-4">{post.location}</p>

      <div className="flex gap-2 mb-6">
        {['open','claimed','completed','closed'].map(s => (
          <button key={s} onClick={()=>changeStatus(s)} className={`px-3 py-2 rounded ${post.status===s?'bg-blue-600 text-white':'bg-gray-100 text-gray-700'}`}>{s}</button>
        ))}
        <button onClick={softDelete} className="px-3 py-2 rounded bg-red-100 text-red-700">Soft Delete</button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Comments</h2>
      <div className="space-y-2 mb-3">{(post.comments||[]).map(c => (
        <div key={c.id} className="p-3 bg-white rounded border">{c.text}</div>
      ))}</div>
      <div className="flex gap-2">
        <input value={comment} onChange={e=>setComment(e.target.value)} className="flex-1 px-3 py-2 border rounded" placeholder="Write a comment..." />
        <button onClick={addComment} className="px-3 py-2 bg-blue-600 text-white rounded">Post</button>
      </div>
    </div>
  )
}

function NewPost() {
  const { posts, setPosts } = usePostsStore()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [type, setType] = useState('sale')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [tags, setTags] = useState('')
  const [images, setImages] = useState([])

  const onDrop = async (files) => {
    const readers = Array.from(files).slice(0,6).map(file => new Promise(resolve => {
      const reader = new FileReader()
      reader.onload = e => resolve(e.target.result)
      reader.readAsDataURL(file)
    }))
    const results = await Promise.all(readers)
    setImages(results)
  }

  const submit = () => {
    const id = Math.max(0, ...posts.map(p=>p.id)) + 1
    const newPost = {
      id,
      title: title.trim() || 'Untitled',
      type,
      price: type==='free' ? undefined : Number(price||0),
      description,
      status: 'open',
      tags: tags.split(',').map(t=>t.trim()).filter(Boolean),
      location,
      images,
      comments: []
    }
    setPosts([newPost, ...posts])
    navigate(`/post/${id}`)
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button className="mb-4 text-blue-600" onClick={()=>navigate(-1)}>&larr; Back</button>
      <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
      <div className="grid gap-4">
        <input className="px-3 py-2 border rounded" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <div className="flex gap-2">
          {['sale','free','bounty'].map(t => (
            <button key={t} onClick={()=>setType(t)} className={`px-3 py-2 rounded ${type===t?'bg-blue-600 text-white':'bg-gray-100 text-gray-700'}`}>{t}</button>
          ))}
        </div>
        {type!=='free' && (
          <input className="px-3 py-2 border rounded" placeholder={type==='bounty'? 'Reward $' : 'Price $'} value={price} onChange={e=>setPrice(e.target.value)} />
        )}
        <textarea className="px-3 py-2 border rounded" rows={5} placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <input className="px-3 py-2 border rounded" placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} />
        <input className="px-3 py-2 border rounded" placeholder="Tags (comma separated)" value={tags} onChange={e=>setTags(e.target.value)} />
        <div onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault(); onDrop(e.dataTransfer.files)}} className="p-6 border-2 border-dashed rounded text-center text-gray-600">
          Drag & drop up to 6 images here
          <div className="grid grid-cols-6 gap-2 mt-3">
            {images.map((src,i)=>(<img key={i} alt="preview" src={src} className="h-20 w-full object-cover rounded" />))}
          </div>
        </div>
        <button onClick={submit} className="px-4 py-2 bg-blue-600 text-white rounded">Create Post</button>
      </div>
    </div>
  )
}

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Feed />} />
      <Route path="/new" element={<NewPost />} />
      <Route path="/post/:id" element={<PostDetail />} />
    </Routes>
  )
}

