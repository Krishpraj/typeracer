"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

type Theme = "minimal" | "cyberpunk" | "nature" | "ocean" | "sunset" | "matrix" | "neon"
type GameMode = "zen" | "sprint" | "marathon" | "precision"

interface GameStats {
  wpm: number
  accuracy: number
  timeLeft: number
  progress: number
  errors: number
}

const themes = {
  minimal: {
    name: "Minimal",
    bg: "bg-white dark:bg-gray-950",
    card: "bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur border-gray-200 dark:border-gray-800",
    accent: "text-gray-900 dark:text-gray-100",
    description: "Pure focus",
    special: "",
  },
  cyberpunk: {
    name: "Cyberpunk",
    bg: "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900",
    card: "bg-slate-800/30 backdrop-blur border-cyan-500/30",
    accent: "text-cyan-400",
    description: "Neon future",
    special: "cyberpunk-effects",
  },
  matrix: {
    name: "Matrix",
    bg: "bg-black",
    card: "bg-green-950/20 backdrop-blur border-green-500/30",
    accent: "text-green-400",
    description: "Digital rain",
    special: "matrix-effects",
  },
  nature: {
    name: "Forest",
    bg: "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950 dark:via-green-950 dark:to-teal-950",
    card: "bg-white/60 dark:bg-green-900/20 backdrop-blur border-green-200 dark:border-green-800",
    accent: "text-emerald-700 dark:text-emerald-400",
    description: "Natural calm",
    special: "nature-effects",
  },
  ocean: {
    name: "Ocean",
    bg: "bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 dark:from-blue-950 dark:via-sky-950 dark:to-cyan-950",
    card: "bg-white/50 dark:bg-blue-900/20 backdrop-blur border-blue-200 dark:border-blue-800",
    accent: "text-blue-600 dark:text-blue-400",
    description: "Deep waters",
    special: "ocean-effects",
  },
  sunset: {
    name: "Sunset",
    bg: "bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 dark:from-orange-950 dark:via-pink-950 dark:to-purple-950",
    card: "bg-white/40 dark:bg-orange-900/20 backdrop-blur border-orange-200 dark:border-orange-800",
    accent: "text-orange-600 dark:text-orange-400",
    description: "Golden hour",
    special: "sunset-effects",
  },
  neon: {
    name: "Neon",
    bg: "bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900",
    card: "bg-black/40 backdrop-blur border-pink-500/30",
    accent: "text-pink-400",
    description: "Electric vibes",
    special: "neon-effects",
  },
}

const gameModes = {
  zen: {
    name: "Zen Mode",
    description: "No timer, just flow",
    duration: null,
    showErrors: false,
  },
  sprint: {
    name: "Sprint",
    description: "60 seconds of speed",
    duration: 60,
    showErrors: true,
  },
  marathon: {
    name: "Marathon",
    description: "5 minutes endurance",
    duration: 300,
    showErrors: true,
  },
  precision: {
    name: "Precision",
    description: "Accuracy focused",
    duration: 120,
    showErrors: true,
  },
}

const sampleTexts = {
  zen: [
    "breathe deeply and let your fingers dance across the keys with gentle precision",
    "in the quiet space between thoughts we find our natural rhythm and flow",
    "each keystroke is a meditation a moment of presence in the digital realm",
    "typing becomes poetry when we surrender to the natural cadence of language",
  ],
  technical: [
    "function createBeautifulCode() { return art.meets(logic).with(passion); }",
    "const wisdom = experience.map(mistake => lesson).filter(truth => applicable);",
    "while (learning) { practice(); grow(); repeat(); } // the developer's journey",
    "import creativity from 'imagination'; export solutions to 'world';",
  ],
  philosophical: [
    "we are what we repeatedly do excellence then is not an act but a habit",
    "the journey of a thousand miles begins with a single step forward",
    "in the midst of winter i found there was within me an invincible summer",
    "what lies behind us and what lies before us are tiny matters compared to what lies within us",
  ],
  nature: [
    "morning dew glistens on emerald leaves as sunlight filters through ancient trees",
    "ocean waves whisper secrets to the shore in an eternal dance of tides",
    "mountain peaks pierce clouded skies while valleys cradle streams below",
    "wildflowers paint meadows in colors that no artist could ever capture",
  ],
}

