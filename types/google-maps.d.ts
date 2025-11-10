declare global {
  interface Window {
    google: typeof google
  }
}

declare namespace google {
  namespace maps {
    namespace places {
      class Autocomplete {
        constructor(
          input: HTMLInputElement,
          options?: {
            types?: string[]
            componentRestrictions?: { country: string | string[] }
            fields?: string[]
          }
        )
        addListener(event: string, handler: () => void): void
        getPlace(): {
          address_components?: Array<{
            long_name: string
            short_name: string
            types: string[]
          }>
          formatted_address?: string
        }
      }
    }
  }
}

export {}

