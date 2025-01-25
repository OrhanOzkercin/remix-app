import { useState, useEffect } from "react";
import { AnimatedBackground } from "~/components/animated-background";
import { Button } from "~/components/ui/button";
import { Timer, RefreshCcw, Dumbbell } from "lucide-react";
import { cn } from "~/lib/utils";
import { useFocusMode } from "~/contexts/focus-mode-context";
import { getTextsByDifficulty, type TypingText } from "~/data/typing-texts";
import { useNavigate, useSubmit, useActionData } from "@remix-run/react";
import { useToast } from "~/components/ui/use-toast";

type ActionData = {
  error?: string;
  success?: boolean;
};

type Difficulty = 'easy' | 'medium' | 'hard';

const TIME_LIMIT = 60; // 60 seconds for testing

export default function TestPage() {
  const [isStarted, setIsStarted] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [currentText, setCurrentText] = useState<TypingText | null>(null);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const { setFocusMode } = useFocusMode();
  const [completedWords, setCompletedWords] = useState<{ word: string; isCorrect: boolean }[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isActive, setIsActive] = useState(false);
  const [totalTypedWords, setTotalTypedWords] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const navigate = useNavigate();
  const submit = useSubmit();
  const { toast } = useToast();
  const actionData = useActionData<ActionData>();
  const [isSaving, setIsSaving] = useState(false);

  // Manage focus mode based on test state
  useEffect(() => {
    setFocusMode(isStarted);
    return () => setFocusMode(false);
  }, [isStarted, setFocusMode]);

  // Timer logic
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            handleTestComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isActive, timeLeft]);

  // Start timer when user starts typing
  useEffect(() => {
    if (typedText.length === 1 && !isActive) {
      setIsActive(true);
    }
  }, [typedText, isActive]);

  // Add countdown effect
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      setCountdown(null);
      setIsStarted(true);
      setCurrentLineIndex(0);
      setCurrentWordIndex(0);
      setTypedText("");
      setTimeLeft(TIME_LIMIT);
      setIsActive(false);
      setTotalTypedWords(0);
      setCorrectWords(0);
      return;
    }

    const timeoutId = setTimeout(() => {
      setCountdown(prev => prev !== null ? prev - 1 : null);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [countdown]);

  // Add this effect to show toast messages from the action
  useEffect(() => {
    if (actionData?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: actionData.error
      });
    } else if (actionData?.success) {
      toast({
        title: "Success",
        description: "Your test results have been saved!"
      });
    }
  }, [actionData, toast]);

  // Add useEffect for focus handling
  useEffect(() => {
    if (isStarted) {
      const textarea = document.querySelector('textarea');
      textarea?.focus();
    }
  }, [isStarted]);

  const handleStart = () => {
    if (!selectedDifficulty) return;
    const texts = getTextsByDifficulty(selectedDifficulty);
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    setCurrentText(randomText);
    setCountdown(3); // Start countdown from 3
  };

  const handleRestart = () => {
    setIsStarted(false);
    setSelectedDifficulty(null);
    setCurrentText(null);
    setCurrentLineIndex(0);
    setCurrentWordIndex(0);
    setTypedText("");
  };

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const typed = e.target.value;
    setTypedText(typed);

    if (!currentText || timeLeft === 0) return;

    const currentLine = currentText.text[currentLineIndex];
    const words = currentLine.split(" ");
    const typedWords = typed.split(" ");
    const lastTypedWord = typedWords[typedWords.length - 1];
    const currentWord = words[currentWordIndex];
    
    // Check if space is pressed (word completed)
    if (typed.endsWith(" ")) {
      // Remove the space from lastTypedWord for comparison
      const completedWord = lastTypedWord || typedWords[typedWords.length - 2] || "";
      const isCorrect = completedWord === currentWord;
      
      setTotalTypedWords(prev => prev + 1);
      if (isCorrect) {
        setCorrectWords(prev => prev + 1);
      }
      
      // Move to next word
      if (currentWordIndex < words.length - 1) {
        setCompletedWords(prev => [...prev, { word: completedWord, isCorrect }]);
        setCurrentWordIndex(prev => prev + 1);
        setTypedText("");
      } 
      // If it's the last word in the line
      else if (currentWordIndex === words.length - 1) {
        setCompletedWords(prev => [...prev, { word: completedWord, isCorrect }]);
        
        // Move to next line if available
        if (currentLineIndex < currentText.text.length - 1) {
          setCurrentLineIndex(prev => prev + 1);
          setCurrentWordIndex(0);
          setCompletedWords([]);
          setTypedText("");
        } else {
          handleTestComplete();
        }
      }
    } 
    // Check if last word in line is completed without space
    else if (currentWordIndex === words.length - 1 && lastTypedWord === currentWord) {
      const isCorrect = lastTypedWord === currentWord;
      setCompletedWords(prev => [...prev, { word: lastTypedWord, isCorrect }]);
      
      // Move to next line if available
      if (currentLineIndex < currentText.text.length - 1) {
        setCurrentLineIndex(prev => prev + 1);
        setCurrentWordIndex(0);
        setCompletedWords([]);
        setTypedText("");
      } else {
        handleTestComplete();
      }
    }
  };

  const handleTestComplete = async () => {
    setIsActive(false);
    
    if (!selectedDifficulty) return;

    const wpm = calculateWPM();
    const accuracy = calculateAccuracy();
    
    console.log("Test completed with results:", {
      wpm,
      accuracy,
      correctWords,
      totalTypedWords,
      difficulty: selectedDifficulty
    });

    const result = {
      wpm,
      accuracy,
      correctWords,
      totalTypedWords,
      difficulty: selectedDifficulty
    };
    
    try {
      setIsSaving(true);
      console.log("Submitting result:", result);
      
      // First submit the data
      await submit(
        result,
        { 
          method: "post",
          action: "/api/test-results",
          encType: "application/json"
        }
      );

      // Then navigate in a separate effect
      setTimeout(() => {
        navigate("/result", { state: result });
      }, 0);
      
    } catch (error) {
      console.error("Save error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your results. Please try again."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const calculateWPM = () => {
    const minutes = (TIME_LIMIT - timeLeft) / 60;
    return Math.round(correctWords / minutes) || 0;
  };

  const calculateAccuracy = () => {
    if (totalTypedWords === 0) return 0;
    return Math.round((correctWords / totalTypedWords) * 100);
  };

  const renderCurrentLine = () => {
    if (!currentText) return null;
    
    const currentLine = currentText.text[currentLineIndex];
    const words = currentLine.split(" ");
    const currentTypedWord = typedText.split(" ").pop() || "";

    return (
      <div className="rounded-lg p-6 font-mono text-lg leading-relaxed bg-background shadow-lg ring-1 ring-primary/10">
        <div className="relative">
          <div className="text-foreground/90 flex flex-wrap gap-2">
            {words.map((word, index) => {
              const isCompleted = index < currentWordIndex;
              const isCurrent = index === currentWordIndex;
              const completedWord = completedWords[index];
              const isCorrectSoFar = isCurrent && 
                word.startsWith(currentTypedWord) && 
                currentTypedWord.length > 0;
              const isIncorrectSoFar = isCurrent && 
                !word.startsWith(currentTypedWord) && 
                currentTypedWord.length > 0;

              return (
                <span
                  key={`${currentLineIndex}-${word}-${index}-${currentText.id}`}
                  className={cn(
                    // Base styles
                    "px-1 rounded transition-colors",
                    // Completed word styles
                    isCompleted && completedWord && (
                      completedWord.isCorrect 
                        ? "bg-green-500/20 text-green-700"
                        : "bg-red-500/20 text-red-700"
                    ),
                    // Current word styles
                    isCurrent && "border-b-2",
                    // Currently typing styles
                    isCorrectSoFar && "bg-green-500/10 text-green-700 border-green-500",
                    isIncorrectSoFar && "bg-red-500/10 text-red-700 border-red-500",
                    isCurrent && !typedText && "bg-primary/10 text-primary border-primary"
                  )}
                >
                  {word}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // First, let's add a helper function to format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden">
      {/* Background with fade effect */}
      {!isStarted && (
        <div className="transition-opacity duration-1000">
          <AnimatedBackground />
        </div>
      )}
      
      <div className={cn(
        "container mx-auto relative z-10 transition-colors duration-700",
        isStarted && "bg-background/40"
      )}>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
          {/* Timer and Stats Bar */}
          <div className={cn(
            "fixed top-20 left-0 right-0 flex justify-center transition-all duration-700",
            // Remove opacity reduction when time is less than 30 seconds
            isStarted && timeLeft > 30 ? "opacity-40 hover:opacity-100" : "opacity-100"
          )}>
            <div className={cn(
              "bg-background/80 backdrop-blur-sm border rounded-full px-6 py-2 flex items-center gap-8",
              // Add pulsing glow effect when time is running low
              timeLeft <= 30 && "ring-2 ring-primary/50 shadow-lg shadow-primary/20"
            )}>
              <div className="flex items-center gap-2">
                <Timer className={cn(
                  "w-4 h-4",
                  timeLeft <= 10 ? "text-red-500" : 
                  timeLeft <= 30 ? "text-yellow-500" : 
                  "text-primary"
                )} />
                <span className={cn(
                  "font-mono text-2xl font-bold",
                  timeLeft <= 10 && "text-red-500 animate-pulse",
                  timeLeft <= 30 && timeLeft > 10 && "text-yellow-500"
                )}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="text-sm font-mono">
                <span className="text-muted-foreground">WPM:</span>{" "}
                {calculateWPM()}
              </div>
              <div className="text-sm font-mono">
                <span className="text-muted-foreground">Accuracy:</span>{" "}
                {calculateAccuracy()}%
              </div>
            </div>
          </div>

          {/* Main Test Area */}
          <div className={cn(
            "w-full max-w-3xl space-y-8 transition-all duration-700",
            isStarted && "backdrop-blur-sm"
          )}>
            {/* Difficulty Selection or Text Display Area */}
            <div className="relative">
              {!isStarted ? (
                <div className="space-y-8">
                  {countdown !== null ? (
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="text-8xl font-mono font-bold text-primary animate-bounce">
                        {countdown}
                      </div>
                      <div className="text-xl font-mono text-muted-foreground">
                        Get ready...
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-mono text-center">Select Difficulty</h2>
                      <div className="flex justify-center gap-4">
                        {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
                          <Button
                            key={difficulty}
                            variant={selectedDifficulty === difficulty ? "default" : "outline"}
                            className={cn(
                              "font-mono capitalize w-32 transition-all",
                              selectedDifficulty === difficulty && "ring-2 ring-primary/20"
                            )}
                            onClick={() => setSelectedDifficulty(difficulty)}
                          >
                            <Dumbbell className="mr-2 h-4 w-4" />
                            {difficulty}
                          </Button>
                        ))}
                      </div>
                      <div className="flex justify-center">
                        <Button
                          size="lg"
                          className="font-mono"
                          disabled={!selectedDifficulty}
                          onClick={handleStart}
                        >
                          Start Test
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Only show current line with highlighted current word */}
                  {renderCurrentLine()}
                </div>
              )}
            </div>

            {/* Input Area */}
            {isStarted && (
              <div className="space-y-4">
                <textarea
                  value={typedText}
                  onChange={handleTyping}
                  className={cn(
                    "w-full h-32 p-4 rounded-lg font-mono resize-none transition-all duration-700",
                    "focus:outline-none focus:ring-2 focus:ring-primary",
                    "bg-background shadow-lg ring-1 ring-primary/10"
                  )}
                  placeholder="Start typing..."
                />
                <div className="flex justify-end gap-4">
                  <Button 
                    variant="outline"
                    onClick={handleRestart}
                    className="font-mono opacity-30 hover:opacity-100 transition-opacity"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Restart
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
