// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import { AuthProvider, PostsProvider } from './store'
import BountyFeed from './screens/BountyFeed'
import NewBounty from './screens/NewBounty'
import BountyDetail from './screens/BountyDetail'
import MyBounties from './screens/MyBounties'
import Register from './screens/Register'

export default function App() {
  return (
    <AuthProvider>
      <PostsProvider>
        <Routes>
          {/* Home = BountyFeed，有悬赏 / 二手 / 活动 三个 tab */}
          <Route path="/" element={<BountyFeed />} />

          {/* 悬赏相关 */}
          <Route path="/bounties/new" element={<NewBounty />} />
          <Route path="/bounties/:id" element={<BountyDetail />} />
          <Route path="/bounties/mine" element={<MyBounties />} />

          {/* 注册 */}
          <Route path="/register" element={<Register />} />
        </Routes>
      </PostsProvider>
    </AuthProvider>
  )
}
