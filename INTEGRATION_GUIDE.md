# ArvoCap Chatbot Integration Guide

This guide explains how the Python training system has been integrated with the Next.js web application to provide enhanced AI capabilities while preserving all existing design elements.

## 🏗️ Architecture Overview

The integration consists of:

1. **Next.js Frontend** - Existing web app with chatbot UI (unchanged design)
2. **Python Training API** - Vector search and AI training system
3. **API Bridge** - Connects both systems seamlessly
4. **Admin Interface** - Monitor and control the integrated system

## 🔄 How Integration Works

### 1. Enhanced Chat Flow

```
User Query → FAQ Search → Vector Search → OpenAI API → Enhanced Response
                     ↓
              Python Training System
              (if available)
```

### 2. Fallback Strategy

- **Primary**: FAQ database (existing)
- **Enhanced**: Vector database search (new)
- **Fallback**: OpenAI general responses (existing)

If the Python system is unavailable, the chatbot continues working with existing functionality.

## 🚀 Setup Instructions

### Prerequisites

- Node.js (for Next.js app)
- Python 3.8+ (for training system)
- OpenAI API key

### 1. Start Both Systems

**Option A: Automated Startup (Windows)**
```bash
start-system.bat
```

**Option B: Manual Startup**

Terminal 1 - Python API:
```bash
cd python_training
python -m venv env
env\\Scripts\\activate
pip install -r requirements.txt
python api_server.py
```

Terminal 2 - Next.js App:
```bash
npm install
npm run dev
```

### 2. Environment Configuration

The integration uses these environment variables in `.env.local`:

```env
# OpenAI (existing)
OPENAI_API_KEY=your_openai_key

# Python Integration (new)
PYTHON_API_URL=http://localhost:8000

# Google Sheets (existing)
GOOGLE_SPREADSHEET_ID=your_sheet_id
# ... other Google configs
```

## 🔗 API Endpoints

### Next.js API Routes

| Endpoint | Purpose | Method |
|----------|---------|--------|
| `/api/chatbot-knowledge` | Vector search bridge | POST |
| `/api/admin/retrain` | Trigger retraining | POST |
| `/api/chat` | Enhanced chat (existing) | POST |

### Python API Routes

| Endpoint | Purpose | Method |
|----------|---------|--------|
| `/search` | Vector similarity search | POST |
| `/health` | System health check | GET |
| `/retrain` | Retrain knowledge base | POST |
| `/docs` | API documentation | GET |

## 🎯 Key Features

### 1. Seamless Integration

- **Zero visual changes** to chatbot interface
- **Automatic fallback** when Python system unavailable
- **Enhanced responses** when vector data available

### 2. Vector Search Enhancement

```typescript
// Example: Enhanced context building
const enhancedContext = await getEnhancedContext(userQuery, faqAnswer)
// Combines FAQ + Vector search results
```

### 3. Admin Monitoring

Access admin dashboard at `/admin` to:
- Monitor Python system status
- Trigger knowledge base retraining
- View connection health
- Access API documentation

### 4. Smart Fallback

```javascript
// Graceful degradation
if (vectorSearchFails) {
  // Continue with existing FAQ system
  // No user-visible errors
}
```

## 🛠️ Troubleshooting

### Python System Not Starting

1. Check Python virtual environment:
```bash
cd python_training
python --version  # Should be 3.8+
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Check port availability:
```bash
netstat -an | findstr :8000
```

### Vector Search Not Working

1. Check API connection:
```bash
curl http://localhost:8000/health
```

2. Verify environment variable:
```bash
echo $PYTHON_API_URL  # Should be http://localhost:8000
```

3. Check admin dashboard for status

### Knowledge Base Empty

1. Ensure training data exists in `python_training/data/`
2. Trigger retraining via admin interface
3. Check Python logs for errors

## 📊 Monitoring

### Health Checks

- **Frontend**: Automatic health checks every 30 seconds
- **Python API**: `/health` endpoint provides detailed status
- **Admin Dashboard**: Real-time system status

### Logs

- **Next.js**: Browser console + server logs
- **Python**: Terminal output + file logs
- **Integration**: Check browser network tab

## 🔧 Customization

### Adding New Training Data

1. Add data to `python_training/data/`
2. Use admin interface to trigger retraining
3. New knowledge automatically available

### Adjusting Vector Search

Edit `lib/training-bridge.ts`:
```typescript
const vectorResults = await searchKnowledge({
  query,
  maxResults: 5,        // Increase results
  scoreThreshold: 0.5   // Lower threshold
})
```

### Modifying Prompts

Update system prompt in `components/arvocap-chatbot.tsx`:
```typescript
const systemPrompt = `Enhanced with vector context: ${enhancedContext}`
```

## 🚀 Production Deployment

### Environment Setup

- Set `PYTHON_API_URL` to production Python API
- Ensure both services are running
- Configure proper CORS settings

### Scaling Considerations

- Python API can be containerized
- Consider using Redis for caching
- Load balance multiple Python instances

## 📝 Files Modified

### New Files
- `app/api/chatbot-knowledge/route.ts` - Vector search bridge
- `lib/training-bridge.ts` - Integration utilities
- `app/api/admin/retrain/route.ts` - Admin endpoints
- `start-system.bat` / `start-system.sh` - Startup scripts

### Modified Files
- `components/arvocap-chatbot.tsx` - Enhanced with vector search
- `app/admin/page.tsx` - Added training system monitoring
- `python_training/api_server.py` - Added integration endpoints
- `.env.local` - Added Python API configuration

### Unchanged
- All CSS and styling files
- UI component designs
- Existing functionality

## 🎉 Success Indicators

✅ **Chatbot UI**: Identical appearance, enhanced responses  
✅ **Admin Dashboard**: Shows Python system status  
✅ **API Health**: Both systems report healthy  
✅ **Vector Search**: Returns relevant results  
✅ **Fallback**: Works when Python system offline  

The integration is successful when users get better answers without noticing any interface changes!
