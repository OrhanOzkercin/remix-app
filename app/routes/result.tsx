import { useNavigate, useLocation, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Target, Keyboard, RotateCcw, Gauge, Zap } from "lucide-react";
import { cn } from "~/lib/utils";
import { AnimatedBackground } from "~/components/animated-background";
import type { LoaderFunction } from "@remix-run/node";
import { getRecentTestResults, getBestResults } from "~/models/test-result.server";
import { json } from "@remix-run/node";

interface TestResult {
  wpm: number;
  accuracy: number;
  correctWords: number;
  totalTypedWords: number;
  difficulty: string;
}

interface DatabaseResult extends TestResult {
  id: string;
  createdAt: string;
}

type LoaderData = {
  recentResults: DatabaseResult[];
  bestResults: DatabaseResult[];
};

export const loader: LoaderFunction = async () => {
  try {
    const [recentResults, bestResults] = await Promise.all([
      getRecentTestResults(5),
      getBestResults()
    ]);
    
    return json<LoaderData>({ recentResults, bestResults });
  } catch (error) {
    console.error("Failed to load results:", error);
    return json<LoaderData>({ recentResults: [], bestResults: [] });
  }
};

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state as TestResult;
  const { recentResults, bestResults } = useLoaderData<LoaderData>();

  // Format date to a readable string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSpeedRating = (wpm: number) => {
    if (wpm < 20) return { text: "Beginner", color: "text-zinc-500" };
    if (wpm < 40) return { text: "Intermediate", color: "text-blue-500" };
    if (wpm < 60) return { text: "Above Average", color: "text-green-500" };
    if (wpm < 80) return { text: "Fast", color: "text-yellow-500" };
    return { text: "Professional", color: "text-purple-500" };
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="transition-opacity duration-1000">
        <AnimatedBackground />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center min-h-screen px-4 space-y-12">
          {result ? (
            <>
              <div className="space-y-4 text-center">
                <h1 className="text-4xl font-mono font-bold">
                  Test Complete!
                </h1>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Zap className={cn("w-5 h-5", getSpeedRating(result.wpm).color)} />
                    <p className={cn("text-xl font-mono", getSpeedRating(result.wpm).color)}>
                      {getSpeedRating(result.wpm).text} Typist
                    </p>
                  </div>
                  <p className="text-sm font-mono text-muted-foreground capitalize">
                    {result.difficulty} Difficulty
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl">
                <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 border shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <div className="flex flex-col items-center space-y-2">
                    <Gauge className="w-8 h-8 text-primary" />
                    <h2 className="text-sm font-mono text-muted-foreground">Words per Minute</h2>
                    <p className="text-3xl font-mono font-bold text-primary">{result.wpm}</p>
                    <p className="text-sm font-mono text-muted-foreground">{result.wpm * 5} CPM</p>
                  </div>
                </div>

                <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 border shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <div className="flex flex-col items-center space-y-2">
                    <Target className="w-8 h-8 text-green-500" />
                    <h2 className="text-sm font-mono text-muted-foreground">Accuracy</h2>
                    <p className="text-3xl font-mono font-bold text-green-500">{result.accuracy}%</p>
                    <p className="text-sm font-mono text-muted-foreground">{result.correctWords} correct words</p>
                  </div>
                </div>

                <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 border shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <div className="flex flex-col items-center space-y-2">
                    <Keyboard className="w-8 h-8 text-blue-500" />
                    <h2 className="text-sm font-mono text-muted-foreground">Words Typed</h2>
                    <p className="text-3xl font-mono font-bold text-blue-500">{result.totalTypedWords}</p>
                    <p className="text-sm font-mono text-muted-foreground">{Math.round(result.totalTypedWords / 60)} words/sec</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4 text-center">
              <h1 className="text-4xl font-mono font-bold">
                Typing History
              </h1>
              <p className="text-sm font-mono text-muted-foreground">
                View your recent and best typing test results
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 border">
              <h3 className="font-mono text-lg font-bold mb-4">Recent Tests</h3>
              <div className="space-y-2">
                {recentResults.length > 0 ? (
                  recentResults.map((result) => (
                    <div 
                      key={result.id}
                      className="flex justify-between items-center p-2 rounded bg-background/50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{result.wpm} WPM</span>
                        <span className="text-sm text-muted-foreground capitalize">
                          ({result.difficulty})
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(result.createdAt)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center">No recent tests</p>
                )}
              </div>
            </div>
            
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 border">
              <h3 className="font-mono text-lg font-bold mb-4">Best Results</h3>
              <div className="space-y-2">
                {bestResults.length > 0 ? (
                  bestResults.map((result) => (
                    <div 
                      key={result.id}
                      className="flex justify-between items-center p-2 rounded bg-background/50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{result.wpm} WPM</span>
                        <span className="text-sm text-muted-foreground capitalize">
                          ({result.difficulty})
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(result.createdAt)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center">No best results yet</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => navigate("/test")}
              className="font-mono group"
              size="lg"
            >
              <RotateCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
              {result ? "Try Again" : "Start New Test"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 