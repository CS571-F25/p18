// src/components/NavigationBar.jsx
import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store'

export default function NavigationBar({ crumbs }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  return (
    <>
      <Navbar bg="light" expand="lg" className="shadow-sm">
        <Container fluid="xl">
          <Navbar.Brand
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                navigate('/')
              }
            }}
            aria-label="MadForum Home"
          >
            <div className="h4 mb-0 fw-bold">MadForum</div>
            <small className="text-muted d-block">
              Campus Forum for Rehoming &amp; Bounty Tasks
            </small>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center gap-2">
              <Button
                variant="primary"
                onClick={() => navigate('/bounties/new')}
                aria-label="Create new post"
              >
                New Post
              </Button>
              {user ? (
                <>
                  <div className="text-end d-none d-md-block me-2">
                    <div className="small fw-medium">Hi, {user.username}</div>
                    {user.email && (
                      <div className="small text-muted">{user.email}</div>
                    )}
                  </div>
                  <Button
                    variant="outline-secondary"
                    onClick={() => logout()}
                    aria-label="Sign out"
                  >
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline-primary"
                    onClick={() => navigate('/login')}
                    aria-label="Login"
                  >
                    Login
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate('/register')}
                    aria-label="Register"
                  >
                    Register
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {crumbs && crumbs.length > 0 && (
        <Navbar bg="white" className="border-top">
          <Container fluid="xl">
            <Nav className="flex-row gap-3">
              {crumbs.map((crumb, index) => {
                const { label, path, onClick, active } = crumb
                const handleClick = () => {
                  if (path) navigate(path)
                  if (onClick) onClick()
                }

                if (path || onClick) {
                  return (
                    <Nav.Link
                      key={index}
                      onClick={handleClick}
                      active={active}
                      className={active ? 'fw-semibold' : ''}
                      aria-current={active ? 'page' : undefined}
                    >
                      {label}
                    </Nav.Link>
                  )
                }

                return (
                  <span key={index} className="nav-link text-muted">
                    {label}
                  </span>
                )
              })}
            </Nav>
          </Container>
        </Navbar>
      )}
    </>
  )
}

