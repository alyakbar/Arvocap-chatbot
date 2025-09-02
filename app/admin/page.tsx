'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ContactSubmission {
  name: string
  email: string
  issue: string
  timestamp: string
}

interface TrainingSystemStatus {
  healthy: boolean
  error?: string
  knowledgeBaseSize?: number
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState<string>('')
  const [trainingStatus, setTrainingStatus] = useState<TrainingSystemStatus>({ healthy: false })
  const [retraining, setRetraining] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [savingKey, setSavingKey] = useState(false)
  const [googleForm, setGoogleForm] = useState({
    GOOGLE_SPREADSHEET_ID: '',
    GOOGLE_PROJECT_ID: '',
    GOOGLE_PRIVATE_KEY_ID: '',
    GOOGLE_PRIVATE_KEY: '',
    GOOGLE_CLIENT_EMAIL: '',
    GOOGLE_CLIENT_ID: ''
  })
  const [savingGoogle, setSavingGoogle] = useState(false)

  const checkTrainingSystemStatus = async () => {
    try {
      const response = await fetch('/api/admin/retrain')
      if (response.ok) {
        const data = await response.json()
        setTrainingStatus(data.pythonSystem)
      } else {
        setTrainingStatus({ healthy: false, error: 'API request failed' })
      }
    } catch (error) {
      setTrainingStatus({ healthy: false, error: 'Connection failed' })
    }
  }

