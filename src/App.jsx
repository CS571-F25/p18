import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, PostsProvider, ToastProvider } from './store'

import BountyFeed from './screens/BountyFeed'
import NewBounty from './screens/NewBounty'
import BountyDetail from './screens/BountyDetail'
import EditBounty from './screens/EditBounty'
import MyBounties from './screens/MyBounties'
import Register from './screens/Register'
import Login from './screens/Login'
import MapView from './screens/MapView'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <PostsProvider>
          <Routes>
            <Route path="/" element={<BountyFeed />} />
            <Route path="/bounties/new" element={<NewBounty />} />
            <Route path="/bounties/:id" element={<BountyDetail />} />
            <Route path="/bounties/:id/edit" element={<EditBounty />} />
            <Route path="/bounties/mine" element={<MyBounties />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/map" element={<MapView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PostsProvider>
      </ToastProvider>
    </AuthProvider>
  )
}
