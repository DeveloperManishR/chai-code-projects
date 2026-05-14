import { useNavigate } from "react-router"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod/v4"
import { motion } from "framer-motion"
import { Loader2, Plus, Save, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

const optionSchema = z.object({
  text: z.string().min(1, "Option text is required").trim(),
})

const questionSchema = z.object({
  question: z.string().min(1, "Question is required").trim(),
  options: z
    .array(optionSchema)
    .min(2, "At least 2 options are required"),
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
  questions: z
    .array(questionSchema)
    .min(1, "At least one question is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  expiryTime: z.string().min(1, "Expiry time is required"),
})

type CreatePollForm = z.infer<typeof createPollFormSchema>

export default function CreatePollPage() {
  const navigate = useNavigate()
  const createMutation = useCreatePoll()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreatePollForm>({
    resolver: zodResolver(createPollFormSchema),
    defaultValues: {
      title: "",
      description: "",
      questions: [
        {
          question: "",
          options: [{ text: "" }, { text: "" }],
        },
      ],
      expiryDate: "",
      expiryTime: "",
    },
  })

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({ control, name: "questions" })

  const onSubmit = async (data: CreatePollForm) => {
    const expiryTime = new Date(
      `${data.expiryDate}T${data.expiryTime}`,
    ).toISOString()

    if (new Date(expiryTime) <= new Date()) {
      toast.error("Expiry time must be in the future")
      return
    }

    try {
      const poll = await createMutation.mutateAsync({
        title: data.title,
        description: data.description,
        questions: data.questions,
        expiryTime,
      })
      toast.success("Poll created successfully!")
      navigate(`/polls/${poll._id}`)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to create poll."
      toast.error(message)
    }
  }

  return (
    <motion.div
      className="mx-auto max-w-2xl space-y-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Create a Poll
        </h1>
        <p className="mt-1 text-muted-foreground">
          Fill in the details below to create a new poll.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Poll Details</CardTitle>
            <CardDescription>
              Give your poll a clear title and description.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="What should we decide?"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide more context about this poll…"
                rows={3}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  {...register("expiryDate")}
                />
                {errors.expiryDate && (
                  <p className="text-xs text-destructive">
                    {errors.expiryDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryTime">Expiry Time</Label>
                <Input
                  id="expiryTime"
                  type="time"
                  {...register("expiryTime")}
                />
                {errors.expiryTime && (
                  <p className="text-xs text-destructive">
                    {errors.expiryTime.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Questions</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendQuestion({
                  question: "",
                  options: [{ text: "" }, { text: "" }],
                })
              }
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Add Question
            </Button>
          </div>

          {errors.questions?.message && (
            <p className="text-xs text-destructive">
              {errors.questions.message}
            </p>
          )}

          {questionFields.map((field, qIdx) => (
            <QuestionCard
              key={field.id}
              questionIndex={qIdx}
              control={control}
              register={register}
              errors={errors}
              onRemove={
                questionFields.length > 1
                  ? () => removeQuestion(qIdx)
                  : undefined
              }
            />
          ))}
        </div>

        <Separator />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
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
  )
}

/* ─── Question Card Sub-component ─────────────────────────────────────────── */

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
  } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <CardTitle className="text-base">
            Question {questionIndex + 1}
          </CardTitle>
          {onRemove && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={onRemove}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`q-${questionIndex}`}>Question text</Label>
            <Input
              id={`q-${questionIndex}`}
              placeholder="Enter your question"
              {...register(`questions.${questionIndex}.question`)}
            />
            {errors.questions?.[questionIndex]?.question && (
              <p className="text-xs text-destructive">
                {errors.questions[questionIndex].question?.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label>Options</Label>
            {errors.questions?.[questionIndex]?.options?.message && (
              <p className="text-xs text-destructive">
                {errors.questions[questionIndex].options?.message}
              </p>
            )}

            {optionFields.map((optField, oIdx) => (
              <div key={optField.id} className="flex items-center gap-2">
                <Input
                  placeholder={`Option ${oIdx + 1}`}
                  {...register(
                    `questions.${questionIndex}.options.${oIdx}.text`,
                  )}
                  className="flex-1"
                />
                {optionFields.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeOption(oIdx)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendOption({ text: "" })}
              className="w-full"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Option
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
