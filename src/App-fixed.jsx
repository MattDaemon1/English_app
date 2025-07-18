import { useState, useEffect } from 'react'
import { Button } from './components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card.jsx'
// import { Badge } from './components/ui/badge.jsx'
import { Progress } from './components/ui/progress.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs.jsx'
import { Input } from './components/ui/input.jsx'
import { BookOpen, Brain, MessageCircle, Trophy, Star, Volume2, Check, X, RotateCcw, Target, Zap, Award } from 'lucide-react'
import { wordsData, categories, difficulties } from './data/words.js'
import { useProgress } from './hooks/useLocalStorage.js'
import {
    ExerciseGenerator,
    AchievementSystem,
    ConversationGenerator,
    PerformanceAnalyzer,
    exerciseTypes,
    difficultyLevels
} from './utils/gameLogic.js'
import './App.css'

function App() {
    const [currentExercise, setCurrentExercise] = useState('flashcards')
    const [currentWordIndex, setCurrentWordIndex] = useState(0)
    const [showTranslation, setShowTranslation] = useState(false)
    const [userAnswer, setUserAnswer] = useState('')
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(null)
    const [showResult, setShowResult] = useState(false)
    const [currentQuiz, setCurrentQuiz] = useState(null)
    const [selectedAnswer, setSelectedAnswer] = useState('')
    const [currentConversation, setCurrentConversation] = useState(null)
    const [currentStep, setCurrentStep] = useState(0)
    const [userResponse, setUserResponse] = useState('')
    const [conversationComplete, setConversationComplete] = useState(false)
    const [listeningWord, setListeningWord] = useState(null)
    const [userListeningAnswer, setUserListeningAnswer] = useState('')
    const [listeningResult, setListeningResult] = useState(null)
    const [quizLevel, setQuizLevel] = useState('beginner')

    // Hooks
    const { progress, updateProgress } = useProgress()

    // Instances
    const [exerciseGenerator] = useState(() => new ExerciseGenerator(wordsData))
    const [achievementSystem] = useState(() => new AchievementSystem())
    const [conversationGenerator] = useState(() => new ConversationGenerator())
    const [performanceAnalyzer] = useState(() => new PerformanceAnalyzer())

    // Fonctions simplifiées
    const nextCard = () => {
        setCurrentWordIndex((prev) => (prev + 1) % wordsData.length)
        setShowTranslation(false)
    }

    const generateQuiz = () => {
        // Filtrer les mots selon le niveau choisi
        const filteredWords = wordsData.filter(w => w.difficulty === quizLevel)
        const word = filteredWords.length > 0 ? filteredWords[Math.floor(Math.random() * filteredWords.length)] : wordsData[Math.floor(Math.random() * wordsData.length)]
        const quiz = exerciseGenerator.generateMultipleChoice(word)
        setCurrentQuiz(quiz)
        setSelectedAnswer('')
        setShowResult(false)
    }

    const startConversation = () => {
        const conversation = conversationGenerator.getRandomScenario()
        setCurrentConversation(conversation)
        setCurrentStep(0)
        setUserResponse('')
        setConversationComplete(false)
    }

    const startListening = () => {
        const randomWord = wordsData[Math.floor(Math.random() * wordsData.length)]
        setListeningWord(randomWord)
        setUserListeningAnswer('')
        setListeningResult(null)
    }

    // Initialisation
    useEffect(() => {
        generateQuiz()
        startConversation()
        startListening()
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br">
            <div className="max-w-4xl mx-auto p-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
                        <Target className="text-blue-600" />
                        EnglishMaster
                    </h1>
                    <p className="text-gray-600">Apprenez l'anglais de manière interactive et amusante</p>
                </div>

                {/* Progress Card */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="text-yellow-500" />
                            Vos Progrès
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{progress.totalPoints}</div>
                                <div className="text-sm text-gray-600">Points totaux</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{progress.wordsLearned}</div>
                                <div className="text-sm text-gray-600">Mots appris</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{progress.currentStreak}</div>
                                <div className="text-sm text-gray-600">Série actuelle</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-600">{progress.achievements?.length || 0}</div>
                                <div className="text-sm text-gray-600">Succès</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Tabs */}
                <Tabs value={currentExercise} onValueChange={setCurrentExercise}>
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="flashcards">
                            <BookOpen className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Cartes mémoire</span>
                            <span className="sm:hidden">Cartes</span>
                        </TabsTrigger>
                        <TabsTrigger value="quiz">
                            <Brain className="w-4 h-4 mr-2" />
                            Quiz
                        </TabsTrigger>
                        <TabsTrigger value="conversation">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Conversation</span>
                            <span className="sm:hidden">Parler</span>
                        </TabsTrigger>
                        <TabsTrigger value="listening">
                            <Volume2 className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Écoute</span>
                            <span className="sm:hidden">Écouter</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Flashcards */}
                    <TabsContent value="flashcards">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mode Cartes Mémoire</CardTitle>
                                <CardDescription>
                                    Cliquez sur la carte pour révéler la traduction
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* <div className="text-center">
                                    <Badge variant="secondary" className="mb-4">
                                        {currentWordIndex + 1} / {wordsData.length}
                                    </Badge>
                                </div> */}

                                <div
                                    className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg border-2 border-blue-200 cursor-pointer transition-all hover:scale-105 min-h-200"
                                    onClick={() => setShowTranslation(!showTranslation)}
                                >
                                    <div className="text-center">
                                        <h2 className="text-3xl font-bold mb-4 text-gray-800">
                                            {wordsData[currentWordIndex]?.word}
                                        </h2>
                                        <p className="text-gray-600 mb-2">
                                            {wordsData[currentWordIndex]?.pronunciation}
                                        </p>
                                        {/* <Badge variant="secondary" className="mb-4">
                                            {wordsData[currentWordIndex]?.partOfSpeech}
                                        </Badge> */}

                                        {showTranslation && (
                                            <div className="mt-6 animate-fade-in">
                                                <h3 className="text-2xl font-semibold text-blue-600 mb-2">
                                                    {wordsData[currentWordIndex]?.translation}
                                                </h3>
                                                <p className="text-gray-700 mb-2">
                                                    {wordsData[currentWordIndex]?.definition}
                                                </p>
                                                <div className="bg-white p-4 rounded-lg mt-4">
                                                    <p className="font-medium">Exemple :</p>
                                                    <p className="italic">"{wordsData[currentWordIndex]?.example}"</p>
                                                    <p className="text-gray-600 text-sm mt-1">
                                                        {wordsData[currentWordIndex]?.exampleTranslation}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <Button
                                        variant="secondary"
                                        onClick={() => setCurrentWordIndex((prev) => prev > 0 ? prev - 1 : wordsData.length - 1)}
                                    >
                                        ← Précédent
                                    </Button>
                                    <Button onClick={nextCard}>
                                        Suivant →
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Quiz */}
                    <TabsContent value="quiz">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mode Quiz</CardTitle>
                                <CardDescription>
                                    Choisissez la bonne traduction
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="mb-4">
                                    <label htmlFor="quiz-level" className="font-semibold mr-2">Niveau :</label>
                                    <select
                                        id="quiz-level"
                                        value={quizLevel}
                                        onChange={e => setQuizLevel(e.target.value)}
                                        className="border rounded px-2 py-1"
                                    >
                                        <option value="beginner">Débutant</option>
                                        <option value="intermediate">Intermédiaire</option>
                                        <option value="advanced">Avancé</option>
                                    </select>
                                    <Button variant="secondary" className="ml-4" onClick={generateQuiz}>
                                        Nouveau Quiz
                                    </Button>
                                </div>
                                {currentQuiz && (
                                    <>
                                        <div className="text-center">
                                            <h2 className="text-2xl font-bold mb-2">{currentQuiz.question}</h2>
                                            <p className="text-gray-600">{currentQuiz.explanation}</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-2">
                                            {currentQuiz.answers?.map((option, index) => (
                                                <Button
                                                    key={index}
                                                    variant={selectedAnswer === option ? "default" : "secondary"}
                                                    className="text-left justify-start h-auto p-4"
                                                    onClick={() => setSelectedAnswer(option)}
                                                    disabled={showResult}
                                                >
                                                    {option}
                                                </Button>
                                            ))}
                                        </div>

                                        <div className="flex gap-2 mt-2">
                                            <Button
                                                onClick={() => setShowResult(true)}
                                                disabled={!selectedAnswer || showResult}
                                            >
                                                Vérifier
                                            </Button>
                                        </div>

                                        {showResult && (
                                            <div className={`p-4 rounded-lg ${selectedAnswer === currentQuiz.correctAnswer ? 'bg-green-100' : 'bg-red-100'}`}>
                                                <p className="font-medium">
                                                    {selectedAnswer === currentQuiz.correctAnswer ? '✅ Correct !' : '❌ Incorrect'}
                                                </p>
                                                <p>La bonne réponse est : <strong>{currentQuiz.correctAnswer}</strong></p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Conversation */}
                    <TabsContent value="conversation">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mode Conversation</CardTitle>
                                <CardDescription>
                                    Pratiquez des dialogues en anglais
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {currentConversation && (
                                    <>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-semibold mb-2">{currentConversation.title}</h3>
                                            <p className="text-sm text-gray-600">{currentConversation.context}</p>
                                        </div>

                                        <div className="space-y-2">
                                            {currentConversation.steps?.slice(0, currentStep + 1).map((step, index) => (
                                                <div key={index} className="flex flex-col space-y-2">
                                                    <div className="bg-blue-100 p-3 rounded-lg ml-8">
                                                        <strong>Partenaire:</strong> {step.prompt}
                                                    </div>
                                                    {index === currentStep && !conversationComplete && (
                                                        <div className="space-y-2">
                                                            <Input
                                                                placeholder="Votre réponse en anglais..."
                                                                value={userResponse}
                                                                onChange={(e) => setUserResponse(e.target.value)}
                                                            />
                                                            <Button
                                                                onClick={() => {
                                                                    if (currentStep < currentConversation.steps.length - 1) {
                                                                        setCurrentStep(currentStep + 1)
                                                                        setUserResponse('')
                                                                    } else {
                                                                        setConversationComplete(true)
                                                                    }
                                                                }}
                                                                disabled={!userResponse.trim()}
                                                            >
                                                                {currentStep < currentConversation.steps.length - 1 ? 'Continuer' : 'Terminer'}
                                                            </Button>
                                                        </div>
                                                    )}
                                                    {index < currentStep && (
                                                        <div className="bg-green-100 p-3 rounded-lg mr-8">
                                                            <strong>Vous:</strong> [Votre réponse]
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {conversationComplete && (
                                            <div className="bg-green-100 p-4 rounded-lg">
                                                <p className="font-medium">🎉 Conversation terminée !</p>
                                                <Button className="mt-2" onClick={startConversation}>
                                                    Nouvelle conversation
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Listening */}
                    <TabsContent value="listening">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mode Écoute</CardTitle>
                                <CardDescription>
                                    Écoutez et écrivez ce que vous entendez
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {listeningWord && (
                                    <>
                                        <div className="text-center">
                                            <Button
                                                size="lg"
                                                onClick={() => {
                                                    if ('speechSynthesis' in window) {
                                                        const utterance = new SpeechSynthesisUtterance(listeningWord.word)
                                                        utterance.lang = 'en-US'
                                                        utterance.rate = 0.8
                                                        speechSynthesis.speak(utterance)
                                                    }
                                                }}
                                            >
                                                <Volume2 className="w-6 h-6 mr-2" />
                                                Écouter le mot
                                            </Button>
                                        </div>

                                        <div className="space-y-2">
                                            <Input
                                                placeholder="Écrivez ce que vous entendez..."
                                                value={userListeningAnswer}
                                                onChange={(e) => setUserListeningAnswer(e.target.value)}
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => {
                                                        const isCorrect = userListeningAnswer.toLowerCase().trim() === listeningWord.word.toLowerCase()
                                                        setListeningResult(isCorrect)
                                                    }}
                                                    disabled={!userListeningAnswer.trim() || listeningResult !== null}
                                                >
                                                    Vérifier
                                                </Button>
                                                <Button variant="secondary" onClick={startListening}>
                                                    Nouveau mot
                                                </Button>
                                            </div>
                                        </div>

                                        {listeningResult !== null && (
                                            <div className={`p-4 rounded-lg ${listeningResult ? 'bg-green-100' : 'bg-red-100'}`}>
                                                <p className="font-medium">
                                                    {listeningResult ? '✅ Correct !' : '❌ Incorrect'}
                                                </p>
                                                <p>Le mot était : <strong>{listeningWord.word}</strong></p>
                                                <p>Traduction : {listeningWord.translation}</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default App
