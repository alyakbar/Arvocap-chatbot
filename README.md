# Arvocap Intelligent Chatbot System

A comprehensive AI-powered chatbot solution for Arvocap Asset Managers, featuring a modern web interface, trained knowledge base, and administrative dashboard. The system provides investment advice, fund performance data, and client support through multiple interfaces.

## 🌟 Features

### 🤖 AI-Powered Chatbot
- *3. **Backup and Recovery**
   - Regular database backups
   - Export knowledge base
   - Save configuration files
   - Document custom changes

## 🔄 Integration Between Next.js and Python

### Architecture Overview
1. **API Communication**
   - Next.js frontend makes HTTP requests to Python FastAPI
   - WebSocket connection for real-time updates
   - File uploads handled via multipart/form-data

2. **Development Setup**
   ```bash
   # Terminal 1: Start Python API
   cd python_training
   python api_server.py

   # Terminal 2: Start Next.js
   npm run dev
   ```

3. **Production Setup**
   ```bash
   # Build Next.js
   npm run build

   # Start both services
   # Terminal 1:
   cd python_training
   python api_server.py

   # Terminal 2:
   npm start
   ```

### Communication Flow
1. **Chat Messages**
   ```mermaid
   sequenceDiagram
     participant U as User
     participant N as Next.js
     participant P as Python API
     participant V as Vector DB
     
     U->>N: Send message
     N->>P: POST /api/chat
     P->>V: Search context
     V-->>P: Return matches
     P-->>N: Response
     N-->>U: Display response
   ```

2. **File Processing**
   - Frontend uploads files to `/api/chatbot-knowledge`
   - Python processes and chunks documents
   - Embeddings generated and stored
   - Status updates via WebSocket

3. **Error Handling**
   - Frontend retries on connection failures
   - Backend queues long-running tasks
   - Automatic reconnection for WebSocket

### Development Tools
1. **API Testing**
   ```bash
   # Test frontend-backend communication
   curl http://localhost:8000/api/health
   ```

2. **WebSocket Testing**
   ```bash
   # Using wscat
   wscat -c ws://localhost:8000/ws
   ```

3. **Monitoring**
   - Next.js metrics at `/api/metrics`
   - Python API metrics at `/metrics`
   - WebSocket status at `/ws/status`

## 📚 Usage Guidelinesd Knowledge Base**: Custom-trained on Arvocap's investment data and fund performance
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
│   Web Frontend  │    │   Python API     │    │ Vector Databases│
│   (Next.js)     │◄──►│   (FastAPI)      │◄──►│ FAISS/ChromaDB  │
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

## 📁 Project Structure

```
arvocap-chatbot/
├── app/                          # Next.js application directory
│   ├── globals.css              # Global styles
│   ├── layout.tsx              # Root layout component
│   ├── page.tsx               # Homepage
│   ├── admin/                 # Admin panel routes
│   │   └── page.tsx          # Admin dashboard
│   ├── api/                  # API routes
│   │   ├── admin/           # Admin API endpoints
│   │   ├── chat/           # Chat API endpoints
│   │   ├── chatbot-knowledge/ # Knowledge base endpoints
│   │   ├── contact/       # Contact form endpoints
│   │   └── save-contact/  # Contact storage endpoints
│   └── unified-admin/     # Unified admin interface
│
├── components/            # React components
│   ├── admin-training.tsx   # Knowledge base training interface
│   ├── arvocap-chatbot.tsx # Main chatbot component
│   ├── contact-form.tsx    # Contact form component
│   ├── theme-provider.tsx  # Theme provider component
│   └── ui/                # UI components
│       ├── badge.tsx      # Badge component
│       ├── button.tsx     # Button component
│       ├── card.tsx       # Card component
│       ├── input.tsx      # Input component
│       └── scroll-area.tsx # Scrollable area component
│
├── lib/                   # Shared utilities and libraries
│   ├── google-sheets.ts   # Google Sheets integration
│   ├── runtime-config.ts  # Runtime configuration
│   ├── training-bridge.ts # Bridge between Next.js and Python
│   └── utils.ts          # Utility functions
│
├── public/               # Static files
│   ├── images/          # Image assets
│   └── various assets   # Other static files
│
├── python_training/      # Python backend for AI/ML
│   ├── api_server.py     # FastAPI server for chatbot
│   ├── chatbot_trainer.py # Training logic and model management
│   ├── config.py         # Configuration settings
│   ├── vector_database.py # FAISS vector storage system
│   ├── web_scraper.py    # Web scraping functionality
│   ├── text_processor.py # Text processing utilities
│   └── various utilities # Additional Python modules
```

