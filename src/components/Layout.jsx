// src/components/Layout.jsx
import { Container } from 'react-bootstrap'
import NavigationBar from './NavigationBar'

export default function Layout({ crumbs = [], children }) {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <NavigationBar crumbs={crumbs} />
      <main className="flex-grow-1 py-4">
        <Container fluid="xl">{children}</Container>
      </main>
      <footer className="bg-white border-top mt-auto py-3">
        <Container fluid="xl">
          <p className="text-center text-muted small mb-0">
            MadForum — Campus Forum Prototype for CS571
          </p>
        </Container>
      </footer>
    </div>
  )
}
