import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Input } from '@/components/ui/input.jsx'
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
  const [feedback, setFeedback] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [conversationStep, setConversationStep] = useState(0)
  const [currentQuiz, setCurrentQuiz] = useState(null)
  const [showAchievement, setShowAchievement] = useState(null)
  const [sessionStartTime] = useState(Date.now())

  const { progress, addWordLearned, incrementScore, incrementAnswered, resetProgress } = useProgress()
  const achievementSystem = new AchievementSystem()
  const conversationGenerator = new ConversationGenerator()
  const performanceAnalyzer = new PerformanceAnalyzer()

  const filteredWords = selectedDifficulty === 'all' 
    ? wordsData 
    : wordsData.filter(word => word.difficulty === selectedDifficulty)

  const currentWord = filteredWords[currentWordIndex] || wordsData[0]
  const exerciseGen = new ExerciseGenerator(filteredWords, progress)

  // Calcul des statistiques
  const progressPercentage = progress.totalAnswered > 0 ? (progress.totalScore / progress.totalAnswered) * 100 : 0
  const sessionTime = Math.floor((Date.now() - sessionStartTime) / 1000 / 60) // en minutes
  const performance = performanceAnalyzer.analyzePerformance(progress, sessionTime * 60)
  const userLevel = achievementSystem.calculateLevel(progress.totalScore * 10 + progress.wordsLearned.length * 50)

  // Vérification des achievements
  useEffect(() => {
    const newAchievements = achievementSystem.checkAchievements(progress)
    if (newAchievements.length > 0) {
      setShowAchievement(newAchievements[0])
      setTimeout(() => setShowAchievement(null), 3000)
    }
  }, [progress])

  const nextWord = () => {
    setCurrentWordIndex((prev) => (prev + 1) % filteredWords.length)
    setShowTranslation(false)
    setUserAnswer('')
    setFeedback('')
    setCurrentQuiz(null)
  }

  const markAsLearned = () => {
    addWordLearned(currentWord.id)
    nextWord()
  }

  const checkAnswer = () => {
    const isCorrect = userAnswer.toLowerCase().trim() === currentWord.translation.toLowerCase()
    setFeedback(isCorrect ? 'Correct ! 🎉' : `Incorrect. La bonne réponse est : ${currentWord.translation}`)
    
    if (isCorrect) {
      incrementScore()
      addWordLearned(currentWord.id)
    } else {
      incrementAnswered()
    }
  }

  const checkQuizAnswer = (selectedAnswer) => {
    const isCorrect = selectedAnswer === currentQuiz.correctAnswer
    setFeedback(isCorrect ? 'Correct ! 🎉' : `Incorrect. La bonne réponse est : ${currentQuiz.correctAnswer}`)
    
    if (isCorrect) {
      incrementScore()
      addWordLearned(currentWord.id)
    } else {
      incrementAnswered()
    }
  }

  const generateNewQuiz = () => {
    const quiz = exerciseGen.generateMultipleChoice(currentWord)
    setCurrentQuiz(quiz)
    setFeedback('')
  }

  const resetAllProgress = () => {
    resetProgress()
    setCurrentWordIndex(0)
    setFeedback('')
    setUserAnswer('')
    setCurrentQuiz(null)
  }

  const speakWord = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const conversationScenario = conversationGenerator.getRandomScenario()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Achievement Notification */}
        {showAchievement && (
          <div className="fixed top-4 right-4 z-50 bg-yellow-400 text-yellow-900 p-4 rounded-lg shadow-lg animate-bounce">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{showAchievement.icon}</span>
              <div>
                <div className="font-bold">{showAchievement.name}</div>
                <div className="text-sm">{showAchievement.description}</div>
                <div className="text-xs">+{showAchievement.points} points</div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <BookOpen className="text-blue-600" />
            EnglishMaster
          </h1>
          <p className="text-gray-600">Apprenez l'anglais avec des exercices interactifs</p>
          <div className="mt-2 flex items-center justify-center gap-4">
            <Badge variant="outline" className="text-lg px-3 py-1">
              Niveau {userLevel.level} - {userLevel.name}
            </Badge>
            <Badge variant="secondary">
              Session: {sessionTime} min
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{progress.totalScore}</div>
              <div className="text-sm text-gray-600">Points</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{progress.wordsLearned.length}</div>
              <div className="text-sm text-gray-600">Mots appris</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{Math.round(progressPercentage)}%</div>
              <div className="text-sm text-gray-600">Précision</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{progress.totalAnswered}</div>
              <div className="text-sm text-gray-600">Réponses</div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Performance globale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{performance.accuracy}%</div>
                <div className="text-sm text-gray-600">Précision</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{performance.speed}%</div>
                <div className="text-sm text-gray-600">Vitesse</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{performance.retention}%</div>
                <div className="text-sm text-gray-600">Rétention</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{performance.consistency}%</div>
                <div className="text-sm text-gray-600">Régularité</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progression globale</span>
              <Button variant="outline" size="sm" onClick={resetAllProgress}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Recommencer
              </Button>
            </div>
            <Progress value={performance.overall} className="w-full mt-2" />
          </CardContent>
        </Card>

        {/* Difficulty Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={selectedDifficulty === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedDifficulty('all')}
                size="sm"
              >
                Tous les niveaux
              </Button>
              {difficulties.map(difficulty => (
                <Button
                  key={difficulty}
                  variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  size="sm"
                >
                  {difficultyLevels[difficulty]?.name || difficulty}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={currentExercise} onValueChange={setCurrentExercise}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="flashcards">
              <span className="hidden sm:inline">Flashcards</span>
              <span className="sm:hidden">🃏</span>
            </TabsTrigger>
            <TabsTrigger value="quiz">
              <span className="hidden sm:inline">Quiz</span>
              <span className="sm:hidden">❓</span>
            </TabsTrigger>
            <TabsTrigger value="conversation">
              <span className="hidden sm:inline">Conversation</span>
              <span className="sm:hidden">💬</span>
            </TabsTrigger>
            <TabsTrigger value="listening">
              <span className="hidden sm:inline">Écoute</span>
              <span className="sm:hidden">👂</span>
            </TabsTrigger>
          </TabsList>

          {/* Flashcards */}
          <TabsContent value="flashcards">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    🃏 Flashcards
                    <Badge variant="outline">+{exerciseTypes.flashcards.points} pts</Badge>
                  </span>
                  <Badge variant="secondary">{currentWord.difficulty}</Badge>
                </CardTitle>
                <CardDescription>
                  Cliquez sur la carte pour révéler la traduction
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div 
                  className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg p-8 text-center cursor-pointer transition-all hover:scale-105 min-h-[200px] flex flex-col justify-center"
                  onClick={() => setShowTranslation(!showTranslation)}
                >
                  <div className="text-3xl font-bold mb-2">{currentWord.word}</div>
                  <div className="text-lg mb-2">{currentWord.pronunciation}</div>
                  <Badge className="mx-auto mb-4">{currentWord.partOfSpeech}</Badge>
                  
                  {showTranslation && (
                    <div className="mt-4 space-y-2 animate-fade-in">
                      <div className="text-2xl font-semibold">{currentWord.translation}</div>
                      <div className="text-sm opacity-90">{currentWord.definition}</div>
                      <div className="text-sm italic">"{currentWord.example}"</div>
                      <div className="text-xs opacity-75">"{currentWord.exampleTranslation}"</div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-4 mt-6">
                  <Button onClick={() => speakWord(currentWord.word)} variant="outline">
                    <Volume2 className="w-4 h-4 mr-2" />
                    Écouter
                  </Button>
                  <Button onClick={nextWord} className="flex-1">
                    Mot suivant
                  </Button>
                  <Button onClick={markAsLearned} variant="outline">
                    <Check className="w-4 h-4 mr-2" />
                    Appris
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quiz */}
          <TabsContent value="quiz">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    ❓ Quiz interactif
                    <Badge variant="outline">+{exerciseTypes.quiz.points} pts</Badge>
                  </span>
                  <Button onClick={generateNewQuiz} size="sm" variant="outline">
                    Nouveau Quiz
                  </Button>
                </CardTitle>
                <CardDescription>
                  Choisissez la bonne traduction
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {!currentQuiz ? (
                  <div className="text-center">
                    <Button onClick={generateNewQuiz} size="lg">
                      Commencer le Quiz
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{currentQuiz.question}</div>
                      <Button 
                        onClick={() => speakWord(currentQuiz.question)} 
                        variant="ghost" 
                        size="sm"
                      >
                        <Volume2 className="w-4 h-4 mr-2" />
                        Écouter
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentQuiz.answers.map((answer, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="p-4 h-auto text-left justify-start"
                          onClick={() => checkQuizAnswer(answer)}
                          disabled={feedback !== ''}
                        >
                          {answer}
                        </Button>
                      ))}
                    </div>

                    {feedback && (
                      <div className={`p-3 rounded-lg ${
                        feedback.includes('Correct') 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {feedback}
                        {feedback.includes('Correct') && (
                          <div className="mt-2 text-sm">
                            <div><strong>Explication :</strong> {currentQuiz.explanation}</div>
                            <div><strong>Exemple :</strong> "{currentQuiz.example}"</div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-4 mt-6">
                      <Button onClick={generateNewQuiz} variant="outline">
                        Nouveau Quiz
                      </Button>
                      <Button onClick={nextWord}>
                        Mot suivant
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conversation */}
          <TabsContent value="conversation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  💬 Pratique de conversation
                  <Badge variant="outline">+{exerciseTypes.conversation.points} pts</Badge>
                </CardTitle>
                <CardDescription>
                  Pratiquez des dialogues du quotidien
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-lg font-semibold text-center mb-6">
                    Scénario : {conversationScenario.name}
                  </div>
                  <div className="text-sm text-gray-600 text-center mb-4">
                    {conversationScenario.context}
                  </div>
                  
                  {conversationScenario.steps.map((step, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg transition-all ${
                        step.speaker === 'waiter' || step.speaker === 'salesperson'
                          ? 'bg-blue-100 ml-8' 
                          : 'bg-gray-100 mr-8'
                      } ${index <= conversationStep ? 'opacity-100' : 'opacity-30'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={step.speaker === 'customer' ? 'default' : 'secondary'}>
                          {step.speaker === 'customer' ? 'Vous' : 'Interlocuteur'}
                        </Badge>
                        {step.audio && (
                          <Button 
                            onClick={() => speakWord(step.english)} 
                            variant="ghost" 
                            size="sm"
                          >
                            <Volume2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="font-medium text-gray-800">{step.english}</div>
                      <div className="text-sm text-gray-600 mt-1">{step.french}</div>
                    </div>
                  ))}

                  <div className="flex gap-4 mt-6">
                    <Button 
                      onClick={() => setConversationStep(Math.max(0, conversationStep - 1))}
                      disabled={conversationStep === 0}
                      variant="outline"
                    >
                      Précédent
                    </Button>
                    <Button 
                      onClick={() => setConversationStep(Math.min(conversationScenario.steps.length - 1, conversationStep + 1))}
                      disabled={conversationStep === conversationScenario.steps.length - 1}
                    >
                      Suivant
                    </Button>
                    <Button 
                      onClick={() => setConversationStep(0)}
                      variant="outline"
                    >
                      Recommencer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Listening */}
          <TabsContent value="listening">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  👂 Exercice d'écoute
                  <Badge variant="outline">+{exerciseTypes.listening.points} pts</Badge>
                </CardTitle>
                <CardDescription>
                  Écoutez et écrivez ce que vous entendez
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Button 
                    onClick={() => speakWord(currentWord.word)} 
                    size="lg"
                    className="mb-4"
                  >
                    <Volume2 className="w-6 h-6 mr-2" />
                    Écouter le mot
                  </Button>
                  <div className="text-sm text-gray-600">
                    Cliquez pour écouter et tapez ce que vous entendez
                  </div>
                </div>

                <div className="space-y-4">
                  <Input
                    placeholder="Tapez ce que vous entendez..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                  />
                  
                  {feedback && (
                    <div className={`p-3 rounded-lg ${
                      feedback.includes('Correct') 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {feedback}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button onClick={checkAnswer} disabled={!userAnswer.trim()}>
                      Vérifier
                    </Button>
                    <Button onClick={nextWord} variant="outline">
                      Mot suivant
                    </Button>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">Indices :</div>
                  <div className="text-sm">Catégorie : {currentWord.category}</div>
                  <div className="text-sm">Type : {currentWord.partOfSpeech}</div>
                  <div className="text-sm">Niveau : {currentWord.difficulty}</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App

