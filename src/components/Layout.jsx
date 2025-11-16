// src/components/Layout.jsx
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store'

export default function Layout({ crumbs = [], children }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleAuthClick = () => {
    if (user) {
      logout()
    } else {
      navigate('/register')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => navigate('/')}>
            <h1 className="text-2xl font-bold text-gray-900">MadForum</h1>
            <p className="text-xs text-gray-600">
              Campus Forum for Rehoming &amp; Bounty Tasks
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/bounties/new')}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              New Post
            </button>

            <button
              onClick={handleAuthClick}
              className="px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-700 hover:bg-gray-50"
            >
              {user ? 'Sign out' : 'Register'}
            </button>

            {user && (
              <div className="text-xs text-gray-600 text-right hidden sm:block">
                <div className="font-medium">Hi, {user.name}</div>
                {user.email && <div>{user.email}</div>}
              </div>
            )}
          </div>
        </div>

        {/* 顶部导航 / breadcrumb 行：一排 tabs */}
        <div className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <nav className="text-xs text-gray-500 flex gap-4">
              {crumbs.map((crumb, index) => {
                const { label, path, onClick, active } = crumb
                const handleClick = () => {
                  if (path) navigate(path)
                  if (onClick) onClick()
                }

                const className = [
                  'pb-1',
                  'border-b-2',
                  active
                    ? 'border-blue-600 text-gray-900 font-semibold'
                    : 'border-transparent text-gray-500 hover:text-blue-700 hover:border-blue-300',
                ].join(' ')

                // 有 path / onClick 就做成按钮
                if (path || onClick) {
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={handleClick}
                      className={className}
                    >
                      {label}
                    </button>
                  )
                }

                // 否则就是普通文字
                return (
                  <span key={index} className={className}>
                    {label}
                  </span>
                )
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* 内容 */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-500 text-xs">
            MadForum — Campus Forum Prototype for CS571
          </p>
        </div>
      </footer>
    </div>
  )
}
