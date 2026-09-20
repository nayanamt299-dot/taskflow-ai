function fallbackTasks(goal) {
  const base = goal?.trim() || "complete the project";
  const today = new Date();
  const date = n => new Date(today.getTime() + n * 86400000).toISOString().slice(0, 10);

  return [
    { title: "Define scope and success criteria", description: `Break "${base}" into measurable outcomes and confirm the scope.`, priority: "High", suggestedDueDate: date(2) },
    { title: "Create the implementation plan", description: "Turn the goal into milestones, dependencies and a practical execution plan.", priority: "High", suggestedDueDate: date(4) },
    { title: "Build the core functionality", description: "Implement the main workflow and keep each change small and testable.", priority: "Urgent", suggestedDueDate: date(9) },
    { title: "Validate and test", description: "Test the important user journeys, edge cases and error states.", priority: "Medium", suggestedDueDate: date(12) },
    { title: "Polish and document", description: "Improve usability, responsiveness and documentation before delivery.", priority: "Medium", suggestedDueDate: date(14) }
  ];
}

export async function generateTasks(goal) {
  if (!process.env.AI_API_KEY || !process.env.AI_API_URL) {
    return { provider: "fallback", tasks: fallbackTasks(goal) };
  }

  try {
    const response = await fetch(process.env.AI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.AI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || undefined,
        input: `Return JSON only. Generate 5 useful project tasks for: ${goal}. Each task must have title, description, priority (Low/Medium/High/Urgent), suggestedDueDate (YYYY-MM-DD).`
      })
    });
    if (!response.ok) throw new Error("AI provider unavailable");
    const data = await response.json();
    const tasks = data.tasks || data.output || [];
    if (!Array.isArray(tasks) || !tasks.length) throw new Error("Invalid AI response");
    return { provider: "external", tasks };
  } catch {
    return { provider: "fallback", tasks: fallbackTasks(goal) };
  }
}

export async function generateDescription(input) {
  const text = input?.trim() || "a new project";
  return `TaskFlow AI project focused on ${text}. The project is organized around clear milestones, practical task ownership, measurable progress and reliable delivery.`;
}

export async function suggestions(stats = {}) {
  const completion = Number(stats.completionRate || 0);
  return [
    completion < 50 ? "Start with the highest-impact open task and finish one small milestone before switching context." : "Protect your current momentum by grouping similar tasks into focused work sessions.",
    "Review urgent and overdue work at the beginning of each work session.",
    "Keep task descriptions specific enough that the next action is obvious.",
    "Use project progress and completion trends to adjust workload rather than relying on task count alone."
  ];
}

export async function prioritize(tasks = []) {
  const rank = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
  return [...tasks].sort((a, b) => (rank[b.priority] || 0) - (rank[a.priority] || 0));
}
