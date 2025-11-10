declare global {
  interface Window {
    google: typeof google
    initMap?: () => void
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
          geometry?: {
            location: {
              lat(): number
              lng(): number
            }
          }
        }
      }
    }
    namespace event {
      function clearInstanceListeners(instance: any): void
    }
  }
}

export {}

