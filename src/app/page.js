"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Search, Loader2, MapPin, Pill, AlertCircle, CheckCircle } from "lucide-react"
import PasswordGate from "@/components/PasswordGate"

export default function Home() {
  const [ndc, setNdc] = useState("")
  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [matchedNdc, setMatchedNdc] = useState("")
  const [relevantNdcs, setRelevantNdcs] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleAuthenticated = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("ndc_authenticated")
    setIsAuthenticated(false)
  }

  const lookupNDC = async () => {
    setError("")
    setAddress("")
    setRelevantNdcs([])
    if (!ndc) {
      setError("Please enter an NDC number.")
      return
    }

    setLoading(true)

    const normalizedInput = ndc.replace(/-/g, "").trim()

    // Query by ndc_digits only
    const { data, error } = await supabase
      .from("ndc_data")
      .select('"NDC", "ADDRESS", "nda"')
      .eq('ndc_digits', normalizedInput)

    console.log("Supabase data:", data)
    console.log("Supabase error:", error)

    if (error) {
      console.error(error)
      setError("Error fetching data.")
    } else if (data.length === 0) {
      setError("No match found.")
    } else {
      // ✅ use the same casing returned by Supabase:
      setAddress(data[0].ADDRESS)
      setMatchedNdc(data[0].NDC)

      // Fetch relevant NDCs with the same NDA value
      if (data[0].nda) {
        const { data: relevantData, error: relevantError } = await supabase
          .from("ndc_data")
          .select('"NDC"')
          .eq('nda', data[0].nda)
          .neq('ndc_digits', normalizedInput)

        if (!relevantError && relevantData) {
          setRelevantNdcs(relevantData.map(item => item.NDC))
        }
      }
    }

    setLoading(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      lookupNDC()
    }
  }

  return (
    <PasswordGate onAuthenticated={handleAuthenticated}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-10">
                  <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Pill className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">The Drug Transparency Project</h1>
                <p className="text-sm text-slate-600">Lookup pharmaceutical manufacturer information by NDC number</p>
              </div>
            </div>
            {/*<button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors duration-200"
            >
              Logout
            </button>*/}
          </div>
        </div>
        </div>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="space-y-8">
            {/* Search Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border-0 p-8">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">NDC Lookup</h2>
                <p className="text-lg text-slate-600">
                  Enter a National Drug Code (NDC) number to find manufacturer address information
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Enter NDC number (e.g., 12345-678-90)"
                    value={ndc}
                    onChange={(e) => setNdc(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-10 pr-4 py-3 text-lg border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  />
                </div>
                <button
                  onClick={lookupNDC}
                  disabled={loading || !ndc.trim()}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Search
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results Section */}
            {(error || address) && (
              <div className="space-y-4">
                {error && (
                  <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-red-800 font-medium">{error}</span>
                    </div>
                  </div>
                )}

                {address && (
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border-0 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h3 className="text-xl font-bold text-slate-900">Match Found</h3>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border">
                      <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            NDC: {matchedNdc}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-1">Manufacturer Address:</p>
                          <p className="text-lg text-slate-900 leading-relaxed">{address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Relevant NDCs Section */}
                {relevantNdcs.length > 0 && (
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border-0 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Pill className="h-5 w-5 text-blue-600" />
                      <h3 className="text-xl font-bold text-slate-900">Relevant NDCs</h3>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg border">
                      <p className="text-sm font-medium text-slate-700 mb-3">
                        Other NDCs with the same NDA value:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {relevantNdcs.map((relevantNdc, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                          >
                            {relevantNdc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Info Section */}
            <div className="bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl p-6">
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-slate-900">About NDC Numbers</h3>
                <p className="text-sm text-slate-600 max-w-2xl mx-auto">
                  The National Drug Code (NDC) is a unique identifier assigned to each drug product by the FDA. Use this
                  tool to find manufacturer address information for transparency in pharmaceutical sourcing.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PasswordGate>
  )
}
