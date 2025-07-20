import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FlashcardComponent } from '../../components/Flashcard/FlashcardComponent.jsx'

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

describe('FlashcardComponent', () => {
    const mockTheme = {
        text: 'text-white',
        cardBackground: 'bg-gray-800',
        border: 'border-gray-600',
        badge: 'bg-blue-600',
        button: 'bg-blue-500',
        buttonSecondary: 'bg-gray-600'
    }

    const mockWord = {
        id: 1,
        word: 'hello',
        translation: 'bonjour',
        difficulty: 'beginner'
    }

    const defaultProps = {
        currentWord: mockWord,
        currentWordIndex: 0,
        totalWords: 10,
        showAnswer: true,
        theme: mockTheme,
        onNext: vi.fn(),
        onPrevious: vi.fn(),
        onToggleAnswer: vi.fn(),
        onKnowAnswer: vi.fn()
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('rendu', () => {
        it('devrait afficher le mot et sa traduction', () => {
            render(<FlashcardComponent {...defaultProps} />)

            expect(screen.getByText('hello')).toBeInTheDocument()
            expect(screen.getByText('bonjour')).toBeInTheDocument()
        })

        it('devrait afficher le compteur de progression', () => {
            render(<FlashcardComponent {...defaultProps} />)

            expect(screen.getByText('1 / 10')).toBeInTheDocument()
        })

        it('devrait afficher le niveau de difficulté', () => {
            render(<FlashcardComponent {...defaultProps} />)

            expect(screen.getByText('Débutant')).toBeInTheDocument()
        })

        it('devrait masquer la traduction quand showAnswer est false', () => {
            render(<FlashcardComponent {...defaultProps} showAnswer={false} />)

            expect(screen.getByText('hello')).toBeInTheDocument()
            expect(screen.queryByText('bonjour')).not.toBeInTheDocument()
            expect(screen.getByText('Cliquez pour révéler la traduction')).toBeInTheDocument()
        })

        it('devrait afficher un message quand aucun mot n\'est fourni', () => {
            render(<FlashcardComponent {...defaultProps} currentWord={null} />)

            expect(screen.getByText('Aucun mot trouvé')).toBeInTheDocument()
        })
    })

    describe('niveaux de difficulté', () => {
        it('devrait afficher "Intermédiaire" pour intermediate', () => {
            const wordIntermediate = { ...mockWord, difficulty: 'intermediate' }
            render(<FlashcardComponent {...defaultProps} currentWord={wordIntermediate} />)

            expect(screen.getByText('Intermédiaire')).toBeInTheDocument()
        })

        it('devrait afficher "Avancé" pour advanced', () => {
            const wordAdvanced = { ...mockWord, difficulty: 'advanced' }
            render(<FlashcardComponent {...defaultProps} currentWord={wordAdvanced} />)

            expect(screen.getByText('Avancé')).toBeInTheDocument()
        })

        it('devrait afficher la difficulté telle quelle si non reconnue', () => {
            const wordCustom = { ...mockWord, difficulty: 'expert' }
            render(<FlashcardComponent {...defaultProps} currentWord={wordCustom} />)

            expect(screen.getByText('expert')).toBeInTheDocument()
        })
    })

    describe('interactions', () => {
        it('devrait appeler onToggleAnswer quand on clique sur "Révéler"', () => {
            render(<FlashcardComponent {...defaultProps} showAnswer={false} />)

            const revealButton = screen.getByText('Révéler la traduction')
            fireEvent.click(revealButton)

            expect(defaultProps.onToggleAnswer).toHaveBeenCalledTimes(1)
        })

        it('devrait appeler onToggleAnswer quand on clique sur "Masquer"', () => {
            render(<FlashcardComponent {...defaultProps} showAnswer={true} />)

            const hideButton = screen.getByText('Masquer la traduction')
            fireEvent.click(hideButton)

            expect(defaultProps.onToggleAnswer).toHaveBeenCalledTimes(1)
        })

        it('devrait appeler onKnowAnswer(true) quand on clique sur "Je le sais"', () => {
            render(<FlashcardComponent {...defaultProps} />)

            const knowButton = screen.getByText('Je le sais ✅')
            fireEvent.click(knowButton)

            expect(defaultProps.onKnowAnswer).toHaveBeenCalledWith(true)
        })

        it('devrait appeler onKnowAnswer(false) quand on clique sur "Je ne le sais pas"', () => {
            render(<FlashcardComponent {...defaultProps} />)

            const dontKnowButton = screen.getByText('Je ne le sais pas ❌')
            fireEvent.click(dontKnowButton)

            expect(defaultProps.onKnowAnswer).toHaveBeenCalledWith(false)
        })

        it('devrait appeler onPrevious quand on clique sur "Précédent"', () => {
            render(<FlashcardComponent {...defaultProps} />)

            const prevButton = screen.getByText('Précédent')
            fireEvent.click(prevButton)

            expect(defaultProps.onPrevious).toHaveBeenCalledTimes(1)
        })

        it('devrait appeler onNext quand on clique sur "Suivant"', () => {
            render(<FlashcardComponent {...defaultProps} />)

            const nextButton = screen.getByText('Suivant')
            fireEvent.click(nextButton)

            expect(defaultProps.onNext).toHaveBeenCalledTimes(1)
        })
    })

    describe('état des boutons', () => {
        it('devrait désactiver le bouton "Précédent" au premier mot', () => {
            render(<FlashcardComponent {...defaultProps} currentWordIndex={0} />)

            const prevButton = screen.getByText('Précédent')
            expect(prevButton.closest('button')).toBeDisabled()
        })

        it('devrait désactiver le bouton "Suivant" au dernier mot', () => {
            render(<FlashcardComponent {...defaultProps} currentWordIndex={9} totalWords={10} />)

            const nextButton = screen.getByText('Suivant')
            expect(nextButton.closest('button')).toBeDisabled()
        })

        it('devrait activer les deux boutons au milieu de la liste', () => {
            render(<FlashcardComponent {...defaultProps} currentWordIndex={5} totalWords={10} />)

            const prevButton = screen.getByText('Précédent')
            const nextButton = screen.getByText('Suivant')

            expect(prevButton.closest('button')).not.toBeDisabled()
            expect(nextButton.closest('button')).not.toBeDisabled()
        })
    })

    describe('traductions spéciales', () => {
        it('devrait afficher un message pour les traductions non disponibles', () => {
            const wordWithNoTranslation = { ...mockWord, translation: '[ ]' }
            render(<FlashcardComponent {...defaultProps} currentWord={wordWithNoTranslation} />)

            expect(screen.getByText('⚠️ Traduction non disponible')).toBeInTheDocument()
        })

        it('devrait afficher normalement les autres traductions', () => {
            render(<FlashcardComponent {...defaultProps} />)

            expect(screen.getByText('bonjour')).toBeInTheDocument()
            expect(screen.queryByText('⚠️ Traduction non disponible')).not.toBeInTheDocument()
        })
    })

    describe('thèmes et styles', () => {
        it('devrait appliquer les classes de thème correctement', () => {
            const { container } = render(<FlashcardComponent {...defaultProps} />)

            expect(container.querySelector('.bg-gray-800')).toBeInTheDocument()
            expect(container.querySelector('.text-white')).toBeInTheDocument()
            expect(container.querySelector('.border-gray-600')).toBeInTheDocument()
        })

        it('devrait gérer un thème différent', () => {
            const lightTheme = {
                text: 'text-black',
                cardBackground: 'bg-white',
                border: 'border-gray-200',
                badge: 'bg-blue-100',
                button: 'bg-blue-400',
                buttonSecondary: 'bg-gray-300'
            }

            const { container } = render(<FlashcardComponent {...defaultProps} theme={lightTheme} />)

            expect(container.querySelector('.bg-white')).toBeInTheDocument()
            expect(container.querySelector('.text-black')).toBeInTheDocument()
            expect(container.querySelector('.border-gray-200')).toBeInTheDocument()
        })
    })
})
