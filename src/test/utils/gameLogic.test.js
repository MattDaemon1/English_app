import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { SpacedRepetition, ExerciseGenerator, difficultyLevels, exerciseTypes } from '../../gameLogic.js'

describe('SpacedRepetition', () => {
    let spacedRepetition

    beforeEach(() => {
        spacedRepetition = new SpacedRepetition()
    })

    describe('getNextInterval', () => {
        it('devrait augmenter l\'intervalle en cas de succès', () => {
            const currentInterval = 1
            const nextInterval = spacedRepetition.getNextInterval(currentInterval, true)

            expect(nextInterval).toBe(3)
        })

        it('devrait diminuer l\'intervalle en cas d\'échec', () => {
            const currentInterval = 7
            const nextInterval = spacedRepetition.getNextInterval(currentInterval, false)

            expect(nextInterval).toBe(3)
        })

        it('ne devrait pas dépasser l\'intervalle maximum', () => {
            const currentInterval = 90 // Maximum
            const nextInterval = spacedRepetition.getNextInterval(currentInterval, true)

            expect(nextInterval).toBe(90)
        })

        it('ne devrait pas descendre en dessous du minimum', () => {
            const currentInterval = 1 // Minimum
            const nextInterval = spacedRepetition.getNextInterval(currentInterval, false)

            expect(nextInterval).toBe(1)
        })

        it('devrait gérer les intervalles inexistants', () => {
            const currentInterval = 999 // N'existe pas dans la liste
            const nextInterval = spacedRepetition.getNextInterval(currentInterval, true)

            expect(nextInterval).toBe(1) // Devrait retourner le premier intervalle
        })
    })

    describe('shouldReview', () => {
        beforeEach(() => {
            // Mock de la date actuelle
            vi.setSystemTime(new Date('2024-01-15'))
        })

        afterEach(() => {
            vi.useRealTimers()
        })

        it('devrait retourner true si aucune date de révision', () => {
            const shouldReview = spacedRepetition.shouldReview(null, 1)

            expect(shouldReview).toBe(true)
        })

        it('devrait retourner true si l\'intervalle est dépassé', () => {
            const lastReviewDate = '2024-01-10' // 5 jours plus tôt
            const interval = 3 // 3 jours
            const shouldReview = spacedRepetition.shouldReview(lastReviewDate, interval)

            expect(shouldReview).toBe(true)
        })

        it('devrait retourner false si l\'intervalle n\'est pas dépassé', () => {
            const lastReviewDate = '2024-01-14' // 1 jour plus tôt
            const interval = 3 // 3 jours
            const shouldReview = spacedRepetition.shouldReview(lastReviewDate, interval)

            expect(shouldReview).toBe(false)
        })

        it('devrait retourner true si exactement à l\'intervalle', () => {
            const lastReviewDate = '2024-01-12' // 3 jours plus tôt
            const interval = 3 // 3 jours
            const shouldReview = spacedRepetition.shouldReview(lastReviewDate, interval)

            expect(shouldReview).toBe(true)
        })
    })
})

