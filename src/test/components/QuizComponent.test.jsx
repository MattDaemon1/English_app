import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QuizComponent } from '../../components/Quiz/QuizComponent.jsx'

// Mock des composants UI
vi.mock('../../components/ui/badge.jsx', () => ({
    Badge: ({ children, className }) => <span className={className}>{children}</span>
}))

vi.mock('../../components/ui/card.jsx', () => ({
    Card: ({ children, className }) => <div className={className}>{children}</div>,
    CardContent: ({ children, className }) => <div className={className}>{children}</div>,
    CardHeader: ({ children, className }) => <div className={className}>{children}</div>,
    CardTitle: ({ children, className }) => <h2 className={className}>{children}</h2>
}))

describe('QuizComponent', () => {
    const mockTheme = {
        text: 'text-white',
        accent: 'text-blue-400',
        cardBackground: 'bg-gray-800',
        border: 'border-gray-600',
        badge: 'bg-blue-600',
        button: 'bg-blue-500',
        buttonHover: 'hover:bg-blue-600',
        buttonSecondary: 'bg-gray-600',
        buttonSecondaryHover: 'hover:bg-gray-700'
    }

    const mockQuizWord = {
        word: 'hello',
        choices: ['bonjour', 'au revoir', 'merci', 'salut'],
        correctAnswer: 0
    }

    const defaultProps = {
        currentQuizWord: mockQuizWord,
        currentQuizIndex: 0,
        selectedAnswer: null,
        quizScore: 0,
        quizCompleted: false,
        totalQuestions: 10,
        theme: mockTheme,
        onAnswerSelect: vi.fn(),
        onRestart: vi.fn(),
        onBackToFlashcards: vi.fn()
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('rendu du quiz en cours', () => {
        it('devrait afficher la question et les choix', () => {
            render(<QuizComponent {...defaultProps} />)

            expect(screen.getByText('hello')).toBeInTheDocument()
            expect(screen.getByText('bonjour')).toBeInTheDocument()
            expect(screen.getByText('au revoir')).toBeInTheDocument()
            expect(screen.getByText('merci')).toBeInTheDocument()
            expect(screen.getByText('salut')).toBeInTheDocument()
        })

        it('devrait afficher le compteur de progression', () => {
            render(<QuizComponent {...defaultProps} />)

            expect(screen.getByText('1 / 10')).toBeInTheDocument()
        })

        it('devrait afficher le score actuel', () => {
            render(<QuizComponent {...defaultProps} quizScore={3} />)

            expect(screen.getByText('Score: 3/10')).toBeInTheDocument()
        })

        it('devrait permettre de sélectionner une réponse', () => {
            render(<QuizComponent {...defaultProps} />)

            const firstChoice = screen.getByText('bonjour')
            fireEvent.click(firstChoice)

            expect(defaultProps.onAnswerSelect).toHaveBeenCalledWith(0)
        })

        it('devrait mettre en évidence la réponse sélectionnée', () => {
            render(<QuizComponent {...defaultProps} selectedAnswer={1} />)

            const choices = screen.getAllByRole('button')
            const selectedChoice = choices[1] // 'au revoir'

            expect(selectedChoice).toHaveClass('ring-2')
        })
    })

    describe('rendu du quiz terminé', () => {
        const completedProps = {
            ...defaultProps,
            quizCompleted: true,
            quizScore: 7
        }

        it('devrait afficher l\'écran de fin de quiz', () => {
            render(<QuizComponent {...completedProps} />)

            expect(screen.getByText('Quiz terminé !')).toBeInTheDocument()
            expect(screen.getByText('7/10')).toBeInTheDocument()
        })

        it('devrait afficher le message de score approprié', () => {
            // Score excellent (8+)
            render(<QuizComponent {...completedProps} quizScore={9} />)
            expect(screen.getByText('🎉 Excellent !')).toBeInTheDocument()

            // Score bien (6-7)
            render(<QuizComponent {...completedProps} quizScore={6} />)
            expect(screen.getByText('👍 Bien')).toBeInTheDocument()

            // Score correct (4-5)
            render(<QuizComponent {...completedProps} quizScore={4} />)
            expect(screen.getByText('👌 Correct')).toBeInTheDocument()

            // Score faible (0-3)
            render(<QuizComponent {...completedProps} quizScore={2} />)
            expect(screen.getByText('💪 Continuez !')).toBeInTheDocument()
        })

        it('devrait permettre de recommencer le quiz', () => {
            render(<QuizComponent {...completedProps} />)

            const restartButton = screen.getByText('Recommencer le quiz')
            fireEvent.click(restartButton)

            expect(defaultProps.onRestart).toHaveBeenCalledTimes(1)
        })

        it('devrait permettre de retourner aux flashcards', () => {
            render(<QuizComponent {...completedProps} />)

            const backButton = screen.getByText('Retour aux flashcards')
            fireEvent.click(backButton)

            expect(defaultProps.onBackToFlashcards).toHaveBeenCalledTimes(1)
        })
    })

    describe('gestion des choix multiples', () => {
        it('devrait afficher tous les choix comme boutons cliquables', () => {
            render(<QuizComponent {...defaultProps} />)

            const choiceButtons = screen.getAllByRole('button')
            expect(choiceButtons).toHaveLength(4)

            choiceButtons.forEach((button, index) => {
                expect(button).toHaveTextContent(mockQuizWord.choices[index])
            })
        })

        it('devrait appeler onAnswerSelect avec le bon index', () => {
            render(<QuizComponent {...defaultProps} />)

            const choices = screen.getAllByRole('button')

            fireEvent.click(choices[2]) // Cliquer sur 'merci'
            expect(defaultProps.onAnswerSelect).toHaveBeenCalledWith(2)

            fireEvent.click(choices[0]) // Cliquer sur 'bonjour'
            expect(defaultProps.onAnswerSelect).toHaveBeenCalledWith(0)
        })

        it('ne devrait pas afficher de choix si currentQuizWord est null', () => {
            render(<QuizComponent {...defaultProps} currentQuizWord={null} />)

            // Devrait afficher un message d'erreur ou ne rien afficher
            expect(screen.queryByText('bonjour')).not.toBeInTheDocument()
        })
    })

    describe('progression du quiz', () => {
        it('devrait afficher la progression correcte', () => {
            render(<QuizComponent {...defaultProps} currentQuizIndex={4} />)

            expect(screen.getByText('5 / 10')).toBeInTheDocument()
        })

        it('devrait afficher la progression à la dernière question', () => {
            render(<QuizComponent {...defaultProps} currentQuizIndex={9} />)

            expect(screen.getByText('10 / 10')).toBeInTheDocument()
        })

        it('devrait gérer un nombre total de questions personnalisé', () => {
            render(<QuizComponent {...defaultProps} totalQuestions={5} currentQuizIndex={2} />)

            expect(screen.getByText('3 / 5')).toBeInTheDocument()
            expect(screen.getByText('Score: 0/5')).toBeInTheDocument()
        })
    })

    describe('thèmes et styles', () => {
        it('devrait appliquer les classes de thème correctement', () => {
            const { container } = render(<QuizComponent {...defaultProps} />)

            expect(container.querySelector('.bg-gray-800')).toBeInTheDocument()
            expect(container.querySelector('.text-white')).toBeInTheDocument()
            expect(container.querySelector('.border-gray-600')).toBeInTheDocument()
        })

        it('devrait appliquer les styles de sélection', () => {
            render(<QuizComponent {...defaultProps} selectedAnswer={0} />)

            const choices = screen.getAllByRole('button')
            const selectedChoice = choices[0]

            expect(selectedChoice).toHaveClass('ring-2')
        })
    })

    describe('cas limites', () => {
        it('devrait gérer un score de 0', () => {
            render(<QuizComponent {...defaultProps} quizCompleted={true} quizScore={0} />)

            expect(screen.getByText('0/10')).toBeInTheDocument()
            expect(screen.getByText('💪 Continuez !')).toBeInTheDocument()
        })

        it('devrait gérer un score parfait', () => {
            render(<QuizComponent {...defaultProps} quizCompleted={true} quizScore={10} />)

            expect(screen.getByText('10/10')).toBeInTheDocument()
            expect(screen.getByText('🎉 Excellent !')).toBeInTheDocument()
        })

        it('devrait gérer l\'absence de mot de quiz', () => {
            const { container } = render(<QuizComponent {...defaultProps} currentQuizWord={null} />)

            // Le composant ne devrait pas crasher
            expect(container).toBeInTheDocument()
        })

        it('devrait gérer des choix vides', () => {
            const emptyChoicesWord = {
                word: 'test',
                choices: [],
                correctAnswer: 0
            }

            render(<QuizComponent {...defaultProps} currentQuizWord={emptyChoicesWord} />)

            expect(screen.getByText('test')).toBeInTheDocument()
            expect(screen.queryAllByRole('button')).toHaveLength(0)
        })
    })
})
