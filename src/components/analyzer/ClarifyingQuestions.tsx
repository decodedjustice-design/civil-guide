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
    <div className="rounded-2xl bg-muted/30 border border-border p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-accent" />
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
            className="w-full p-3 rounded-xl bg-background border border-border hover:border-accent/50 hover:bg-accent/5 text-left transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                {option.label}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        ))}
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
