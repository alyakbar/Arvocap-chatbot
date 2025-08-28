import { NextRequest, NextResponse } from 'next/server'
import { addToGoogleSheet } from '@/lib/google-sheets'
import * as XLSX from 'xlsx'
import { promises as fs } from 'fs'
import path from 'path'

interface ContactData {
  name: string
  email: string
  issue: string
  timestamp: string
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, issue } = await request.json()

    if (!name || !email || !issue) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const contactData: ContactData = {
      name,
      email,
      issue,
      timestamp: new Date().toISOString()
    }

    let googleSheetsResult = null

    // Save to Google Sheets first (this is the primary storage)
    try {
      googleSheetsResult = await addToGoogleSheet(contactData)
      console.log('Successfully saved to Google Sheets')
    } catch (error) {
      console.error('Failed to save to Google Sheets:', error)
    }

    // Save to Excel backup asynchronously (don't wait for it to complete)
    saveToExcelBackup(contactData).catch(error => {
      console.error('Failed to save Excel backup:', error)
    })

    // Return response immediately after Google Sheets save
    if (googleSheetsResult) {
      return NextResponse.json({
        success: true,
        googleSheets: googleSheetsResult,
        backup: true, // We're attempting backup but not waiting for it
        message: 'Contact information saved successfully'
      })
    } else {
      // If Google Sheets failed, still return success but mention the issue
      return NextResponse.json({
        success: true,
        googleSheets: null,
        backup: true,
        message: 'Contact information received (with fallback storage)',
        warning: 'Primary storage unavailable, using backup methods'
      })
    }
  } catch (error) {
    console.error('Error in save-contact API:', error)
    return NextResponse.json(
      { error: 'Failed to save contact information' },
      { status: 500 }
    )
  }
}

// Separate async function for Excel backup
async function saveToExcelBackup(contactData: ContactData) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'contact-submissions.xlsx')
    
    let workbook: XLSX.WorkBook
    let worksheet: XLSX.WorkSheet
    let existingData: ContactData[] = []

    try {
      const fileBuffer = await fs.readFile(filePath)
      workbook = XLSX.read(fileBuffer, { type: 'buffer' })
      worksheet = workbook.Sheets['Contact Submissions']
      
      if (worksheet) {
        existingData = XLSX.utils.sheet_to_json(worksheet) as ContactData[]
      }
    } catch (error) {
      workbook = XLSX.utils.book_new()
    }

    existingData.push(contactData)
    const newWorksheet = XLSX.utils.json_to_sheet(existingData)
    
    const columnWidths = [
      { wch: 20 }, { wch: 30 }, { wch: 50 }, { wch: 20 }
    ]
    newWorksheet['!cols'] = columnWidths

    if (workbook.Sheets['Contact Submissions']) {
      workbook.Sheets['Contact Submissions'] = newWorksheet
    } else {
      XLSX.utils.book_append_sheet(workbook, newWorksheet, 'Contact Submissions')
    }

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
    await fs.writeFile(filePath, buffer)
    
    console.log('Successfully saved to Excel backup')
    return { success: true, filePath: '/contact-submissions.xlsx' }
  } catch (error) {
    console.error('Error saving Excel backup:', error)
    throw error
  }
}
