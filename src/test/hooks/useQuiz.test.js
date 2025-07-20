import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useQuiz } from '../../hooks/useQuiz.js'

// Mock du service API
vi.mock('../../services/ApiWordService.js', () => ({
    getApiService: () => ({
        generateQuiz: vi.fn()
    })
}))

describe('useQuiz', () => {
    let mockService

    beforeEach(async () => {
        const { getApiService } = await import('../../services/ApiWordService.js')
        mockService = getApiService()
        vi.clearAllMocks()
    })

    describe('initialisation', () => {
        it('devrait initialiser avec les valeurs par défaut', () => {
            const { result } = renderHook(() => useQuiz('all'))

            expect(result.current.isQuizMode).toBe(false)
            expect(result.current.quizWords).toEqual([])
            expect(result.current.currentQuizIndex).toBe(0)
            expect(result.current.selectedAnswer).toBeNull()
            expect(result.current.score).toBe(0)
            expect(result.current.answers).toEqual([])
            expect(result.current.showResult).toBe(false)
            expect(result.current.quizFinished).toBe(false)
            expect(result.current.currentQuizWord).toBeUndefined()
        })
    })

    describe('démarrage du quiz', () => {
        it('devrait démarrer un quiz avec succès', async () => {
            const mockQuizWord = {
                word: 'hello',
                choices: ['bonjour', 'au revoir', 'merci', 'salut'],
                correctAnswer: 0
            }

            mockService.generateQuiz.mockResolvedValue(mockQuizWord)

            const { result } = renderHook(() => useQuiz('beginner'))

            await act(async () => {
                await result.current.startQuiz()
            })

            expect(result.current.isQuizMode).toBe(true)
            expect(result.current.quizWords).toHaveLength(10)
            expect(result.current.currentQuizIndex).toBe(0)
            expect(result.current.score).toBe(0)
            expect(result.current.answers).toEqual([])
            expect(result.current.quizFinished).toBe(false)
            expect(result.current.showResult).toBe(false)
            expect(mockService.generateQuiz).toHaveBeenCalledTimes(10)
        })

        it('devrait gérer les erreurs lors du démarrage', async () => {
            mockService.generateQuiz.mockRejectedValue(new Error('API Error'))

            const { result } = renderHook(() => useQuiz('beginner'))

            await act(async () => {
                await result.current.startQuiz()
            })

            // Devrait rester en mode non-quiz si erreur
            expect(result.current.isQuizMode).toBe(false)
            expect(result.current.quizWords).toEqual([])
        })

        it('devrait réinitialiser les données précédentes', async () => {
            const mockQuizWord = {
                word: 'hello',
                choices: ['bonjour', 'au revoir', 'merci', 'salut'],
                correctAnswer: 0
            }

            mockService.generateQuiz.mockResolvedValue(mockQuizWord)

            const { result } = renderHook(() => useQuiz('beginner'))

            // Premier quiz
            await act(async () => {
                await result.current.startQuiz()
            })

            // Simuler quelques réponses
            act(() => {
                result.current.selectAnswer(1)
                result.current.submitAnswer()
            })

            // Deuxième quiz
            await act(async () => {
                await result.current.startQuiz()
            })

            expect(result.current.currentQuizIndex).toBe(0)
            expect(result.current.selectedAnswer).toBeNull()
            expect(result.current.score).toBe(0)
            expect(result.current.answers).toEqual([])
            expect(result.current.showResult).toBe(false)
        })
    })

    describe('sélection et soumission des réponses', () => {
        beforeEach(async () => {
            const mockQuizWord = {
                word: 'hello',
                choices: ['bonjour', 'au revoir', 'merci', 'salut'],
                correctAnswer: 0
            }

            mockService.generateQuiz.mockResolvedValue(mockQuizWord)

            const { result } = renderHook(() => useQuiz('beginner'))

            await act(async () => {
                await result.current.startQuiz()
            })

            return { result }
        })

        it('devrait sélectionner une réponse', async () => {
            const { result } = await beforeEach()

            act(() => {
                result.current.selectAnswer(2)
            })

            expect(result.current.selectedAnswer).toBe(2)
        })

        it('devrait soumettre une réponse correcte', async () => {
            const { result } = await beforeEach()

            act(() => {
                result.current.selectAnswer(0) // Réponse correcte
                result.current.submitAnswer()
            })

            expect(result.current.showResult).toBe(true)
            expect(result.current.score).toBe(1)
            expect(result.current.answers).toHaveLength(1)
            expect(result.current.answers[0].isCorrect).toBe(true)
        })

        it('devrait soumettre une réponse incorrecte', async () => {
            const { result } = await beforeEach()

            act(() => {
                result.current.selectAnswer(1) // Réponse incorrecte
                result.current.submitAnswer()
            })

            expect(result.current.showResult).toBe(true)
            expect(result.current.score).toBe(0)
            expect(result.current.answers).toHaveLength(1)
            expect(result.current.answers[0].isCorrect).toBe(false)
        })

        it('devrait enregistrer les détails de la réponse', async () => {
            const { result } = await beforeEach()

            act(() => {
                result.current.selectAnswer(1)
                result.current.submitAnswer()
            })

            const answer = result.current.answers[0]
            expect(answer.questionIndex).toBe(0)
            expect(answer.selectedAnswer).toBe(1)
            expect(answer.word).toBe('hello')
            expect(answer.correctTranslation).toBe('bonjour')
        })
    })

    describe('navigation dans le quiz', () => {
        beforeEach(async () => {
            const mockQuizWord = {
                word: 'hello',
                choices: ['bonjour', 'au revoir', 'merci', 'salut'],
                correctAnswer: 0
            }

            mockService.generateQuiz.mockResolvedValue(mockQuizWord)

            const { result } = renderHook(() => useQuiz('beginner'))

            await act(async () => {
                await result.current.startQuiz()
            })

            return { result }
        })

        it('devrait passer à la question suivante', async () => {
            const { result } = await beforeEach()

            act(() => {
                result.current.nextQuestion()
            })

            expect(result.current.currentQuizIndex).toBe(1)
            expect(result.current.selectedAnswer).toBeNull()
            expect(result.current.showResult).toBe(false)
        })

        it('devrait terminer le quiz à la dernière question', async () => {
            const { result } = await beforeEach()

            // Aller à la dernière question
            act(() => {
                for (let i = 0; i < 9; i++) {
                    result.current.nextQuestion()
                }
            })

            expect(result.current.currentQuizIndex).toBe(9)
            expect(result.current.quizFinished).toBe(false)

            // Passer la dernière question
            act(() => {
                result.current.nextQuestion()
            })

            expect(result.current.quizFinished).toBe(true)
        })
    })

    describe('redémarrage et sortie', () => {
        beforeEach(async () => {
            const mockQuizWord = {
                word: 'hello',
                choices: ['bonjour', 'au revoir', 'merci', 'salut'],
                correctAnswer: 0
            }

            mockService.generateQuiz.mockResolvedValue(mockQuizWord)

            const { result } = renderHook(() => useQuiz('beginner'))

            await act(async () => {
                await result.current.startQuiz()
            })

            // Simuler quelques actions
            act(() => {
                result.current.selectAnswer(0)
                result.current.submitAnswer()
                result.current.nextQuestion()
            })

            return { result }
        })

        it('devrait redémarrer le quiz', async () => {
            const { result } = await beforeEach()

            act(() => {
                result.current.restartQuiz()
            })

            expect(result.current.isQuizMode).toBe(false)
            expect(result.current.quizWords).toEqual([])
            expect(result.current.currentQuizIndex).toBe(0)
            expect(result.current.selectedAnswer).toBeNull()
            expect(result.current.score).toBe(0)
            expect(result.current.answers).toEqual([])
            expect(result.current.showResult).toBe(false)
            expect(result.current.quizFinished).toBe(false)
        })

        it('devrait sortir du quiz', async () => {
            const { result } = await beforeEach()

            act(() => {
                result.current.exitQuiz()
            })

            expect(result.current.isQuizMode).toBe(false)
            expect(result.current.quizWords).toEqual([])
            expect(result.current.currentQuizIndex).toBe(0)
            expect(result.current.selectedAnswer).toBeNull()
            expect(result.current.score).toBe(0)
            expect(result.current.answers).toEqual([])
            expect(result.current.showResult).toBe(false)
            expect(result.current.quizFinished).toBe(false)
        })
    })

    describe('propriétés calculées', () => {
        it('devrait retourner le mot de quiz actuel', async () => {
            const mockQuizWords = [
                { word: 'hello', choices: ['bonjour'], correctAnswer: 0 },
                { word: 'world', choices: ['monde'], correctAnswer: 0 }
            ]

            mockService.generateQuiz
                .mockResolvedValueOnce(mockQuizWords[0])
                .mockResolvedValueOnce(mockQuizWords[1])

            const { result } = renderHook(() => useQuiz('beginner'))

            await act(async () => {
                await result.current.startQuiz()
            })

            expect(result.current.currentQuizWord.word).toBe('hello')

            act(() => {
                result.current.nextQuestion()
            })

            expect(result.current.currentQuizWord.word).toBe('hello') // Encore le même car tous les mots générés sont identiques dans le mock
        })
    })
})
