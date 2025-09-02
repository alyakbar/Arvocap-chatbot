# Arvocap Intelligent Chatbot System

A comprehensive AI-powered chatbot solution for Arvocap Asset Managers, featuring a modern web interface, trained knowledge base, and administrative dashboard. The system provides investment advice, fund performance data, and client support through multiple interfaces.

## 🌟 Features

### 🤖 AI-Powered Chatbot
- **Trained Knowledge Base**: Custom-trained on Arvocap's investment data and fund performance
- **Dual AI Integration**: OpenAI GPT models with ChromaDB vector database
- **Intelligent Responses**: Context-aware answers about investment strategies and fund performance
- **Multiple Interfaces**: Web chat, CLI tool, and REST API

### 🎨 Modern Web Interface
- **Next.js Frontend**: Responsive, modern UI with TypeScript
- **Real-time Chat**: Instant messaging with typing indicators and message history
- **Professional Design**: Tailwind CSS with shadcn/ui components
- **Mobile Responsive**: Works seamlessly across desktop and mobile devices

### 🔧 Administrative Dashboard
- **Training Management**: Retrain the chatbot with new data
- **API Key Management**: Configure OpenAI and other service credentials
- **Knowledge Base Stats**: Monitor vector database size and performance
- **Google Sheets Integration**: Import/export contact submissions

### 📊 Data Management
- **Vector Database**: ChromaDB for semantic search and document retrieval
- **Web Scraping**: Automated data collection from investment sources
- **Text Processing**: Advanced NLP for document processing and embedding
- **Contact Management**: Integrated contact form with Google Sheets export

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Web Frontend  │    │   Python API     │    │  Vector Database│
│   (Next.js)     │◄──►│   (FastAPI)      │◄──►│   (ChromaDB)    │
│                 │    │                  │    │                 │
│  ┌─────────────┐│    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│  │  Chat UI    ││    │ │ ChatBot      │ │    │ │ Embeddings  │ │
│  │  Admin UI   ││    │ │ Interface    │ │    │ │ & Search    │ │
│  │  Contact    ││    │ │ Knowledge    │ │    │ │             │ │
│  │  Form       ││    │ │ Base         │ │    │ │             │ │
│  └─────────────┘│    │ └──────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌──────────────────┐            │
         └─────────────►│   OpenAI API     │◄───────────┘
                        │   (GPT Models)   │
                        └──────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ with pnpm/npm
- **Python** 3.9+
- **OpenAI API Key**
- **Git**

### 1. Clone Repository
```bash
git clone <repository-url>
cd arvocap-chatbot
```

### 2. Setup Frontend
```bash
# Install dependencies
pnpm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys
```

### 3. Setup Python Backend
```bash
cd python_training

# Create virtual environment
python -m venv env

# Activate virtual environment
# Windows:
.\env\Scripts\activate
# macOS/Linux:
source env/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create `.env.local` in the root directory:
```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Python API Configuration
PYTHON_API_URL=http://localhost:8000
NEXT_PUBLIC_PYTHON_API_URL=http://localhost:8000

# Google Sheets Integration (Optional)
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_PROJECT_ID=your_project_id
GOOGLE_PRIVATE_KEY_ID=your_key_id
GOOGLE_PRIVATE_KEY="your_private_key"
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_CLIENT_ID=your_client_id
```

### 5. Initialize Knowledge Base
```bash
cd python_training

# Process and load training data
python main.py

