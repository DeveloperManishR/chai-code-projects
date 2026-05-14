import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { PollResultsBar } from "./poll-results-bar"
import type { Question } from "@/types"
import { cn } from "@/lib/utils"

interface PollQuestionProps {
  question: Question
  questionIndex: number
  showResults: boolean
  selectedOption?: number
  onSelect?: (questionIndex: number, optionIndex: number) => void
  disabled?: boolean
}

export function PollQuestion({
  question,
  questionIndex,
  showResults,
  selectedOption,
  onSelect,
  disabled = false,
}: PollQuestionProps) {
  const totalVotes = question.options.reduce((sum, opt) => sum + opt.votes, 0)

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-5 sm:p-6">
      <h3 className="text-base font-semibold text-foreground">
        <span className="mr-2 text-muted-foreground">
          Q{questionIndex + 1}.
        </span>
        {question.question}
      </h3>

      {showResults ? (
        <div className="space-y-2">
          {question.options.map((option, idx) => (
            <PollResultsBar
              key={option._id}
              text={option.text}
              votes={option.votes}
              totalVotes={totalVotes}
              index={idx}
              isSelected={selectedOption === idx}
            />
          ))}
          <p className="pt-1 text-xs text-muted-foreground">
            {totalVotes} total {totalVotes === 1 ? "vote" : "votes"}
          </p>
        </div>
      ) : (
        <RadioGroup
          value={selectedOption?.toString()}
          onValueChange={(value) => onSelect?.(questionIndex, parseInt(value))}
          disabled={disabled}
          className="space-y-2"
        >
          {question.options.map((option, idx) => (
            <Label
              key={option._id}
              htmlFor={`q${questionIndex}-o${idx}`}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-all hover:bg-accent",
                selectedOption === idx
                  ? "border-primary bg-primary/5"
                  : "border-border",
                disabled && "cursor-not-allowed opacity-60",
              )}
            >
              <RadioGroupItem
                value={idx.toString()}
                id={`q${questionIndex}-o${idx}`}
              />
              <span className="text-sm text-foreground">{option.text}</span>
            </Label>
          ))}
        </RadioGroup>
      )}
    </div>
  )
}
