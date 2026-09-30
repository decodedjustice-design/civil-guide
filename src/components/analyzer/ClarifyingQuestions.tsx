import { useState } from 'react';
import { ChevronRight, SkipForward, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClarifyingQuestion, CaseContext } from '@/hooks/useCaseContext';

interface ClarifyingQuestionsProps {
  questions: ClarifyingQuestion[];
  context: Partial<CaseContext>;
  onAnswer: (questionId: string, answer: string) => void;
  onSkip: (questionId: string) => void;
  onComplete: () => void;
}

export function ClarifyingQuestions({
  questions,
  context,
  onAnswer,
  onSkip,
  onComplete,
}: ClarifyingQuestionsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());
  const [customAnswer, setCustomAnswer] = useState('');
  
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex >= questions.length - 1;
  const hasQuestions = questions.length > 0;
  
  if (!hasQuestions) {
    return null;
  }
  
  const handleAnswer = (answerId: string) => {
    if (!currentQuestion) return;
    
    onAnswer(currentQuestion.id, answerId);
    setAnsweredIds(prev => new Set([...prev, currentQuestion.id]));
    
    if (isLastQuestion) {
      onComplete();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };
  
  const handleSkip = () => {
    if (!currentQuestion) return;
    
    onSkip(currentQuestion.id);
    
    if (isLastQuestion) {
      onComplete();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };
  
  const handleSkipAll = () => {
    onComplete();
  };
  
  if (!currentQuestion) {
    return null;
  }
  
  return (
    <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">
              Optional question {currentIndex + 1} of {questions.length}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSkipAll}
          className="text-muted-foreground hover:text-foreground text-xs"
        >
          <SkipForward className="w-3 h-3 mr-1" />
          Skip all
        </Button>
      </div>
      
      {/* Question */}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-foreground mb-2">
          {currentQuestion.question}
        </h3>
        <p className="text-sm text-muted-foreground">
          {currentQuestion.reason}
        </p>
      </div>
      
      {/* Options */}
      <div className="space-y-2 mb-4">
        {currentQuestion.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleAnswer(option.id)}
            className="w-full p-4 rounded-xl bg-background border border-border hover:border-primary/50 hover:bg-primary/5 text-left transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base font-medium text-foreground group-hover:text-primary transition-colors">
                {option.label}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/20 p-4">
        <label className="text-sm font-medium text-foreground block mb-2">
          Or explain in your own words
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          Add a detail that the choices above don't capture. You can say "I don't know" if you're unsure.
        </p>
        <textarea
          value={customAnswer}
          onChange={(e) => setCustomAnswer(e.target.value)}
          placeholder="Tell us what happened, what you know, or what is still unclear…"
          className="w-full min-h-24 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          disabled={!customAnswer.trim()}
          onClick={() => handleAnswer(customAnswer.trim())}
        >
          Add this detail
        </Button>
      </div>

      {/* Skip link */}
      <button
        onClick={handleSkip}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {currentQuestion.skipLabel || 'Skip this question'}
      </button>
      
      {/* Reassurance */}
      <p className="mt-4 text-xs text-muted-foreground italic">
        Answers are optional and help improve resource relevance. You can continue without answering.
      </p>
    </div>
  );
}