## 🚀 Component Details

### Frontend Components

#### 1. Chatbot Component (`components/arvocap-chatbot.tsx`)
- Real-time chat interface with typing indicators
- Message history management
- Source attribution for responses
- Quick replies and suggestions
- Human handoff capability

#### 2. Admin Training Interface (`components/admin-training.tsx`)
- Document upload with drag-and-drop
- Website scraping interface
- Manual content entry with debounced input
- Training progress monitoring
- Knowledge base statistics

#### 3. Contact Form (`components/contact-form.tsx`)
- Multi-step form interface
- Validation and error handling
- Google Sheets integration
- Automatic email notifications

### Backend Services

#### 1. API Server (`python_training/api_server.py`)
- FastAPI endpoints for chat and admin operations
- Rate limiting and error handling
- Session management
- Logging and monitoring

#### 2. Vector Databases
##### FAISS Database (`python_training/faiss_vector_db.py`)
- High-performance similarity search
- Optimized for large-scale datasets
- Fast nearest neighbor search
- Efficient index management

##### ChromaDB Database (`python_training/vector_database.py`)
- Document chunking and embedding
- Rich metadata management
- Incremental updates
- Persistent storage with versioning

#### 3. Web Scraper (`python_training/web_scraper.py`)
- Configurable depth and breadth
- JavaScript rendering support
- Rate limiting and retry logic
- Content deduplication

## 🛠️ Setup Instructions

### Frontend Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Next.js Frontend Details

#### Component Structure
```
app/
├── page.tsx              # Main chat interface
├── admin/
│   └── page.tsx         # Admin dashboard
└── unified-admin/
    └── page.tsx         # Enhanced admin interface
```

#### Key Features
1. **Real-time Communication**
   ```typescript
   // components/arvocap-chatbot.tsx
   const ChatComponent = () => {
     // Websocket connection for real-time updates
     const socket = useWebSocket('ws://localhost:8000/ws');
     // ... rest of the component
   };
   ```

2. **API Integration**
   ```typescript
   // lib/training-bridge.ts
   export const sendMessage = async (message: string) => {
     const response = await fetch('http://localhost:8000/api/chat', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ message })
     });
     return response.json();
   };
   ```

3. **Environment Configuration**
   ```env
   # .env.local
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_WS_URL=ws://localhost:8000
   ```

#### State Management
- Uses React Context for global state
- Real-time updates via WebSocket
- Local storage for persistence

#### Production Deployment
```bash
# Build optimized production bundle
npm run build

# Start production server
npm start

# Or use PM2 for process management
pm2 start npm --name "arvocap-frontend" -- start
```

### Python Backend Setup
```bash
# Create virtual environment
python -m venv env

# Activate environment
.\env\Scripts\activate  # Windows
source env/bin/activate # Unix/macOS

# Install dependencies
pip install -r python_training/requirements.txt

# Run API server
python python_training/api_server.py
```

## � Starting the System

### 1. Using Start Scripts
Windows users:
```bash
# Double-click start-system.bat
# Or run from command line:
.\start-system.bat
```

Unix/macOS users:
```bash
# Make the script executable
chmod +x start-system.sh
# Run the script
./start-system.sh
```

