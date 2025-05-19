import { NextResponse } from "next/server"

// In-memory storage for tasks (simulating a database)
const tasks = [
  { id: "1", title: "Learn Golang", completed: false },
  { id: "2", title: "Build a REST API", completed: false },
  { id: "3", title: "Connect with React", completed: false },
]

// GET /api/tasks - Get all tasks
export async function GET() {
  return NextResponse.json(tasks)
}

// POST /api/tasks - Create a new task
export async function POST(request: Request) {
  const body = await request.json()

  if (!body.title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 })
  }

  const newTask = {
    id: Date.now().toString(),
    title: body.title,
    completed: false,
  }

  tasks.push(newTask)
  return NextResponse.json(newTask, { status: 201 })
}
