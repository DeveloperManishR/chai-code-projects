import type { ApiResponse, CreatePollInput, Poll, VoteInput } from "@/types"
import apiClient from "./client"

export async function getPolls(): Promise<Poll[]> {
  const res = await apiClient.get<ApiResponse<Poll[]>>("/api/polls")
  return res.data.data ?? []
}

export async function getPollById(id: string): Promise<Poll> {
  const res = await apiClient.get<ApiResponse<Poll>>(`/api/polls/${id}`)
  if (!res.data.data) throw new Error("Poll not found")
  return res.data.data
}

export async function createPoll(data: CreatePollInput): Promise<Poll> {
  const res = await apiClient.post<ApiResponse<Poll>>("/api/polls", data)
  if (!res.data.data) throw new Error("Failed to create poll")
  return res.data.data
}

export async function votePoll(id: string, data: VoteInput): Promise<Poll> {
  const res = await apiClient.post<ApiResponse<Poll>>(`/api/polls/${id}/vote`, data)
  if (!res.data.data) throw new Error("Failed to record vote")
  return res.data.data
}

export async function deletePoll(id: string): Promise<void> {
  await apiClient.delete(`/api/polls/${id}`)
}
