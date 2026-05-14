import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createPoll, deletePoll, getPollById, getPolls, votePoll, updatePollStatus } from "@/api/polls.api"
import type { CreatePollInput, VoteInput } from "@/types"

const POLLS_KEY = ["polls"] as const

/** Fetch all polls. */
export function usePolls() {
  return useQuery({
    queryKey: POLLS_KEY,
    queryFn: getPolls,
  })
}

/** Fetch a single poll by ID. */
export function usePoll(id: string) {
  return useQuery({
    queryKey: [...POLLS_KEY, id],
    queryFn: () => getPollById(id),
    enabled: !!id,
  })
}

/** Create a new poll. Invalidates the poll list cache on success. */
export function useCreatePoll() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePollInput) => createPoll(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: POLLS_KEY })
    },
  })
}

/** Vote on a poll. Invalidates both the list and the specific poll cache. */
export function useVotePoll() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: VoteInput }) =>
      votePoll(id, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: POLLS_KEY })
      qc.invalidateQueries({ queryKey: [...POLLS_KEY, variables.id] })
    },
  })
}

export function useDeletePoll() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deletePoll(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: POLLS_KEY })
    },
  })
}

export function useUpdatePollStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "ACTIVE" | "INACTIVE" | "COMPLETED" }) =>
      updatePollStatus(id, status),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: POLLS_KEY })
      qc.invalidateQueries({ queryKey: [...POLLS_KEY, variables.id] })
    },
  })
}
