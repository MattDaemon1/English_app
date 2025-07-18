import { useState } from 'react'
import { Button } from './components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs.jsx'
import { BookOpen, Brain, MessageCircle, Volume2 } from 'lucide-react'
import { wordsData } from './data/words.js'
import { useProgress } from './hooks/useLocalStorage.js'
import { ExerciseGenerator } from './utils/gameLogic.js'
import './App.css'

function App() {
    const [activeTab, setActiveTab] = useState('flashcards')
    const { progress, updateProgress } = useProgress()
    const exerciseGenerator = new ExerciseGenerator(wordsData)

    return (
        <div className="min-h-screen bg-gradient-to-br">
            <div className="max-w-4xl mx-auto p-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">🎯 EnglishMaster</h1>
                    <p className="text-gray-600">Apprendre l'anglais facilement</p>
                </div>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Test des composants UI</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <Button onClick={() => setActiveTab('flashcards')}>
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    Cartes mémoire
                                </Button>
                                <Button onClick={() => setActiveTab('quiz')}>
                                    <Brain className="w-4 h-4 mr-2" />
                                    Quiz
                                </Button>
                                <Button onClick={() => setActiveTab('conversation')}>
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Conversation
                                </Button>
                                <Button onClick={() => setActiveTab('listening')}>
                                    <Volume2 className="w-4 h-4 mr-2" />
                                    Écoute
                                </Button>
                            </div>
                            <p>Onglet actif: {activeTab}</p>
                            <p>Nombre de mots: {wordsData.length}</p>
                            <p>Points totaux: {progress.totalPoints}</p>
                            <p>ExerciseGenerator créé: ✅</p>
                        </div>
                    </CardContent>
                </Card>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="flashcards">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Cartes
                        </TabsTrigger>
                        <TabsTrigger value="quiz">
                            <Brain className="w-4 h-4 mr-2" />
                            Quiz
                        </TabsTrigger>
                        <TabsTrigger value="conversation">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Conversation
                        </TabsTrigger>
                        <TabsTrigger value="listening">
                            <Volume2 className="w-4 h-4 mr-2" />
                            Écoute
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="flashcards">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mode Cartes Mémoire</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Le mode cartes mémoire fonctionne !</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="quiz">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mode Quiz</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Le mode quiz fonctionne !</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="conversation">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mode Conversation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Le mode conversation fonctionne !</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="listening">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mode Écoute</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Le mode écoute fonctionne !</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default App
