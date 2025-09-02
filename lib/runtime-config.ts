// In-memory runtime config for server-side credentials (non-persistent)

type GoogleCreds = {
  GOOGLE_SPREADSHEET_ID?: string
  GOOGLE_PROJECT_ID?: string
  GOOGLE_PRIVATE_KEY_ID?: string
  GOOGLE_PRIVATE_KEY?: string
  GOOGLE_CLIENT_EMAIL?: string
  GOOGLE_CLIENT_ID?: string
}

const runtime = {
  google: {} as GoogleCreds,
}

export function setGoogleCredentials(creds: GoogleCreds) {
  runtime.google = { ...runtime.google, ...creds }
}

export function getGoogleCredentials(): GoogleCreds {
  return runtime.google
}
