'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Upload, FileText, Globe, Trash2, Eye, RefreshCw, Plus, Brain, Database } from 'lucide-react'

interface TrainingProgress {
  status: 'idle' | 'processing' | 'complete' | 'error'
  message: string
  progress?: number
}

interface KnowledgeItem {
  id: string
  type: 'document' | 'website' | 'manual'
  title: string
  content: string
  timestamp: Date
  size: number
  status: 'active' | 'processing' | 'error'
}

interface TrainingStats {
  totalDocuments: number
  totalWebsites: number
  manualEntries: number
  knowledgeBaseSize: number
  lastTrained: Date | null
}

export default function AdminTraining() {
  const [trainingProgress, setTrainingProgress] = useState<TrainingProgress>({
    status: 'idle',
    message: 'Ready to train'
  })
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([])
  const [stats, setStats] = useState<TrainingStats>({
    totalDocuments: 0,
    totalWebsites: 0,
    manualEntries: 0,
    knowledgeBaseSize: 0,
    lastTrained: null
  })
  
  // Document upload states
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Website scraping states
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [scrapingDepth, setScrapingDepth] = useState(2)
  
  // Manual entry states
  const [manualTitle, setManualTitle] = useState('')
  const [manualContent, setManualContent] = useState('')
  
  // OCR processing
  const [ocrEnabled, setOcrEnabled] = useState(true)
  
  // Training configuration
  const [trainingConfig, setTrainingConfig] = useState({
    chunkSize: 1000,
    chunkOverlap: 200,
    temperature: 0.7,
    maxTokens: 2000
  })

  useEffect(() => {
    loadKnowledgeBase()
    loadStats()
  }, [])

  const loadKnowledgeBase = async () => {
    try {
      // Check if API is available before making request
      const response = await fetch('/api/admin/knowledge-base')
      if (response.ok) {
        const data = await response.json()
        setKnowledgeItems(data.items || [])
      } else {
        // Fallback for development - use mock data
        setKnowledgeItems([])
      }
    } catch (error) {
      console.error('Failed to load knowledge base:', error)
      // Fallback to empty array
      setKnowledgeItems([])
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/training-stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        // Fallback stats
        setStats({
          totalDocuments: 0,
          totalWebsites: 0,
          manualEntries: 0,
          knowledgeBaseSize: 0,
          lastTrained: null
        })
      }
    } catch (error) {
      console.error('Failed to load training stats:', error)
      // Fallback stats
      setStats({
        totalDocuments: 0,
        totalWebsites: 0,
        manualEntries: 0,
        knowledgeBaseSize: 0,
        lastTrained: null
      })
    }
  }

  const handleFileUpload = async (files: FileList) => {
    setTrainingProgress({ status: 'processing', message: 'Processing documents...', progress: 0 })
    
    const formData = new FormData()
    Array.from(files).forEach(file => {
      formData.append('documents', file)
    })
    formData.append('ocrEnabled', ocrEnabled.toString())
    formData.append('chunkSize', trainingConfig.chunkSize.toString())
    formData.append('chunkOverlap', trainingConfig.chunkOverlap.toString())

    try {
      const response = await fetch('/api/admin/upload-documents', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        setTrainingProgress({ 
          status: 'complete', 
          message: `Successfully processed ${files.length} document(s)` 
        })
        loadKnowledgeBase()
        loadStats()
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      setTrainingProgress({ 
        status: 'error', 
        message: 'Failed to process documents. Please try again.' 
      })
    }
  }

  const handleWebsiteScraping = async () => {
    if (!websiteUrl.trim()) return

    setTrainingProgress({ 
      status: 'processing', 
      message: 'Scraping website...', 
      progress: 0 
    })

    try {
      const response = await fetch('/api/admin/scrape-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: websiteUrl,
          depth: scrapingDepth,
          chunkSize: trainingConfig.chunkSize,
          chunkOverlap: trainingConfig.chunkOverlap
        })
      })

      if (response.ok) {
        const result = await response.json()
        setTrainingProgress({ 
          status: 'complete', 
          message: `Successfully scraped ${result.pagesProcessed} pages` 
        })
        setWebsiteUrl('')
        loadKnowledgeBase()
        loadStats()
      } else {
        throw new Error('Scraping failed')
      }
    } catch (error) {
      setTrainingProgress({ 
        status: 'error', 
        message: 'Failed to scrape website. Please check the URL and try again.' 
      })
    }
  }

  const handleManualEntry = async () => {
    if (!manualTitle.trim() || !manualContent.trim()) return

    setTrainingProgress({ 
      status: 'processing', 
      message: 'Adding manual entry...' 
    })

    try {
      const response = await fetch('/api/admin/add-manual-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: manualTitle,
          content: manualContent,
          chunkSize: trainingConfig.chunkSize,
          chunkOverlap: trainingConfig.chunkOverlap
        })
      })

      if (response.ok) {
        setTrainingProgress({ 
          status: 'complete', 
          message: 'Manual entry added successfully' 
        })
        setManualTitle('')
        setManualContent('')
        loadKnowledgeBase()
        loadStats()
      } else {
        throw new Error('Failed to add manual entry')
      }
    } catch (error) {
      setTrainingProgress({ 
        status: 'error', 
        message: 'Failed to add manual entry. Please try again.' 
      })
    }
  }

  const handleTrainModel = async () => {
    setTrainingProgress({ 
      status: 'processing', 
      message: 'Training AI model...', 
      progress: 0 
    })

    try {
      const response = await fetch('/api/admin/retrain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          force: true,
          config: trainingConfig
        })
      })

      if (response.ok) {
        const result = await response.json()
        setTrainingProgress({ 
          status: 'complete', 
          message: 'AI model trained successfully!' 
        })
        loadStats()
      } else {
        throw new Error('Training failed')
      }
    } catch (error) {
      setTrainingProgress({ 
        status: 'error', 
        message: 'Failed to train model. Please try again.' 
      })
    }
  }

  const handleDeleteItem = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/knowledge-base/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        loadKnowledgeBase()
        loadStats()
      }
    } catch (error) {
      console.error('Failed to delete item:', error)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'processing': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="h-4 w-4" />
      case 'website': return <Globe className="h-4 w-4" />
      case 'manual': return <Plus className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Training Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Knowledge Base Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.totalDocuments}</div>
              <div className="text-sm text-muted-foreground">Documents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.totalWebsites}</div>
              <div className="text-sm text-muted-foreground">Websites</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.manualEntries}</div>
              <div className="text-sm text-muted-foreground">Manual Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.knowledgeBaseSize}</div>
              <div className="text-sm text-muted-foreground">Total Items</div>
            </div>
          </div>
          {stats.lastTrained && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Last trained: {stats.lastTrained.toLocaleString()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Training Progress */}
      {trainingProgress.status !== 'idle' && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              {trainingProgress.status === 'processing' && (
                <RefreshCw className="h-5 w-5 animate-spin" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{trainingProgress.message}</span>
                  <Badge variant={
                    trainingProgress.status === 'complete' ? 'default' :
                    trainingProgress.status === 'error' ? 'destructive' : 'secondary'
                  }>
                    {trainingProgress.status}
                  </Badge>
                </div>
                {trainingProgress.progress !== undefined && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${trainingProgress.progress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Document Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">
                Drag & drop documents here
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Supports PDF, DOC, DOCX, TXT files
              </p>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
              >
                Browse Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileUpload(e.target.files)
                  }
                }}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ocr-enabled"
                checked={ocrEnabled}
                onChange={(e) => setOcrEnabled(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="ocr-enabled" className="text-sm font-medium">
                Enable OCR for scanned documents
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Website Scraping */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Website Scraping
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Website URL</label>
              <Input
                placeholder="https://example.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Scraping Depth: {scrapingDepth} levels
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={scrapingDepth}
                onChange={(e) => setScrapingDepth(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Shallow</span>
                <span>Deep</span>
              </div>
            </div>
            
            <Button 
              onClick={handleWebsiteScraping}
              disabled={!websiteUrl.trim() || trainingProgress.status === 'processing'}
              className="w-full"
            >
              Scrape Website
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Manual Entry */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Information Manually
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Title</label>
            <Input
              placeholder="Enter a descriptive title"
              value={manualTitle}
              onChange={(e) => setManualTitle(e.target.value)}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Content</label>
            <textarea
              className="w-full min-h-[120px] p-3 border rounded-md resize-none"
              placeholder="Enter the information you want to add to the knowledge base..."
              value={manualContent}
              onChange={(e) => setManualContent(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={handleManualEntry}
            disabled={!manualTitle.trim() || !manualContent.trim() || trainingProgress.status === 'processing'}
            className="w-full"
          >
            Add to Knowledge Base
          </Button>
        </CardContent>
      </Card>

      {/* Training Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Training Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Chunk Size</label>
              <Input
                type="number"
                value={trainingConfig.chunkSize}
                onChange={(e) => setTrainingConfig(prev => ({
                  ...prev,
                  chunkSize: parseInt(e.target.value) || 1000
                }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Chunk Overlap</label>
              <Input
                type="number"
                value={trainingConfig.chunkOverlap}
                onChange={(e) => setTrainingConfig(prev => ({
                  ...prev,
                  chunkOverlap: parseInt(e.target.value) || 200
                }))}
              />
            </div>
          </div>
          
          <Button 
            onClick={handleTrainModel}
            disabled={trainingProgress.status === 'processing'}
            className="w-full"
            size="lg"
          >
            <Brain className="h-5 w-5 mr-2" />
            Train AI Model
          </Button>
        </CardContent>
      </Card>

      {/* Knowledge Base Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Knowledge Base Content
            </span>
            <Button onClick={loadKnowledgeBase} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {knowledgeItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(item.type)}
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.type} • {item.size} characters • {item.timestamp.toLocaleDateString()}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleDeleteItem(item.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {knowledgeItems.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No knowledge base items found. Start by uploading documents or adding content.
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