# Test the CLI interface
python chat_cli.py
```

### 6. Start Services

**Terminal 1 - Python API Server:**
```bash
cd python_training
.\env\Scripts\activate  # Windows
python api_server.py
```

**Terminal 2 - Next.js Frontend:**
```bash
pnpm dev
```

### 7. Access the Application
- **Web Interface**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **API Documentation**: http://localhost:8000/docs

## 📁 Project Structure

```
arvocap-chatbot/
├── 📁 app/                          # Next.js app directory
│   ├── 📁 admin/                    # Admin dashboard pages
│   ├── 📁 api/                      # API routes (Next.js)
│   │   ├── 📁 chat/                 # Chat API endpoints
│   │   ├── 📁 chatbot-knowledge/    # Knowledge base search
│   │   └── 📁 contact/              # Contact form handling
│   ├── globals.css                  # Global styles
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Homepage
├── 📁 components/                   # React components
│   ├── arvocap-chatbot.tsx          # Main chat interface
│   ├── contact-form.tsx             # Contact form component
│   └── 📁 ui/                       # UI component library
├── 📁 lib/                          # Utility libraries
│   ├── google-sheets.ts             # Google Sheets integration
│   ├── training-bridge.ts           # Python-NextJS bridge
│   └── utils.ts                     # Helper utilities
├── 📁 python_training/              # Python backend
│   ├── 📁 data/                     # Training and processed data
│   ├── 📁 env/                      # Python virtual environment
│   ├── 📁 logs/                     # Application logs
│   ├── 📁 models/                   # Trained AI models
│   ├── 📁 vector_db/                # ChromaDB database files
│   ├── api_server.py                # FastAPI server
│   ├── chatbot_trainer.py           # AI training logic
│   ├── chat_cli.py                  # Command-line interface
│   ├── config.py                    # Configuration settings
│   ├── main.py                      # Main training script
│   ├── text_processor.py            # Text processing utilities
│   ├── vector_database.py           # Vector database management
│   ├── web_scraper.py               # Data collection tools
│   └── requirements.txt             # Python dependencies
├── 📁 public/                       # Static assets
├── 📁 styles/                       # Additional stylesheets
├── .env.local                       # Environment configuration
├── package.json                     # Node.js dependencies
└── README.md                        # This file
```

## 🔧 Configuration

### OpenAI API Setup
1. Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add to `.env.local`: `OPENAI_API_KEY=sk-...`
3. Configure in admin dashboard or directly in environment

### Google Sheets Integration
1. Create Google Cloud Project
2. Enable Google Sheets API
3. Create Service Account
4. Download credentials JSON
5. Extract values to environment variables
6. Share spreadsheet with service account email

### Vector Database Configuration
The system uses ChromaDB for semantic search:
- **Embedding Model**: `sentence-transformers/all-MiniLM-L6-v2`
- **Storage**: Local persistent storage
- **Collection**: Configurable name and metadata

### Training Data Setup
1. Place training documents in `python_training/data/`
2. Supported formats: JSON, JSONL, TXT, PDF
3. Run `python main.py` to process and vectorize
4. Monitor progress in logs and admin dashboard

## 🖥️ Usage

### Web Interface
1. Navigate to http://localhost:3000
2. Use the chat interface to ask questions
3. Get responses from trained knowledge base
4. Submit contact information via contact form

### CLI Interface
```bash
cd python_training
python chat_cli.py

# Options:
python chat_cli.py --openai      # Use OpenAI (default)
python chat_cli.py --local       # Use local model
```

### Admin Dashboard
1. Access at http://localhost:3000/admin
2. **Set API Keys**: Configure OpenAI credentials
3. **Retrain Model**: Process new training data
4. **View Stats**: Monitor knowledge base size
5. **Manage Data**: Import/export functionality

### API Endpoints

**Python FastAPI (Port 8000):**
```http
POST /chat                    # Chat with trained bot
POST /search                  # Vector similarity search
GET  /health                  # Health check
POST /admin/set_api_key      # Set API credentials
POST /retrain                # Retrain knowledge base
GET  /knowledge/stats        # Knowledge base statistics
```

**Next.js API Routes (Port 3000):**
```http
POST /api/chat               # Chat endpoint (fallback)
POST /api/chatbot-knowledge  # Knowledge search
POST /api/contact            # Contact form submission
POST /api/save-contact       # Save contact to sheets
```

## 🧠 AI Training

### Data Sources
- **Investment Reports**: Fund performance and analysis
- **Company Documentation**: Services and policies
- **Market Research**: Investment strategies and insights
- **Client FAQs**: Common questions and responses

### Training Process
1. **Data Collection**: Web scraping and manual input
2. **Text Processing**: Cleaning, tokenization, and chunking
3. **Embedding Generation**: Convert text to vectors
4. **Vector Storage**: Store in ChromaDB for retrieval
5. **Model Training**: Fine-tune responses with context

### Retraining
```bash
# Add new data to python_training/data/
python main.py

# Or use admin dashboard:
# 1. Upload new files
# 2. Click "Retrain Model"
# 3. Monitor progress
```

## 🔄 API Integration

### ChatBot Interface
```python
from chatbot_trainer import ChatbotInterface

# Initialize
bot = ChatbotInterface(use_openai=True)

# Generate response
response = bot.generate_response("What are your investment options?")
```

### Vector Search
```python
from vector_database import ChatbotKnowledgeBase

# Initialize
kb = ChatbotKnowledgeBase()

# Search similar content
results = kb.search_similar_content("fund performance", max_results=5)
```

### Web Integration
```javascript
// Frontend chat integration
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userMessage,
    conversation_id: sessionId
  })
});

const data = await response.json();
console.log(data.message);
```

## 🚀 Deployment

### Production Setup

**Frontend (Vercel/Netlify):**
```bash
# Build for production
pnpm build

# Deploy to Vercel
vercel deploy

# Set environment variables in dashboard
```

**Backend (Railway/Heroku/VPS):**
```bash
# Create requirements.txt
pip freeze > requirements.txt

