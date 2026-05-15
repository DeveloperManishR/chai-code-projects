import * as React from "react"
import {
  Bar, BarChart, CartesianGrid, XAxis, YAxis,
  Cell, PieChart, Pie
} from "recharts"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart3, PieChart as PieChartIcon } from "lucide-react"

import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs,  TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Poll, Question } from "@/types"

// A set of vibrant, distinct colors for the charts
const CHART_COLORS = [
  "#3b82f6", // Blue
  "#8b5cf6", // Violet
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#f43f5e", // Rose
  "#06b6d4", // Cyan
  "#ec4899", // Pink
  "#84cc16", // Lime
]

interface PollAnalyticsProps {
  poll: Poll
}

export function PollAnalytics({ poll }: PollAnalyticsProps) {
  return (
    <div className="space-y-10 py-4">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <span className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-primary/20">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          Poll Analytics
        </h2>
        <p className="text-muted-foreground text-sm max-w-2xl">
          The poll has been closed. Explore the final results with detailed visual analytics.
        </p>
      </div>

      <div className="grid gap-10">
        {poll.questions.map((q, idx) => (
          <QuestionAnalyticsCard key={q._id} question={q} index={idx} />
        ))}
      </div>
    </div>
  )
}

function QuestionAnalyticsCard({ question, index }: { question: Question; index: number }) {
  const [activeTab, setActiveTab] = React.useState<"bar" | "pie">("bar")

  const totalVotes = question.options.reduce((sum, opt) => sum + opt.votes, 0)

  // Sort options by votes descending to make charts look better
  const sortedOptions = [...question.options].sort((a, b) => b.votes - a.votes)

  const chartData = React.useMemo(() => {
    return sortedOptions.map((opt, i) => ({
      name: opt.text,
      votes: opt.votes,
      percentage: totalVotes > 0 ? ((opt.votes / totalVotes) * 100).toFixed(1) : 0,
      fill: CHART_COLORS[i % CHART_COLORS.length]
    }))
  }, [sortedOptions, totalVotes])

  // Chart config Maps name -> color for the Shadcn ChartTooltip
  const chartConfig = React.useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {
      votes: { label: "Votes", color: "hsl(var(--primary))" }
    }
    chartData.forEach((d) => {
      config[d.name] = { label: d.name, color: d.fill }
    })
    return config
  }, [chartData])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
    >
      <Card className="overflow-hidden border-border/50 bg-card shadow-sm transition-all hover:shadow-md">
        {/* Gradient Header Line */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500" />

        <CardHeader className="pb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <CardTitle className="text-xl leading-relaxed font-semibold">
                <span className="text-muted-foreground font-normal mr-2">Q{index + 1}.</span>
                {question.question}
              </CardTitle>
              <CardDescription className="text-base flex items-center gap-2">
                <span className="font-semibold text-foreground">{totalVotes}</span> total {totalVotes === 1 ? "vote" : "votes"}
              </CardDescription>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as "bar" | "pie")}
              className="w-[200px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="bar" className="flex items-center gap-1.5 text-xs">
                  <BarChart3 className="h-3.5 w-3.5" /> Bar
                </TabsTrigger>
                <TabsTrigger value="pie" className="flex items-center gap-1.5 text-xs">
                  <PieChartIcon className="h-3.5 w-3.5" /> Pie
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent>
          <div className="h-[320px] w-full pt-4 pb-2">
            <AnimatePresence mode="wait">
              {activeTab === "bar" ? (
                <motion.div
                  key="bar"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="h-full w-full"
                >
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                      <XAxis
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) => val.length > 18 ? val.substring(0, 18) + "..." : val}
                        style={{ fontSize: "12px", fill: "hsl(var(--muted-foreground))" }}
                        dy={15}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) => Math.round(val).toString()}
                        style={{ fontSize: "12px", fill: "hsl(var(--muted-foreground))" }}
                        allowDecimals={false}
                        dx={-10}
                      />
                      <ChartTooltip
                        cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                        content={<ChartTooltipContent hideLabel indicator="line" />}
                      />
                      <Bar
                        dataKey="votes"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={60}
                        animationDuration={1500}
                      >
                        {chartData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </motion.div>
              ) : (
                <motion.div
                  key="pie"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="h-full w-full"
                >
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <PieChart>
                      <ChartTooltip
                        content={<ChartTooltipContent hideLabel nameKey="name" />}
                      />
                      <Pie
                        data={chartData}
                        dataKey="votes"
                        nameKey="name"
                        cx="50%"
                        cy="45%"
                        outerRadius={110}
                        innerRadius={65}
                        paddingAngle={4}
                        animationDuration={1500}
                        label={({ payload }) => payload.percentage > 5 ? `${payload.percentage}%` : null}
                        labelLine={false}
                      >
                        {chartData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartLegend
                        content={<ChartLegendContent nameKey="name" />}
                        className="flex-wrap pt-8"
                      />
                    </PieChart>
                  </ChartContainer>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