### 2. Manual Startup
1. Start the Python Backend:
```bash
cd python_training
python api_server.py
```

2. Start the Next.js Frontend:
```bash
# In a new terminal
npm run dev
```

### 3. Verify System Status
1. Backend API should be running at: http://localhost:8000
2. Frontend should be accessible at: http://localhost:3000
3. Admin panel available at: http://localhost:3000/admin

## 💻 Operating the Chatbot

### Initial Setup
1. Access the admin panel at `/admin`
2. Navigate to "Knowledge Base Management"
3. Choose one or more methods to add knowledge:
   - Upload documents
   - Scrape websites
   - Manual entry

### Web Scraping
```bash
# Basic website scraping
python scrape_and_build.py --url "https://your-website.com" --max-pages 1

# Create training file from scraping
python scrape_and_build.py --url "https://your-website.com" --max-pages 1 --create-training-file
```

### Document Processing
1. Upload documents through admin interface
2. System automatically:
   - Extracts text (with OCR for images/scans)
   - Chunks content
   - Generates embeddings
   - Updates vector database

### Knowledge Base Management
1. Monitor in admin panel:
   - Total documents
   - Processing status
   - Vector database health
2. Use rebuild tools if needed:
```bash
python rebuild_vector_db.py  # Rebuilds entire database
python fix_vector_db.py      # Fixes inconsistencies
```

### Chatbot Operation
1. **Basic Usage**
   - Direct users to main chat interface
   - Bot automatically:
     - Processes user queries
     - Searches vector database
     - Generates contextual responses

2. **Advanced Features**
   - Use quick replies for common queries
   - Enable source attribution
   - Implement conversation memory
   - Configure response parameters

3. **Monitoring**
   - View real-time chat logs
   - Monitor API performance
   - Track user interactions
   - Review conversation history

### System Maintenance
1. **Regular Tasks**
   - Check logs in `python_training/logs/`
   - Monitor vector database size
   - Update knowledge base as needed
   - Verify API performance

2. **Troubleshooting**
   - Use debug tools:
   ```bash
   python debug_faiss.py        # Debug vector database
   python test_api_server.py    # Test API endpoints
   python check_manual_entries.py # Verify manual entries
   ```

3. **Backup and Recovery**
   - Regular database backups
   - Export knowledge base
   - Save configuration files
   - Document custom changes

## �📚 Usage Guidelines

### Adding Knowledge
1. **Document Upload**
   - Supported formats: PDF, DOCX, TXT
   - OCR support for scanned documents
   - Automatic chunking and processing

2. **Web Scraping**
   - Enter target URL and depth
   - Configure scraping parameters
   - Monitor scraping progress

3. **Manual Entry**
   - Add structured content
   - Real-time preview
   - Source attribution

### Training the System
1. Configure chunk size and overlap
2. Set temperature and token limits
3. Monitor training progress
4. Validate results

### Using the Chatbot
1. Natural language queries
2. View source references
3. Quick replies for common questions
4. Human support escalation

## ⚙️ Configuration

### Environment Variables
Create a `.env` file with:
```env
OPENAI_API_KEY=your_api_key
GOOGLE_SHEETS_ID=your_sheet_id
PYTHON_API_URL=http://localhost:8000
```

### Training Configuration
Adjust in `python_training/config.py`:
```python
MAX_TEXT_LENGTH = 1000
CHUNK_SIZE = 500
CHUNK_OVERLAP = 100
```

## 🔧 Troubleshooting

### Common Issues
1. **Knowledge Base Not Updating**
   - Check Python backend connection
   - Verify file permissions
   - Check log files

2. **Slow Responses**
   - Optimize vector database
   - Adjust chunk sizes
   - Check network connectivity

3. **Training Errors**
   - Verify input data
   - Check disk space
   - Monitor memory usage

## 📞 Support

For technical support:
- Email: support@arvocap.com
- Documentation: `/docs`
- Log files: `/python_training/logs`

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