  const triggerRetraining = async () => {
    try {
      setRetraining(true)
      const response = await fetch('/api/admin/retrain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
  body: JSON.stringify({ force: true })
      })

      const data = await response.json()
      
      if (data.success) {
        alert(`Retraining initiated successfully! Job ID: ${data.jobId}`)
      } else {
        alert(`Retraining failed: ${data.error}`)
      }
    } catch (error) {
      alert('Failed to trigger retraining')
    } finally {
      setRetraining(false)
    }
  }

  const saveApiKey = async () => {
    try {
      setSavingKey(true)
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'openai', apiKey })
      })
      const data = await res.json()
      if (!data.success) {
        alert(`Failed to save API key: ${data.error || 'Unknown error'}`)
      } else {
        alert('API key saved in Python service for this session')
      }
    } catch (e) {
      alert('Error saving API key')
    } finally {
      setSavingKey(false)
    }
  }

  const saveGoogleCreds = async () => {
    try {
      setSavingGoogle(true)
      const res = await fetch('/api/admin/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleForm)
      })
      const data = await res.json()
      if (!data.success) {
        alert(`Failed to save Google credentials: ${data.error || 'Unknown error'}`)
      } else {
        alert('Google credentials saved for this server session')
      }
    } catch (e) {
      alert('Error saving Google credentials')
    } finally {
      setSavingGoogle(false)
    }
  }

  const openGoogleSheets = () => {
    if (googleSheetsUrl) {
      window.open(googleSheetsUrl, '_blank')
    } else {
      alert('Google Sheets URL not available. Please check your configuration.')
    }
  }

  const downloadExcelBackup = () => {
    const link = document.createElement('a')
    link.href = '/contact-submissions.xlsx'
    link.download = 'arvocap-contact-submissions.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const loadSubmissions = async () => {
    try {
      setLoading(true)
      // For demo purposes, we'll show some placeholder data
      setSubmissions([])
      // In a real implementation, you could fetch from Google Sheets API
    } catch (error) {
      console.error('Error loading submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSubmissions()
    checkTrainingSystemStatus()
    
    // Check training system status every 30 seconds
    const interval = setInterval(checkTrainingSystemStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            ArvoCap Admin Dashboard
          </CardTitle>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary">Google Sheets Integration</Badge>
            <Badge variant="outline">AI Training System</Badge>
            <Badge variant="outline">Excel Backup</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Training System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🤖 AI Training System</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${trainingStatus.healthy ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="font-medium">
                    {trainingStatus.healthy ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                <Button
                  onClick={checkTrainingSystemStatus}
                  variant="outline"
                  size="sm"
                >
                  Refresh Status
                </Button>
              </div>
              {typeof trainingStatus.knowledgeBaseSize === 'number' && (
                <p className="text-sm text-muted-foreground mb-2">Knowledge Base Items: {trainingStatus.knowledgeBaseSize}</p>
              )}
              {trainingStatus.error && (
                <p className="text-sm text-red-600 mb-4">
                  Error: {trainingStatus.error}
                </p>
              )}
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Button
                  onClick={triggerRetraining}
                  disabled={!trainingStatus.healthy || retraining}
                  className="w-full"
                >
                  {retraining ? 'Retraining...' : 'Retrain Knowledge Base'}
                </Button>
                <Button
                  onClick={() => window.open('http://localhost:8000/docs', '_blank')}
                  variant="outline"
                  className="w-full"
                >
                  View API Docs
                </Button>
              </div>

              <div className="mt-2">
                <label className="block text-sm font-medium mb-2">OpenAI API Key</label>
                <input
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
                <div className="flex justify-end mt-2">
                  <Button onClick={saveApiKey} disabled={!apiKey || savingKey} size="sm">
                    {savingKey ? 'Saving...' : 'Save API Key'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">This stores the key in memory on the Python service for the current session.</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📊 Google Sheets (Primary)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Enter your Google service account credentials. These are stored in memory on the server for the current session.</p>
                <div className="space-y-2">
                  <input className="w-full border rounded px-3 py-2 text-sm" placeholder="GOOGLE_SPREADSHEET_ID" value={googleForm.GOOGLE_SPREADSHEET_ID} onChange={e=>setGoogleForm({...googleForm, GOOGLE_SPREADSHEET_ID: e.target.value})} />
                  <input className="w-full border rounded px-3 py-2 text-sm" placeholder="GOOGLE_PROJECT_ID" value={googleForm.GOOGLE_PROJECT_ID} onChange={e=>setGoogleForm({...googleForm, GOOGLE_PROJECT_ID: e.target.value})} />
                  <input className="w-full border rounded px-3 py-2 text-sm" placeholder="GOOGLE_PRIVATE_KEY_ID" value={googleForm.GOOGLE_PRIVATE_KEY_ID} onChange={e=>setGoogleForm({...googleForm, GOOGLE_PRIVATE_KEY_ID: e.target.value})} />
                  <textarea className="w-full border rounded px-3 py-2 text-sm" placeholder="GOOGLE_PRIVATE_KEY (paste full key)" value={googleForm.GOOGLE_PRIVATE_KEY} onChange={e=>setGoogleForm({...googleForm, GOOGLE_PRIVATE_KEY: e.target.value})} />
                  <input className="w-full border rounded px-3 py-2 text-sm" placeholder="GOOGLE_CLIENT_EMAIL" value={googleForm.GOOGLE_CLIENT_EMAIL} onChange={e=>setGoogleForm({...googleForm, GOOGLE_CLIENT_EMAIL: e.target.value})} />
                  <input className="w-full border rounded px-3 py-2 text-sm" placeholder="GOOGLE_CLIENT_ID" value={googleForm.GOOGLE_CLIENT_ID} onChange={e=>setGoogleForm({...googleForm, GOOGLE_CLIENT_ID: e.target.value})} />
                  <div className="flex gap-2">
                    <Button onClick={saveGoogleCreds} disabled={savingGoogle} className="w-full">{savingGoogle ? 'Saving...' : 'Save Google Credentials'}</Button>
                    <Button onClick={openGoogleSheets} variant="outline" className="w-full">Open Google Sheet</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💾 Excel Backup</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Local Excel backup file available for download.
                </p>
                <Button 
                  onClick={downloadExcelBackup}
                  variant="outline"
                  className="w-full"
                >
                  Download Excel File
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">Setup Instructions:</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>To connect Google Sheets:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google Cloud Console</a></li>
                <li>Create a new project or select existing one</li>
                <li>Enable the Google Sheets API</li>
                <li>Create a Service Account and download the JSON key file</li>
                <li>Create a new Google Sheet and share it with the service account email</li>
                <li>Copy the spreadsheet ID from the URL and update your .env.local file</li>
              </ol>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">Environment Variables Needed:</h3>
            <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono">
              <div>GOOGLE_SPREADSHEET_ID=your_spreadsheet_id</div>
              <div>GOOGLE_PROJECT_ID=your_project_id</div>
              <div>GOOGLE_PRIVATE_KEY_ID=your_private_key_id</div>
              <div>GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n..."</div>
              <div>GOOGLE_CLIENT_EMAIL=your_service_account_email</div>
              <div>GOOGLE_CLIENT_ID=your_client_id</div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">How it works:</h3>
            <ol className="text-sm text-muted-foreground space-y-2">
              <li>1. <strong>Primary:</strong> Data is saved to Google Sheets in real-time when forms are submitted</li>
              <li>2. <strong>Backup:</strong> Data is also saved to a local Excel file as backup</li>
              <li>3. <strong>Columns:</strong> Name, Email, Issue, Timestamp</li>
              <li>4. <strong>Access:</strong> Share the Google Sheet with team members for collaboration</li>
              <li>5. <strong>Reliability:</strong> If Google Sheets fails, Excel backup ensures no data loss</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
