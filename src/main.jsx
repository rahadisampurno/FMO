import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class SiteErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    window.dispatchEvent(new CustomEvent('fmo:runtime-error', { detail: { message: error.message, componentStack: info.componentStack } }))
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <main className="error-fallback">
        <img src="/logo.png?v=20260827b" alt="FMO Wedding Specialist" width="800" height="564" />
        <p>We are restoring your experience.</p>
        <h1>Halaman ini perlu dimuat kembali.</h1>
        <span>Tidak ada data konsultasi yang dikirim atau disimpan.</span>
        <button type="button" onClick={() => window.location.reload()}>Muat ulang website</button>
      </main>
    )
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SiteErrorBoundary><App /></SiteErrorBoundary>
  </StrictMode>,
)
