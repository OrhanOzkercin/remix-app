import { Link } from "@remix-run/react"
import { Button } from "~/components/ui/button"
import { Keyboard } from "lucide-react"
import { useFocusMode } from "~/contexts/focus-mode-context"
import { cn } from "~/lib/utils"

const Header = () => {
  const { isFocusMode } = useFocusMode()

  return (
    <header className={cn(
      "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-700",
      isFocusMode && "opacity-15 hover:opacity-100 "
    )}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 transition-colors"
          >
            <div className="flex items-center">
              <Keyboard className="h-8 w-8 text-primary rotate-[-10deg] transform" />
              <div className="ml-2">
                <span className="font-mono text-2xl font-bold tracking-tight">
                  Type<span className="text-primary">Speed</span>
                </span>
                <span className="hidden sm:inline-block text-xs tracking-widest uppercase text-muted-foreground ml-1">
                  tester
                </span>
              </div>
            </div>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link to="/test">
              <Button 
                variant="ghost" 
                className="font-mono text-sm tracking-wide hover:text-primary"
              >
                Practice
              </Button>
            </Link>
            <Link to="/result">
              <Button 
                variant="ghost" 
                className="font-mono text-sm tracking-wide hover:text-primary"
              >
                Results
              </Button>
            </Link>
            <Link to="/test">
              <Button 
                className="font-mono text-sm tracking-wide"
                variant="outline"
              >
                Start Test
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header 