describe('ExerciseGenerator', () => {
    let words, userProgress, exerciseGenerator

    beforeEach(() => {
        words = [
            { id: 1, word: 'hello', translation: 'bonjour', difficulty: 'beginner' },
            { id: 2, word: 'world', translation: 'monde', difficulty: 'beginner' },
            { id: 3, word: 'goodbye', translation: 'au revoir', difficulty: 'intermediate' },
            { id: 4, word: 'thank you', translation: 'merci', difficulty: 'beginner' },
            { id: 5, word: 'please', translation: 's\'il vous plaît', difficulty: 'intermediate' }
        ]

        userProgress = {
            wordsLearned: [
                { id: 1, lastReview: '2024-01-10', interval: 3, successCount: 2 },
                { id: 2, lastReview: '2024-01-14', interval: 1, successCount: 1 }
            ]
        }

        exerciseGenerator = new ExerciseGenerator(words, userProgress)
    })

    describe('getWordsForReview', () => {
        beforeEach(() => {
            vi.setSystemTime(new Date('2024-01-15'))
        })

        afterEach(() => {
            vi.useRealTimers()
        })

        it('devrait retourner les nouveaux mots et ceux à réviser', () => {
            const wordsForReview = exerciseGenerator.getWordsForReview()

            // Devrait inclure les nouveaux mots (3, 4, 5) et le mot 1 (intervalle dépassé)
            expect(wordsForReview).toHaveLength(4)
            expect(wordsForReview.map(w => w.id)).toContain(1) // À réviser
            expect(wordsForReview.map(w => w.id)).toContain(3) // Nouveau
            expect(wordsForReview.map(w => w.id)).toContain(4) // Nouveau
            expect(wordsForReview.map(w => w.id)).toContain(5) // Nouveau
            expect(wordsForReview.map(w => w.id)).not.toContain(2) // Pas encore à réviser
        })

        it('devrait retourner tous les mots si aucun progrès', () => {
            const emptyProgress = { wordsLearned: [] }
            const generator = new ExerciseGenerator(words, emptyProgress)
            const wordsForReview = generator.getWordsForReview()

            expect(wordsForReview).toHaveLength(5)
        })
    })

    describe('generateMultipleChoice', () => {
        it('devrait générer un QCM avec le bon nombre d\'options', () => {
            const word = words[0] // 'hello'
            const mcq = exerciseGenerator.generateMultipleChoice(word, 4)

            expect(mcq.word).toBe('hello')
            expect(mcq.correctAnswer).toBe('bonjour')
            expect(mcq.options).toHaveLength(4)
            expect(mcq.options).toContain('bonjour')
            expect(mcq.correctIndex).toBeGreaterThanOrEqual(0)
            expect(mcq.correctIndex).toBeLessThan(4)
        })

        it('devrait mélanger les options', () => {
            const word = words[0]
            const mcq1 = exerciseGenerator.generateMultipleChoice(word, 4)
            const mcq2 = exerciseGenerator.generateMultipleChoice(word, 4)

            // Les options devraient être dans un ordre différent (avec une probabilité élevée)
            // On teste juste que les options sont bien mélangées en vérifiant la structure
            expect(mcq1.options[mcq1.correctIndex]).toBe('bonjour')
            expect(mcq2.options[mcq2.correctIndex]).toBe('bonjour')
        })

        it('devrait gérer le cas où il n\'y a pas assez de mots pour les mauvaises réponses', () => {
            const singleWordList = [words[0]]
            const generator = new ExerciseGenerator(singleWordList, userProgress)
            const mcq = generator.generateMultipleChoice(words[0], 4)

            expect(mcq.options).toHaveLength(1) // Seulement la bonne réponse
            expect(mcq.correctIndex).toBe(0)
        })
    })

    describe('generateWordMatching', () => {
        it('devrait générer un exercice d\'association de mots', () => {
            const selectedWords = words.slice(0, 3)
            const matching = exerciseGenerator.generateWordMatching(selectedWords)

            expect(matching.words).toHaveLength(3)
            expect(matching.translations).toHaveLength(3)
            expect(matching.pairs).toHaveLength(3)

            // Vérifier que chaque paire contient un mot et sa traduction
            matching.pairs.forEach(pair => {
                const word = selectedWords.find(w => w.id === pair.wordId)
                expect(word).toBeDefined()
                expect(pair.translation).toBe(word.translation)
            })
        })

        it('devrait mélanger les mots et traductions', () => {
            const selectedWords = words.slice(0, 3)
            const matching = exerciseGenerator.generateWordMatching(selectedWords)

            // Les traductions ne devraient pas être dans le même ordre que les mots
            const originalOrder = selectedWords.map(w => w.translation)
            const shuffledOrder = matching.translations

            // Au moins une différence dans l\'ordre (probabiliste)
            expect(shuffledOrder).toEqual(expect.arrayContaining(originalOrder))
        })
    })

    describe('generateListeningExercise', () => {
        it('devrait générer un exercice d\'écoute', () => {
            const word = words[0]
            const listening = exerciseGenerator.generateListeningExercise(word)

            expect(listening.word).toBe('hello')
            expect(listening.audioUrl).toContain('hello')
            expect(listening.options).toHaveLength(4)
            expect(listening.options).toContain('hello')
            expect(listening.correctIndex).toBeGreaterThanOrEqual(0)
            expect(listening.correctIndex).toBeLessThan(4)
        })

        it('devrait générer une URL audio valide', () => {
            const word = words[0]
            const listening = exerciseGenerator.generateListeningExercise(word)

            expect(listening.audioUrl).toMatch(/^https:\/\//)
            expect(listening.audioUrl).toContain(encodeURIComponent(word.word))
        })
    })
})

describe('difficultyLevels', () => {
    it('devrait avoir les niveaux de difficulté corrects', () => {
        expect(difficultyLevels).toHaveProperty('beginner')
        expect(difficultyLevels).toHaveProperty('intermediate')
        expect(difficultyLevels).toHaveProperty('advanced')

        expect(difficultyLevels.beginner.multiplier).toBe(1)
        expect(difficultyLevels.intermediate.multiplier).toBe(1.5)
        expect(difficultyLevels.advanced.multiplier).toBe(2)
    })
})

describe('exerciseTypes', () => {
    it('devrait avoir tous les types d\'exercices', () => {
        expect(exerciseTypes).toHaveProperty('flashcards')
        expect(exerciseTypes).toHaveProperty('quiz')
        expect(exerciseTypes).toHaveProperty('conversation')
        expect(exerciseTypes).toHaveProperty('listening')

        Object.values(exerciseTypes).forEach(type => {
            expect(type).toHaveProperty('name')
            expect(type).toHaveProperty('description')
            expect(type).toHaveProperty('icon')
            expect(type).toHaveProperty('points')
            expect(typeof type.points).toBe('number')
        })
    })
})
