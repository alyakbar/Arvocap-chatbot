# Google Sheets Integration Setup Guide

Follow these steps to connect your ArvoCap chatbot to Google Sheets:

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" and then "New Project"
3. Enter project name: `arvocap-chatbot`
4. Click "Create"

## Step 2: Enable Google Sheets API

1. In your project, go to "APIs & Services" > "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

## Step 3: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Enter name: `arvocap-sheets-service`
4. Click "Create and Continue"
5. Skip roles (optional) and click "Continue"
6. Click "Done"

## Step 4: Generate Service Account Key

1. Click on the service account you just created
2. Go to "Keys" tab
3. Click "Add Key" > "Create New Key"
4. Select "JSON" and click "Create"
5. Download the JSON file and keep it safe

## Step 5: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it "ArvoCap Contact Submissions"
4. Copy the spreadsheet ID from the URL (the long string between `/d/` and `/edit`)
   Example: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit`

## Step 6: Share Sheet with Service Account

1. In your Google Sheet, click "Share"
2. Add the service account email (from the JSON file: `client_email`)
3. Give it "Editor" permissions
4. Click "Send"

## Step 7: Update Environment Variables

Edit your `.env.local` file with the values from the JSON file:

```bash
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_from_url
GOOGLE_PROJECT_ID=value_from_json_file
GOOGLE_PRIVATE_KEY_ID=value_from_json_file
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nvalue_from_json_file\n-----END PRIVATE KEY-----"
GOOGLE_CLIENT_EMAIL=value_from_json_file
GOOGLE_CLIENT_ID=value_from_json_file
```

**Important Notes:**
- Keep the quotes around GOOGLE_PRIVATE_KEY
- Replace `\n` in the private key with actual newlines or keep as `\n`
- Never commit the `.env.local` file to version control

## Step 8: Test the Integration

1. Start your development server: `pnpm dev`
2. Open the chatbot and ask a question it can't answer
3. Fill out the contact form
4. Check your Google Sheet - the data should appear automatically!

## Troubleshooting

- **Error 403**: Check that the service account has access to the sheet
- **Error 404**: Verify the spreadsheet ID is correct
- **Auth errors**: Ensure all environment variables are set correctly
- **No data**: Check the console for error messages

## Admin Access

Visit `/admin` to:
- Open the Google Sheet directly
- Download Excel backup files
- View setup status
