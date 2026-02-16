import { useState } from 'react';
import { ChevronRight, SkipForward, HelpCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EntityQuestion, EntityTags } from '@/hooks/useEntityTags';

interface EntityClarifyingQuestionsProps {
  systemLabel: string;
  questions: EntityQuestion[];
  onComplete: (tags: EntityTags) => void;
  onSkipAll: () => void;
}

type CertaintyLevel = 'know' | 'not_sure' | 'dont_know';

export function EntityClarifyingQuestions({
  systemLabel,
  questions,
  onComplete,
  onSkipAll,
}: EntityClarifyingQuestionsProps) {
  const [answeredCount, setAnsweredCount] = useState(0);
  const [entityTags, setEntityTags] = useState<EntityTags>({});
  const [certaintyMap, setCertaintyMap] = useState<Record<string, CertaintyLevel>>({});
  const [showMoreRevealed, setShowMoreRevealed] = useState(false);

  const hasQuestions = questions.length > 0;
  if (!hasQuestions) return null;

  // Show 2 at a time; reveal rest after interaction
  const INITIAL_VISIBLE = 2;
  const visibleQuestions = showMoreRevealed
    ? questions
    : questions.slice(0, INITIAL_VISIBLE);
  const hasMore = !showMoreRevealed && questions.length > INITIAL_VISIBLE;

  const handleCertainty = (questionId: string, level: CertaintyLevel) => {
    setCertaintyMap(prev => ({ ...prev, [questionId]: level }));

    if (level !== 'know') {
      // Skip this question, count as answered
      setAnsweredCount(prev => {
        const next = prev + 1;
        if (!showMoreRevealed && next >= INITIAL_VISIBLE && questions.length > INITIAL_VISIBLE) {
          setShowMoreRevealed(true);
        }
        return next;
      });
    }
  };

  const handleAnswer = (question: EntityQuestion, answerId: string) => {
    const newTags = question.applyAnswer(answerId, entityTags);
    setEntityTags(newTags);
    setAnsweredCount(prev => {
      const next = prev + 1;
      if (!showMoreRevealed && next >= INITIAL_VISIBLE && questions.length > INITIAL_VISIBLE) {
        setShowMoreRevealed(true);
      }
      return next;
    });
  };

  const handleFinish = () => {
    onComplete(entityTags);
  };

  const allAnswered = answeredCount >= questions.length;

  return (
    <div className="rounded-2xl bg-muted/30 border border-border p-6 mb-6">
      {/* Top message */}
      <p className="text-sm text-muted-foreground mb-4 italic">
        This is a first pass. We'll refine details together.
      </p>

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Help us understand your {systemLabel} situation
            </p>
            <p className="text-xs text-muted-foreground">
              {answeredCount} of {questions.length} answered • Everything is optional
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSkipAll}
          className="text-muted-foreground hover:text-foreground text-xs"
        >
          <SkipForward className="w-3 h-3 mr-1" />
          Skip all
        </Button>
      </div>

      {/* Questions */}
      <div className="space-y-5">
        {visibleQuestions.map((question) => {
          const certainty = certaintyMap[question.id];
          const isAnswered = certainty === 'not_sure' || certainty === 'dont_know' || (certainty === 'know' && answeredCount > 0);

          return (
            <div
              key={question.id}
              className="p-4 rounded-xl bg-background border border-border"
            >
              <h3 className="text-sm font-medium text-foreground mb-2">
                {question.question}
              </h3>

              {!certainty ? (
                <>
                  {/* Certainty selector */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    <button
                      onClick={() => handleCertainty(question.id, 'know')}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/5 transition-all"
                    >
                      I know
                    </button>
                    <button
                      onClick={() => handleCertainty(question.id, 'not_sure')}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/5 transition-all"
                    >
                      I'm not sure
                    </button>
                    <button
                      onClick={() => handleCertainty(question.id, 'dont_know')}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/5 transition-all"
                    >
                      I don't know yet
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    It's okay if you're unsure — this can be clarified later.
                  </p>
                </>
              ) : certainty === 'know' ? (
                <>
                  {/* Show actual options */}
                  <div className="space-y-1.5">
                    {question.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleAnswer(question, option.id)}
                        className="w-full p-2.5 rounded-lg bg-muted/20 border border-border hover:border-primary/50 hover:bg-primary/5 text-left transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                            {option.label}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground italic">
                    It's okay if you're unsure — this can be clarified later.
                  </p>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">
                  No problem — you can revisit this anytime.
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Show more */}
      {hasMore && (
        <button
          onClick={() => setShowMoreRevealed(true)}
          className="mt-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronDown className="w-4 h-4" />
          Show {questions.length - INITIAL_VISIBLE} more questions
        </button>
      )}

      {/* Done button */}
      {(allAnswered || showMoreRevealed) && (
        <div className="mt-5 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFinish}
            className="text-sm"
          >
            Continue
          </Button>
        </div>
      )}

      {/* Reassurance */}
      <p className="mt-4 text-xs text-muted-foreground italic">
        All answers are optional and kept private. You can pause and return anytime.
      </p>
    </div>
  );
}
