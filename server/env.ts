import assert from 'node:assert'

// This type definition is meant to catch accidental misuse or misspellings of
// environment variables.
interface Env {
  clientId: string
  clientSecret: string
  secretKey: string
  origin: string
}

function assertIsDefined(v: string | undefined): string {
  assert(v)
  return v
}

function parseBoolean(v: string): boolean {
  return !!v.match(/^(yes|on|true|1)$/)
}

// Instantiate the typed environment variables object, making sure that the
// environment variables are indeed defined.
export const env: Env = {
  clientId: assertIsDefined(process.env.CLIENT_ID),
  clientSecret: assertIsDefined(process.env.CLIENT_SECRET),
  secretKey: assertIsDefined(process.env.SECRET_KEY),
  origin: assertIsDefined(process.env.ORIGIN),
}
