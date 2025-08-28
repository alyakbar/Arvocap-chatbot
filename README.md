# ArvoCap Investment Chatbot

A sophisticated AI-powered chatbot for ArvoCap investment services, built with Next.js and featuring automated contact management through Google Sheets integration.

## 🚀 Features

### Intelligent Chat System
- **AI-Powered Responses**: Utilizes OpenAI's GPT models to provide intelligent responses about investment services
- **FAQ Knowledge Base**: Pre-built responses for common investment questions
- **Contextual Understanding**: Understands investment-related queries and provides relevant information
- **Multi-step Conversations**: Maintains conversation context for better user experience

### Smart Contact Form
- **Automatic Trigger**: Contact form appears when the bot can't answer specific questions
- **3-Step Process**: Streamlined name, email, and issue collection
- **Instant Feedback**: Optimistic UI provides immediate confirmation to users
- **Background Processing**: Data saving happens asynchronously without blocking user interaction

### Data Management
- **Google Sheets Integration**: Automatically saves contact submissions to Google Sheets
- **Excel Backup**: Creates local Excel backups of all submissions
- **Real-time Sync**: Data is synchronized across multiple storage systems
- **Admin Dashboard**: View and manage contact submissions at `/admin`

### Performance Optimizations
- **Instant Form Submission**: Users see immediate feedback without waiting
- **Asynchronous Processing**: Background operations don't block user interactions
- **Optimized API Calls**: Reduced Google Sheets API calls for faster performance
- **Error Handling**: Graceful fallbacks when services are unavailable

## 🛠 Tech Stack

- **Framework**: Next.js 15.2.4
- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **AI Integration**: OpenAI API
- **Database**: Google Sheets API
- **File Processing**: XLSX for Excel file handling
- **Development**: TypeScript, ESLint

## 📁 Project Structure

```
├── app/
│   ├── page.tsx              # Main page
│   ├── layout.tsx            # Root layout
│   ├── admin/                # Admin dashboard
│   └── api/
│       ├── chat/             # AI chat endpoint
│       ├── contact/          # Contact form endpoint
│       └── save-contact/     # Data saving endpoint
├── components/
│   ├── arvocap-chatbot.tsx   # Main chatbot component
│   ├── contact-form.tsx      # Contact form component
│   └── ui/                   # Reusable UI components
├── lib/
│   ├── google-sheets.ts      # Google Sheets integration
│   └── utils.ts              # Utility functions
└── public/
    └── contact-submissions.xlsx  # Excel backup file
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ and pnpm
- Google Cloud Console account
- OpenAI API account

### Environment Variables
Create a `.env.local` file with:

```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Google Sheets Configuration
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_PROJECT_ID=your_project_id
GOOGLE_PRIVATE_KEY_ID=your_private_key_id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----"
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_CLIENT_ID=your_client_id
```

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd arvocap-chatbot
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up Google Sheets** (see `GOOGLE_SHEETS_SETUP.md` for detailed instructions)
   - Create Google Cloud project
   - Enable Google Sheets API
   - Create service account
   - Share spreadsheet with service account email

4. **Run development server**
   ```bash
   pnpm dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

## 🎯 How It Works

### Chat Flow
1. User opens the chatbot interface
2. User types investment-related questions
3. Bot searches FAQ knowledge base for matches
4. If match found: Provides pre-written response
5. If no match: Uses OpenAI API for intelligent response
6. If bot can't help: Automatically shows contact form

### Contact Form Process
1. User fills out 3-step form (name, email, issue)
2. Form shows instant success message (optimistic UI)
3. Data saves to Google Sheets in background
4. Excel backup created asynchronously
5. Admin can view submissions at `/admin`

### Data Storage
- **Primary**: Google Sheets (real-time collaboration)
- **Backup**: Local Excel file (downloadable)
- **Access**: Admin dashboard for easy management

## 📊 Performance Features

- **Sub-second response time** for form submissions
- **Optimistic UI** for immediate user feedback
- **Background processing** for data operations
- **Fallback systems** for reliability
- **Minimal API calls** for efficiency

## 🔐 Security

- Service account authentication for Google Sheets
- Environment variable protection for API keys
- Input validation and sanitization
- Error handling without exposing sensitive data

## 🚀 Deployment

The application is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

## 📈 Admin Features

Access the admin panel at `/admin` to:
- View all contact submissions
- Download Excel exports
- Check Google Sheets integration status
- Monitor system health

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software for ArvoCap investment services.

## 📞 Support

For technical support or questions about the chatbot system, please contact the development team.