# Create Procfile
echo "web: uvicorn api_server:app --host=0.0.0.0 --port=\$PORT" > Procfile

# Deploy to platform
```

### Environment Variables (Production)
```env
# Required
OPENAI_API_KEY=
PYTHON_API_URL=https://your-api-domain.com
NEXT_PUBLIC_PYTHON_API_URL=https://your-api-domain.com

# Optional
GOOGLE_SPREADSHEET_ID=
GOOGLE_PRIVATE_KEY=
# ... other Google Sheets vars
```

### Database Migration
```bash
# Backup local vector database
tar -czf vector_db_backup.tar.gz python_training/vector_db/

# Transfer to production server
scp vector_db_backup.tar.gz user@server:/path/to/app/

# Extract on production
tar -xzf vector_db_backup.tar.gz
```

## 🛠️ Development

### Code Style
- **Frontend**: TypeScript, ESLint, Prettier
- **Backend**: Python Black, isort, pylint
- **Commits**: Conventional commit messages

### Testing
```bash
# Frontend tests
pnpm test

# Backend tests
cd python_training
python -m pytest test_*.py

# API tests
python test_api_server.py
```

### Development Workflow
1. Create feature branch
2. Implement changes
3. Test locally (web + CLI)
4. Run test suite
5. Create pull request
6. Deploy to staging
7. Merge to main

### Adding New Features

**Frontend Component:**
```typescript
// components/new-feature.tsx
import { useState } from 'react';

export function NewFeature() {
  // Component logic
}
```

**API Endpoint:**
```python
# python_training/api_server.py
@app.post("/new-endpoint")
async def new_feature(request: NewRequest):
    # Endpoint logic
    return {"result": "success"}
```

**Training Data:**
```python
# python_training/custom_processor.py
def process_new_data_type(file_path: str):
    # Custom processing logic
    return processed_data
```

## 🐛 Troubleshooting

### Common Issues

**1. "Knowledge base is empty" Error**
```bash
# Solution: Retrain the model
cd python_training
python main.py
```

**2. OpenAI API Errors**
```bash
# Check API key validity
curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models

# Verify environment variables
echo $OPENAI_API_KEY
```

**3. Vector Database Issues**
```bash
# Reset vector database
rm -rf python_training/vector_db/
python main.py  # Recreate from scratch
```

**4. CORS Errors**
- Check API server CORS configuration
- Verify frontend URL in allowed origins
- Ensure proper headers in requests

**5. Performance Issues**
- Reduce vector search results count
- Optimize embedding model
- Implement caching for frequent queries

### Debug Mode
```bash
# Enable debug logging
export LOG_LEVEL=DEBUG

# Frontend debug
export NODE_ENV=development
export NEXT_PUBLIC_DEBUG=true

# Python debug
python -u api_server.py
```

## 📊 Monitoring

### Key Metrics
- **Response Time**: API endpoint latency
- **Knowledge Base Size**: Number of embedded documents
- **User Engagement**: Chat session duration and frequency
- **Error Rates**: API failures and timeouts

### Logging
```bash
# View API server logs
tail -f python_training/logs/api_server.log

# Frontend logs (browser console)
# Network tab for API calls
# Application tab for local storage
```

### Health Checks
```bash
# API health
curl http://localhost:8000/health

# Frontend health
curl http://localhost:3000/api/health
```

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork** the repository
2. **Create** a feature branch
3. **Commit** changes with clear messages
4. **Test** thoroughly
5. **Submit** a pull request

### Development Setup
```bash
git clone <your-fork>
cd arvocap-chatbot
git remote add upstream <original-repo>

# Setup development environment
pnpm install
cd python_training && pip install -r requirements.txt

# Create feature branch
git checkout -b feature/your-feature-name
```

## 📄 License

This project is proprietary software for Arvocap Asset Managers. All rights reserved.

## 🆘 Support

For technical support or questions:

- **Email**: tech-support@arvocap.com
- **Documentation**: Check inline code comments
- **Issues**: Create GitHub issue with detailed description
- **Emergency**: Contact system administrator

## 🔄 Changelog

### v1.0.0 (Current)
- ✅ Complete web interface with chat functionality
- ✅ Python API server with FastAPI
- ✅ Vector database integration with ChromaDB
- ✅ Admin dashboard for management
- ✅ Google Sheets integration
- ✅ CLI interface for testing
- ✅ Comprehensive training pipeline

### Planned Features
- [ ] Multi-language support
- [ ] Voice chat interface
- [ ] Advanced analytics dashboard
- [ ] Real-time collaboration features
- [ ] Mobile app (React Native)
- [ ] Integration with CRM systems

---

**Built with ❤️ for Arvocap Asset Managers**

*Last Updated: September 2, 2025*
