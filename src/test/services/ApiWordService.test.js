import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ApiWordService } from '../../services/ApiWordService.js'

describe('ApiWordService', () => {
  let service
  let mockFetch

  beforeEach(() => {
    service = new ApiWordService()
    mockFetch = vi.fn()
    global.fetch = mockFetch
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('getAllWords', () => {
    it('devrait récupérer tous les mots avec succès', async () => {
      const mockWords = [
        { id: 1, word: 'hello', translation: 'bonjour', difficulty: 'beginner' },
        { id: 2, word: 'world', translation: 'monde', difficulty: 'intermediate' }
      ]

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({
          success: true,
          data: mockWords
        })
      })

      const result = await service.getAllWords()

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/words?')
      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({
        id: 1,
        word: 'hello',
        translation: 'bonjour'
      })
    })

    it('devrait filtrer par difficulté', async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({
          success: true,
          data: []
        })
      })

      await service.getAllWords('beginner')

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/words?difficulty=beginner')
    })

    it('devrait retourner un tableau vide en cas d\'erreur', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await service.getAllWords()

      expect(result).toEqual([])
    })

    it('devrait gérer les erreurs de l\'API', async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({
          success: false,
          error: 'Database error'
        })
      })

      const result = await service.getAllWords()

      expect(result).toEqual([])
    })
  })

  describe('getWordById', () => {
    it('devrait récupérer un mot par ID', async () => {
      const mockWord = { id: 1, word: 'hello', translation: 'bonjour' }

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({
          success: true,
          data: mockWord
        })
      })

      const result = await service.getWordById(1)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/words/1')
      expect(result).toMatchObject(mockWord)
    })

    it('devrait retourner null si le mot n\'existe pas', async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({
          success: false,
          error: 'Word not found'
        })
      })

      const result = await service.getWordById(999)

      expect(result).toBeNull()
    })
  })

  describe('searchWords', () => {
    it('devrait chercher des mots avec une requête', async () => {
      const mockWords = [
        { id: 1, word: 'hello', translation: 'bonjour' }
      ]

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({
          success: true,
          data: mockWords
        })
      })

      const result = await service.searchWords('hello')

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/words?search=hello')
      expect(result).toHaveLength(1)
    })

    it('devrait chercher avec filtre de difficulté', async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({
          success: true,
          data: []
        })
      })

      await service.searchWords('hello', 'beginner')

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/words?search=hello&difficulty=beginner')
    })
  })

  describe('getTotalWordsCount', () => {
    it('devrait retourner le nombre total de mots', async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({
          success: true,
          data: { count: 100 }
        })
      })

      const result = await service.getTotalWordsCount()

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/words/count?')
      expect(result).toBe(100)
    })

    it('devrait retourner 0 en cas d\'erreur', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await service.getTotalWordsCount()

      expect(result).toBe(0)
    })
  })

  describe('generateQuiz', () => {
    it('devrait générer un quiz', async () => {
      const mockQuiz = {
        questions: [
          {
            id: 1,
            word: 'hello',
            translation: 'bonjour',
            options: ['bonjour', 'au revoir', 'merci', 'salut'],
            correctIndex: 0
          }
        ]
      }

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({
          success: true,
          data: mockQuiz
        })
      })

      const result = await service.generateQuiz('beginner', 5)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/quiz/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ difficulty: 'beginner', count: 5 })
      })
      expect(result).toEqual(mockQuiz)
    })
  })

  describe('updateUserProgress', () => {
    it('devrait mettre à jour le progrès utilisateur', async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({
          success: true
        })
      })

      const result = await service.updateUserProgress(1, true)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/words/1/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ knows: true })
      })
      expect(result).toBe(true)
    })

    it('devrait retourner false en cas d\'erreur', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await service.updateUserProgress(1, true)

      expect(result).toBe(false)
    })
  })

  describe('formatWord', () => {
    it('devrait formater un mot correctement', () => {
      const rawWord = {
        id: 1,
        word: 'hello',
        translation: 'bonjour',
        difficulty: 'beginner',
        category: 'greetings'
      }

      const formatted = service.formatWord(rawWord)

      expect(formatted).toEqual({
        id: 1,
        word: 'hello',
        translation: 'bonjour',
        difficulty: 'beginner',
        category: 'greetings'
      })
    })

    it('devrait gérer les traductions vides', () => {
      const rawWord = {
        id: 1,
        word: 'hello',
        translation: '[ ]',
        difficulty: 'beginner'
      }

      const formatted = service.formatWord(rawWord)

      expect(formatted.translation).toBe('[ ]')
    })
  })
})
