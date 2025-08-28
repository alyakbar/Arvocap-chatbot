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

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState<string>('')

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
  }, [])

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            ArvoCap Contact Submissions Admin
          </CardTitle>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary">Google Sheets Integration</Badge>
            <Badge variant="outline">Excel Backup</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📊 Google Sheets (Primary)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Real-time data synced to Google Sheets for easy sharing and collaboration.
                </p>
                <Button 
                  onClick={openGoogleSheets}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Open Google Sheets
                </Button>
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
                <li>Go to <a href="https://console.cloud.google.com/" target="_blank" className="text-blue-600 underline">Google Cloud Console</a></li>
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