export default function TypingRacingGame() {
  const [currentTheme, setCurrentTheme] = useState<Theme>("minimal")
  const [gameMode, setGameMode] = useState<GameMode>("zen")
  const [gameState, setGameState] = useState<"menu" | "playing" | "finished">("menu")
  const [currentText, setCurrentText] = useState("")
  const [userInput, setUserInput] = useState("")
  const [stats, setStats] = useState<GameStats>({ wpm: 0, accuracy: 100, timeLeft: 0, progress: 0, errors: 0 })
  const [startTime, setStartTime] = useState<number | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [darkMode, setDarkMode] = useState(false)
  const [textCategory, setTextCategory] = useState<keyof typeof sampleTexts>("zen")

  const startGame = useCallback(() => {
    const texts = sampleTexts[textCategory]
    const randomText = texts[Math.floor(Math.random() * texts.length)]
    setCurrentText(randomText)
    setUserInput("")
    setCurrentIndex(0)
    setStartTime(Date.now())

    const mode = gameModes[gameMode]
    setStats({
      wpm: 0,
      accuracy: 100,
      timeLeft: mode.duration || 0,
      progress: 0,
      errors: 0,
    })
    setGameState("playing")
  }, [gameMode, textCategory])

  const resetGame = useCallback(() => {
    setGameState("menu")
    setUserInput("")
    setCurrentIndex(0)
    setStartTime(null)
  }, [])

  useEffect(() => {
    if (gameState === "playing" && startTime) {
      const timer = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000
        const mode = gameModes[gameMode]

        const timeLeft = mode.duration ? Math.max(0, mode.duration - elapsed) : elapsed

        if (mode.duration && timeLeft === 0) {
          setGameState("finished")
          return
        }

        const wordsTyped = userInput
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0).length
        const wpm = elapsed > 0 ? Math.round((wordsTyped / elapsed) * 60) : 0
        const progress = (currentIndex / currentText.length) * 100

        let correctChars = 0
        let errors = 0
        for (let i = 0; i < Math.min(userInput.length, currentText.length); i++) {
          if (userInput[i] === currentText[i]) {
            correctChars++
          } else {
            errors++
          }
        }
        const accuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 100

        setStats({ wpm, accuracy, timeLeft, progress, errors })
      }, 100)

      return () => clearInterval(timer)
    }
  }, [gameState, startTime, userInput, currentText, currentIndex, gameMode])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (gameState !== "playing") return

    const value = e.target.value
    setUserInput(value)
    setCurrentIndex(value.length)

    if (value === currentText) {
      setGameState("finished")
    }
  }

  const getCharacterClass = (index: number) => {
    if (index >= userInput.length) return "text-muted-foreground/60"
    if (userInput[index] === currentText[index])
      return "text-green-600 bg-green-100/50 dark:text-green-400 dark:bg-green-900/30"
    return "text-red-600 bg-red-100/50 dark:text-red-400 dark:bg-red-900/30"
  }

  const themeConfig = themes[currentTheme]

  return (
    <div className={`min-h-screen transition-all duration-1000 ${themeConfig.bg} ${darkMode ? "dark" : ""}`}>
      {themeConfig.special === "matrix-effects" && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-green-400 font-mono text-sm matrix-rain opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              {String.fromCharCode(0x30a0 + Math.random() * 96)}
            </div>
          ))}
        </div>
      )}

      {themeConfig.special === "neon-effects" && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-pink-400 rounded-full glow-pulse opacity-40 float"></div>
          <div className="absolute top-3/4 right-1/3 w-2 h-2 bg-cyan-400 rounded-full glow-pulse opacity-60 float"></div>
          <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-purple-400 rounded-full glow-pulse opacity-50 float"></div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className={`text-4xl font-bold mb-2 font-mono ${themeConfig.accent}`}>ZenType</h1>
            <p className="text-muted-foreground">Aesthetic typing experience</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="dark-mode">Dark</Label>
              <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            <Select value={currentTheme} onValueChange={(value: Theme) => setCurrentTheme(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(themes).map(([key, theme]) => (
                  <SelectItem key={key} value={key}>
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Game Area */}
        {gameState === "menu" && (
          <div className="space-y-6">
            <Card className={`${themeConfig.card} p-6`}>
              <h2 className="text-xl font-semibold mb-4 font-mono">Game Mode</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {Object.entries(gameModes).map(([key, mode]) => (
                  <Button
                    key={key}
                    variant={gameMode === key ? "default" : "outline"}
                    onClick={() => setGameMode(key as GameMode)}
                    className="flex flex-col h-auto p-4 space-y-2"
                  >
                    <span className="font-medium">{mode.name}</span>
                    <span className="text-xs opacity-70">{mode.description}</span>
                  </Button>
                ))}
              </div>
            </Card>

            <Card className={`${themeConfig.card} p-6`}>
              <h2 className="text-xl font-semibold mb-4 font-mono">Text Style</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.keys(sampleTexts).map((category) => (
                  <Button
                    key={category}
                    variant={textCategory === category ? "default" : "outline"}
                    onClick={() => setTextCategory(category as keyof typeof sampleTexts)}
                    className="capitalize"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </Card>

            <Card className={`${themeConfig.card} p-8 text-center`}>
              <h2 className="text-2xl font-semibold mb-4 font-mono">Ready to Flow?</h2>
              <p className="text-muted-foreground mb-6">
                {gameModes[gameMode].description} • {textCategory} texts
              </p>
              <Button onClick={startGame} size="lg" className="glow-pulse font-mono">
                Begin Journey
              </Button>
            </Card>
          </div>
        )}

        {gameState === "playing" && (
          <div className="space-y-6">
            <Card className={`${themeConfig.card} p-4`}>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div>
                  <div className={`text-2xl font-bold font-mono ${themeConfig.accent}`}>{stats.wpm}</div>
                  <div className="text-sm text-muted-foreground">WPM</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold font-mono ${themeConfig.accent}`}>{stats.accuracy}%</div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                </div>
                {gameModes[gameMode].duration && (
                  <div>
                    <div className={`text-2xl font-bold font-mono ${themeConfig.accent}`}>
                      {Math.ceil(stats.timeLeft)}
                    </div>
                    <div className="text-sm text-muted-foreground">Seconds</div>
                  </div>
                )}
                {gameModes[gameMode].showErrors && (
                  <div>
                    <div className={`text-2xl font-bold font-mono ${themeConfig.accent}`}>{stats.errors}</div>
                    <div className="text-sm text-muted-foreground">Errors</div>
                  </div>
                )}
                <div className={gameModes[gameMode].duration ? "md:col-span-1 col-span-2" : "md:col-span-2 col-span-2"}>
                  <Progress value={stats.progress} className="h-3 mb-1" />
                  <div className="text-sm text-muted-foreground">Progress</div>
                </div>
              </div>
            </Card>

            <Card className={`${themeConfig.card} p-6`}>
              <div className="mb-4 p-6 bg-muted/20 rounded-lg font-mono text-lg leading-relaxed tracking-wide">
                {currentText.split("").map((char, index) => (
                  <span key={index} className={`${getCharacterClass(index)} transition-colors duration-150`}>
                    {char}
                  </span>
                ))}
              </div>

              <textarea
                value={userInput}
                onChange={handleInputChange}
                placeholder="Begin typing..."
                className="w-full h-32 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background/50 font-mono text-lg tracking-wide"
                autoFocus
              />

              <div className="flex justify-between items-center mt-4">
                <Badge variant="outline" className="font-mono">
                  {gameModes[gameMode].name} • {textCategory}
                </Badge>
                <Button variant="outline" onClick={resetGame} className="font-mono bg-transparent">
                  Reset
                </Button>
              </div>
            </Card>
          </div>
        )}

        {gameState === "finished" && (
          <Card className={`${themeConfig.card} p-8 text-center`}>
            <h2 className="text-3xl font-bold mb-4 font-mono">Session Complete</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="p-4 bg-muted/20 rounded-lg">
                <div className={`text-3xl font-bold font-mono ${themeConfig.accent}`}>{stats.wpm}</div>
                <div className="text-muted-foreground">WPM</div>
              </div>
              <div className="p-4 bg-muted/20 rounded-lg">
                <div className={`text-3xl font-bold font-mono ${themeConfig.accent}`}>{stats.accuracy}%</div>
                <div className="text-muted-foreground">Accuracy</div>
              </div>
              <div className="p-4 bg-muted/20 rounded-lg">
                <div className={`text-3xl font-bold font-mono ${themeConfig.accent}`}>
                  {Math.round(stats.progress)}%
                </div>
                <div className="text-muted-foreground">Progress</div>
              </div>
            </div>

            <div className="space-x-4">
              <Button onClick={startGame} size="lg" className="font-mono">
                Continue
              </Button>
              <Button variant="outline" onClick={resetGame} className="font-mono bg-transparent">
                New Session
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
