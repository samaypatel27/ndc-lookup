"use client"

import { useState, useEffect } from "react"
import { Lock, Eye, EyeOff } from "lucide-react"

export default function PasswordGate({ onAuthenticated, children }) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem("ndc_authenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
      onAuthenticated()
    }
  }, [onAuthenticated])

  const handleSubmit = (e) => {
    e.preventDefault()
    const correctPassword = process.env.NEXT_PUBLIC_APP_PASSWORD || "default123"
    
    if (password === correctPassword) {
      localStorage.setItem("ndc_authenticated", "true")
      setIsAuthenticated(true)
      onAuthenticated()
      setError("")
    } else {
      setError("Incorrect password")
      setPassword("")
    }
  }

  if (isAuthenticated) {
    return children
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 z-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl border-0 p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Required</h2>
          <p className="text-slate-600">Enter the password to access the NDC Lookup tool</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-4 pr-12 py-3 text-lg border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Access App
          </button>
        </form>
      </div>
    </div>
  )
} 