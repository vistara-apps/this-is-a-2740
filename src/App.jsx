import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AppShell from './components/AppShell'
import Dashboard from './pages/Dashboard'
import Rights from './pages/Rights'
import StateLaws from './pages/StateLaws'
import Recording from './pages/Recording'
import Guides from './pages/Guides'
import { UserProvider } from './context/UserContext'

function App() {
  return (
    <UserProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/rights" element={<Rights />} />
          <Route path="/state-laws" element={<StateLaws />} />
          <Route path="/recording" element={<Recording />} />
          <Route path="/guides" element={<Guides />} />
        </Routes>
      </AppShell>
    </UserProvider>
  )
}

export default App