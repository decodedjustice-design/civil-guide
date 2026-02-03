import { useState } from 'react';
import { ChevronRight, SkipForward, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EntityQuestion, EntityTags } from '@/hooks/useEntityTags';

interface EntityClarifyingQuestionsProps {
  systemLabel: string;
  questions: EntityQuestion[];
  onComplete: (tags: EntityTags) => void;
  onSkipAll: () => void;
}

export function EntityClarifyingQuestions({
  systemLabel,
  questions,
  onComplete,
  onSkipAll,
}: EntityClarifyingQuestionsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [entityTags, setEntityTags] = useState<EntityTags>({});
  
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex >= questions.length - 1;
  const hasQuestions = questions.length > 0;
  
  if (!hasQuestions || !currentQuestion) {
    return null;
  }
  
  const handleAnswer = (answerId: string) => {
    // Apply the answer to entity tags
    const newTags = currentQuestion.applyAnswer(answerId, entityTags);
    setEntityTags(newTags);
    
    if (isLastQuestion) {
      onComplete(newTags);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };
  
  const handleSkip = () => {
    if (isLastQuestion) {
      onComplete(entityTags);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };
  
  const handleSkipAllQuestions = () => {
    onSkipAll();
  };
  
  return (
    <div className="rounded-2xl bg-muted/30 border border-border p-6 mb-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              A few quick questions about your {systemLabel} situation
            </p>
            <p className="text-xs text-muted-foreground">
              Question {currentIndex + 1} of {questions.length} • Optional
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSkipAllQuestions}
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
      </div>
      
      {/* Options */}
      <div className="space-y-2 mb-4">
        {currentQuestion.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleAnswer(option.id)}
            className="w-full p-3 rounded-xl bg-background border border-border hover:border-primary/50 hover:bg-primary/5 text-left transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {option.label}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        ))}
      </div>
      
      {/* Skip link */}
      <button
        onClick={handleSkip}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Skip this question
      </button>
      
      {/* Reassurance */}
      <p className="mt-4 text-xs text-muted-foreground italic">
        These questions help us understand your situation better. All answers are optional and kept private.
      </p>
    </div>
  );
}
