import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useWords } from '../../hooks/useWords.js'

// Mock du service API
vi.mock('../../services/ApiWordService.js', () => ({
    getApiService: () => ({
        getAllWords: vi.fn(),
        getTotalWordsCount: vi.fn(),
        updateUserProgress: vi.fn()
    })
}))

describe('useWords', () => {
    let mockService

    beforeEach(async () => {
        const { getApiService } = await import('../../services/ApiWordService.js')
        mockService = getApiService()
        vi.clearAllMocks()
    })

    describe('initialisation', () => {
        it('devrait initialiser avec les valeurs par défaut', () => {
            const { result } = renderHook(() => useWords('all', 'flashcard'))

            expect(result.current.words).toEqual([])
            expect(result.current.currentWordIndex).toBe(0)
            expect(result.current.loading).toBe(true)
            expect(result.current.totalWords).toBe(0)
            expect(result.current.showAnswer).toBe(true)
            expect(result.current.currentWord).toBeUndefined()
        })

        it('ne devrait pas charger les mots si le mode n\'est pas flashcard', () => {
            renderHook(() => useWords('all', 'quiz'))

            expect(mockService.getAllWords).not.toHaveBeenCalled()
        })
    })

    describe('chargement des mots', () => {
        it('devrait charger les mots avec succès', async () => {
            const mockWords = [
                { id: 1, word: 'hello', translation: 'bonjour' },
                { id: 2, word: 'world', translation: 'monde' }
            ]

            mockService.getAllWords.mockResolvedValueOnce(mockWords)
            mockService.getTotalWordsCount.mockResolvedValueOnce(100)

            const { result } = renderHook(() => useWords('all', 'flashcard'))

            // Attendre que le chargement se termine
            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 0))
            })

            expect(result.current.words).toEqual(mockWords)
            expect(result.current.totalWords).toBe(100)
            expect(result.current.loading).toBe(false)
            expect(result.current.currentWord).toEqual(mockWords[0])
        })

        it('devrait gérer les erreurs de chargement', async () => {
            mockService.getAllWords.mockRejectedValueOnce(new Error('API Error'))
            mockService.getTotalWordsCount.mockRejectedValueOnce(new Error('API Error'))

            const { result } = renderHook(() => useWords('all', 'flashcard'))

            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 0))
            })

            expect(result.current.loading).toBe(false)
            expect(result.current.words).toEqual([])
            expect(result.current.totalWords).toBe(0)
        })

        it('devrait recharger quand la difficulté change', async () => {
            const mockWords = [{ id: 1, word: 'hello', translation: 'bonjour' }]
            mockService.getAllWords.mockResolvedValue(mockWords)
            mockService.getTotalWordsCount.mockResolvedValue(50)

            const { rerender } = renderHook(
                ({ difficulty }) => useWords(difficulty, 'flashcard'),
                { initialProps: { difficulty: 'beginner' } }
            )

            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 0))
            })

            expect(mockService.getAllWords).toHaveBeenCalledWith('beginner')

            // Changer la difficulté
            rerender({ difficulty: 'intermediate' })

            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 0))
            })

            expect(mockService.getAllWords).toHaveBeenCalledWith('intermediate')
            expect(mockService.getAllWords).toHaveBeenCalledTimes(2)
        })
    })

    describe('navigation', () => {
        beforeEach(async () => {
            const mockWords = [
                { id: 1, word: 'hello', translation: 'bonjour' },
                { id: 2, word: 'world', translation: 'monde' },
                { id: 3, word: 'test', translation: 'test' }
            ]

            mockService.getAllWords.mockResolvedValue(mockWords)
            mockService.getTotalWordsCount.mockResolvedValue(3)
        })

        it('devrait naviguer vers le mot suivant', async () => {
            const { result } = renderHook(() => useWords('all', 'flashcard'))

            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 0))
            })

            expect(result.current.currentWordIndex).toBe(0)

            act(() => {
                result.current.handleNext()
            })

            expect(result.current.currentWordIndex).toBe(1)
            expect(result.current.showAnswer).toBe(true)
        })

        it('ne devrait pas dépasser le dernier mot', async () => {
            const { result } = renderHook(() => useWords('all', 'flashcard'))

            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 0))
            })

            // Aller au dernier mot
            act(() => {
                result.current.handleNext()
                result.current.handleNext()
            })

            expect(result.current.currentWordIndex).toBe(2)

            // Essayer d'aller plus loin
            act(() => {
                result.current.handleNext()
            })

            expect(result.current.currentWordIndex).toBe(2) // Ne devrait pas changer
        })

        it('devrait naviguer vers le mot précédent', async () => {
            const { result } = renderHook(() => useWords('all', 'flashcard'))

            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 0))
            })

            // Aller au deuxième mot
            act(() => {
                result.current.handleNext()
            })

            expect(result.current.currentWordIndex).toBe(1)

            // Revenir au premier
            act(() => {
                result.current.handlePrevious()
            })

            expect(result.current.currentWordIndex).toBe(0)
            expect(result.current.showAnswer).toBe(true)
        })

        it('ne devrait pas aller avant le premier mot', async () => {
            const { result } = renderHook(() => useWords('all', 'flashcard'))

            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 0))
            })

            expect(result.current.currentWordIndex).toBe(0)

            act(() => {
                result.current.handlePrevious()
            })

            expect(result.current.currentWordIndex).toBe(0) // Ne devrait pas changer
        })
    })

    describe('gestion des réponses', () => {
        beforeEach(async () => {
            const mockWords = [
                { id: 1, word: 'hello', translation: 'bonjour' }
            ]

            mockService.getAllWords.mockResolvedValue(mockWords)
            mockService.getTotalWordsCount.mockResolvedValue(1)
        })

        it('devrait basculer l\'affichage de la réponse', async () => {
            const { result } = renderHook(() => useWords('all', 'flashcard'))

            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 0))
            })

            expect(result.current.showAnswer).toBe(true)

            act(() => {
                result.current.toggleAnswer()
            })

            expect(result.current.showAnswer).toBe(false)

            act(() => {
                result.current.toggleAnswer()
            })

            expect(result.current.showAnswer).toBe(true)
        })

        it('devrait gérer la réponse connue', async () => {
            mockService.updateUserProgress.mockResolvedValueOnce(true)

            const { result } = renderHook(() => useWords('all', 'flashcard'))

            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 0))
            })

            const initialIndex = result.current.currentWordIndex

            await act(async () => {
                await result.current.handleKnowAnswer(true)
            })

            expect(mockService.updateUserProgress).toHaveBeenCalledWith(1, true)
            // Devrait passer au mot suivant mais comme il n'y en a qu'un, l'index reste le même
            expect(result.current.currentWordIndex).toBe(initialIndex)
        })

        it('devrait gérer les erreurs de sauvegarde du progrès', async () => {
            mockService.updateUserProgress.mockRejectedValueOnce(new Error('Save error'))

            const { result } = renderHook(() => useWords('all', 'flashcard'))

            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 0))
            })

            // Ne devrait pas lever d'erreur même si la sauvegarde échoue
            await act(async () => {
                await expect(result.current.handleKnowAnswer(false)).resolves.not.toThrow()
            })

            expect(mockService.updateUserProgress).toHaveBeenCalledWith(1, false)
        })
    })

    describe('rechargement manuel', () => {
        it('devrait permettre le rechargement manuel', async () => {
            const mockWords = [{ id: 1, word: 'hello', translation: 'bonjour' }]
            mockService.getAllWords.mockResolvedValue(mockWords)
            mockService.getTotalWordsCount.mockResolvedValue(1)

            const { result } = renderHook(() => useWords('all', 'flashcard'))

            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 0))
            })

            expect(mockService.getAllWords).toHaveBeenCalledTimes(1)

            await act(async () => {
                await result.current.loadWords()
            })

            expect(mockService.getAllWords).toHaveBeenCalledTimes(2)
        })
    })
})
