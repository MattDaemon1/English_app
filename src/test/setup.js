import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock de fetch global
global.fetch = vi.fn()

// Mock du localStorage
Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
    },
    writable: true,
})

// Reset des mocks avant chaque test
beforeEach(() => {
    vi.clearAllMocks()
})

// Mock de ResizeObserver pour éviter les erreurs dans les tests
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}))

// Mock de IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}))
