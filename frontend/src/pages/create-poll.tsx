import { useNavigate } from "react-router"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod/v4"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Lock, LockOpen, Plus, Save, Trash2, X, Calendar } from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCreatePoll } from "@/hooks/use-polls"
import { toast } from "sonner"

// ─── Form Schema ─────────────────────────────────────────────────────────────

const optionSchema = z.object({
  text: z.string().min(1, "Option text is required").trim(),
})

const questionSchema = z.object({
  question: z.string().min(1, "Question is required").trim(),
  options: z.array(optionSchema).min(2, "At least 2 options are required"),
})

const createPollFormSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(500, "Description cannot exceed 500 characters"),
  questions: z.array(questionSchema).min(1, "At least one question is required"),
  expiryDateTime: z
    .date()
    .refine((date) => date > new Date(), "Expiry must be in the future"),
  needAuthentication: z.boolean(),
})

type CreatePollForm = z.infer<typeof createPollFormSchema>

// ─── Component ───────────────────────────────────────────────────────────────

export default function CreatePollPage() {
  const navigate = useNavigate()
  const createMutation = useCreatePoll()

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CreatePollForm>({
    resolver: zodResolver(createPollFormSchema),
    defaultValues: {
      title: "",
      description: "",
      questions: [{ question: "", options: [{ text: "" }, { text: "" }] }],
      expiryDateTime: undefined,
      needAuthentication: true,
    },
  })

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({ control, name: "questions" })

  const needAuthentication = watch("needAuthentication")

  const onSubmit = async (data: CreatePollForm) => {
    const expiryTime = data.expiryDateTime.toISOString()

    try {
      const poll = await createMutation.mutateAsync({
        title: data.title,
        description: data.description,
        questions: data.questions,
        expiryTime,
        needAuthentication: data.needAuthentication,
      })
      toast.success("Poll created successfully!")
      navigate(`/polls/${poll._id}`)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to create poll. Please try again."
      toast.error(message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-10 px-4">
      <motion.div
        className="mx-auto max-w-2xl space-y-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Create a Poll
          </h1>
          <p className="text-muted-foreground text-sm">
            Fill in the details below to launch a new poll.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* ── Poll Details ───────────────────────────────────────────────── */}
          <Card className="shadow-md border border-border/50 backdrop-blur-sm bg-card/80">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Poll Details
              </CardTitle>
              <CardDescription>
                Give your poll a clear title and description.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="What should we decide?"
                  {...register("title")}
                  className="transition-all focus:ring-2 focus:ring-primary/30"
                />
                {errors.title && (
                  <p className="text-xs text-destructive">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide more context about this poll…"
                  rows={3}
                  {...register("description")}
                  className="transition-all focus:ring-2 focus:ring-primary/30"
                />
                {errors.description && (
                  <p className="text-xs text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Expiry Date & Time (Unified) */}
              <div className="space-y-2">
                <Label htmlFor="expiryDateTime" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Expiry Date & Time
                </Label>
                <Controller
                  control={control}
                  name="expiryDateTime"
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date: any) => field.onChange(date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="MMMM d, yyyy h:mm aa"
                      minDate={new Date()}
                      placeholderText="Select expiry date and time"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                      wrapperClassName="w-full"
                    />
                  )}
                />
                {errors.expiryDateTime && (
                  <p className="text-xs text-destructive">
                    {errors.expiryDateTime.message}
                  </p>
                )}
              </div>

              <Separator />

              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {needAuthentication ? (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <LockOpen className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Label htmlFor="needAuthentication" className="text-sm font-medium">
                      Require login to vote
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {needAuthentication
                      ? "Only signed-in users can submit a vote."
                      : "Anyone can vote — no account needed."}
                  </p>
                </div>

                <Controller
                  control={control}
                  name="needAuthentication"
                  render={({ field }) => (
                    <Switch
                      id="needAuthentication"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* ── Questions ─────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                Questions
              </h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendQuestion({ question: "", options: [{ text: "" }, { text: "" }] })
                }
                className="shadow-sm hover:shadow transition-shadow"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Add Question
              </Button>
            </div>

            {errors.questions?.message && (
              <p className="text-xs text-destructive">{errors.questions.message}</p>
            )}

            <AnimatePresence mode="popLayout">
              {questionFields.map((field, qIdx) => (
                <motion.div
                  key={field.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.25 }}
                >
                  <QuestionCard
                    questionIndex={qIdx}
                    control={control}
                    register={register}
                    errors={errors}
                    onRemove={
                      questionFields.length > 1 ? () => removeQuestion(qIdx) : undefined
                    }
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Separator />

          {/* ── Actions ───────────────────────────────────────────────────── */}
          <div className="flex justify-end gap-3 sticky bottom-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-border/50 shadow-lg">
            <Button type="button" variant="outline" onClick={() => navigate("/")}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              {createMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Create Poll
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// ─── Question Card Sub-component ─────────────────────────────────────────────

interface QuestionCardProps {
  questionIndex: number
  control: ReturnType<typeof useForm<CreatePollForm>>["control"]
  register: ReturnType<typeof useForm<CreatePollForm>>["register"]
  errors: ReturnType<typeof useForm<CreatePollForm>>["formState"]["errors"]
  onRemove?: () => void
}

function QuestionCard({
  questionIndex,
  control,
  register,
  errors,
  onRemove,
}: QuestionCardProps) {
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({ control, name: `questions.${questionIndex}.options` })

  return (
    <Card className="shadow-sm border border-border/50 hover:shadow-md transition-shadow bg-card/90">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
          Question {questionIndex + 1}
        </CardTitle>
        {onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Question text */}
        <div className="space-y-2">
          <Label htmlFor={`q-${questionIndex}`}>Question text</Label>
          <Input
            id={`q-${questionIndex}`}
            placeholder="Enter your question"
            {...register(`questions.${questionIndex}.question`)}
            className="transition-all focus:ring-2 focus:ring-primary/30"
          />
          {errors.questions?.[questionIndex]?.question && (
            <p className="text-xs text-destructive">
              {errors.questions[questionIndex].question?.message}
            </p>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3">
          <Label>Options</Label>
          {errors.questions?.[questionIndex]?.options?.message && (
            <p className="text-xs text-destructive">
              {errors.questions[questionIndex].options?.message}
            </p>
          )}

          <AnimatePresence mode="popLayout">
            {optionFields.map((optField, oIdx) => (
              <motion.div
                key={optField.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10, transition: { duration: 0.15 } }}
                className="flex items-center gap-2"
              >
                <Input
                  placeholder={`Option ${oIdx + 1}`}
                  {...register(`questions.${questionIndex}.options.${oIdx}.text`)}
                  className="flex-1 transition-all focus:ring-2 focus:ring-primary/30"
                />
                {optionFields.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    onClick={() => removeOption(oIdx)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendOption({ text: "" })}
            className="w-full shadow-sm hover:shadow transition-shadow"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add Option
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}