import { google } from 'googleapis'
import { getGoogleCredentials } from './runtime-config'

// Google Sheets configuration
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID
const SHEET_NAME = 'Contact Submissions'

// Create Google Sheets service
export const createGoogleSheetsService = () => {
  try {
    const rc = getGoogleCredentials()
    // Using service account credentials from environment variables
    const credentials = {
      type: 'service_account',
      project_id: rc.GOOGLE_PROJECT_ID || process.env.GOOGLE_PROJECT_ID,
      private_key_id: rc.GOOGLE_PRIVATE_KEY_ID || process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: (rc.GOOGLE_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY)?.replace(/\\n/g, '\n'),
      client_email: rc.GOOGLE_CLIENT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL,
      client_id: rc.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${rc.GOOGLE_CLIENT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL}`
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    })

    return google.sheets({ version: 'v4', auth })
  } catch (error) {
    console.error('Error creating Google Sheets service:', error)
    throw new Error('Failed to initialize Google Sheets service')
  }
}

// Add data to Google Sheets
export const addToGoogleSheet = async (data: {
  name: string
  email: string
  issue: string
  timestamp: string
}) => {
  try {
    const sheets = createGoogleSheetsService()
    const rc = getGoogleCredentials()

    const spreadsheetId = rc.GOOGLE_SPREADSHEET_ID || SPREADSHEET_ID
    if (!spreadsheetId) {
      throw new Error('Google Spreadsheet ID not configured')
    }

    // Directly append data - this is faster than checking if sheet exists first
    // If sheet doesn't exist, this will fail and we'll create it
    try {
      const values = [[data.name, data.email, data.issue, data.timestamp]]

      const response = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${SHEET_NAME}!A:D`,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values,
        },
      })

      return {
        success: true,
        data: response.data,
  spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`
      }
    } catch (appendError: any) {
      // If append fails, it might be because sheet doesn't exist
      // Only then create the sheet and try again
      if (appendError.code === 400 || appendError.message?.includes('Unable to parse range')) {
        console.log('Sheet might not exist, creating it...')
        
        // Create sheet with headers
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: SHEET_NAME,
                  },
                },
              },
            ],
          },
        })

        // Add headers
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${SHEET_NAME}!A1:D1`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [['Name', 'Email', 'Issue', 'Timestamp']],
          },
        })

        // Now try to append the data again
        const values = [[data.name, data.email, data.issue, data.timestamp]]

        const response = await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: `${SHEET_NAME}!A:D`,
          valueInputOption: 'RAW',
          insertDataOption: 'INSERT_ROWS',
          requestBody: {
            values,
          },
        })

        return {
          success: true,
          data: response.data,
          spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`
        }
      } else {
        throw appendError
      }
    }
  } catch (error: any) {
    console.error('Error adding to Google Sheets:', error)
    
    // Provide more specific error messages
    if (error.code === 403) {
      throw new Error(`Permission denied: The service account '${process.env.GOOGLE_CLIENT_EMAIL}' doesn't have access to the spreadsheet. Please share the spreadsheet with this email address and give it Editor permissions.`)
    } else if (error.code === 404) {
      throw new Error(`Spreadsheet not found: The spreadsheet ID '${SPREADSHEET_ID}' doesn't exist or isn't accessible.`)
  } else if (!(getGoogleCredentials().GOOGLE_SPREADSHEET_ID || SPREADSHEET_ID)) {
      throw new Error('Google Spreadsheet ID not configured in environment variables.')
    }
    
    throw error
  }
}

// Get all data from Google Sheets
export const getFromGoogleSheet = async () => {
  try {
    const sheets = createGoogleSheetsService()

  const rc = getGoogleCredentials()
  const spreadsheetId = rc.GOOGLE_SPREADSHEET_ID || SPREADSHEET_ID
  if (!spreadsheetId) {
      throw new Error('Google Spreadsheet ID not configured')
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_NAME}!A:D`,
    })

    const rows = response.data.values || []
    
    // Remove header row and convert to objects
    const [headers, ...dataRows] = rows
    
    const data = dataRows.map(row => ({
      name: row[0] || '',
      email: row[1] || '',
      issue: row[2] || '',
      timestamp: row[3] || ''
    }))

    return {
      success: true,
      data,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`
    }
  } catch (error: any) {
    console.error('Error reading from Google Sheets:', error)
    
    // Provide more specific error messages
    if (error.code === 403) {
      throw new Error(`Permission denied: The service account '${process.env.GOOGLE_CLIENT_EMAIL}' doesn't have access to the spreadsheet. Please share the spreadsheet with this email address and give it Editor permissions.`)
    } else if (error.code === 404) {
      throw new Error(`Spreadsheet not found: The spreadsheet ID '${SPREADSHEET_ID}' doesn't exist or isn't accessible.`)
  } else if (!(getGoogleCredentials().GOOGLE_SPREADSHEET_ID || SPREADSHEET_ID)) {
      throw new Error('Google Spreadsheet ID not configured in environment variables.')
    }
    
    throw error
  }
}
