import { NextResponse } from "next/server"

// Reference to the in-memory tasks (simulating a database)
// In a real app, this would be a database query
let tasks = [
  { id: "1", title: "Learn Golang", completed: false },
  { id: "2", title: "Build a REST API", completed: false },
  { id: "3", title: "Connect with React", completed: false },
]

// GET /api/tasks/[id] - Get a specific task
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const task = tasks.find((t) => t.id === params.id)

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 })
  }

  return NextResponse.json(task)
}

// PUT /api/tasks/[id] - Update a task
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()
  const taskIndex = tasks.findIndex((t) => t.id === params.id)

  if (taskIndex === -1) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 })
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...body,
  }

  return NextResponse.json(tasks[taskIndex])
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const taskIndex = tasks.findIndex((t) => t.id === params.id)

  if (taskIndex === -1) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 })
  }

  const deletedTask = tasks[taskIndex]
  tasks = tasks.filter((t) => t.id !== params.id)

  return NextResponse.json(deletedTask)
}
