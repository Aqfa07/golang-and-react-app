"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { PlusCircle, Trash2, CheckCircle, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Task {
  id: string
  title: string
  completed: boolean
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/tasks")
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim()) return

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTask }),
      })

      const createdTask = await response.json()
      setTasks([...tasks, createdTask])
      setNewTask("")
    } catch (error) {
      console.error("Error adding task:", error)
    }
  }

  const toggleTaskStatus = async (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return

    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !task.completed }),
      })

      setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      })

      setTasks(tasks.filter((t) => t.id !== id))
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  return (
    <div className="container mx-auto max-w-md py-10 px-4">
      <Card>
        <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="text-center">Task Manager</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={addTask} className="flex gap-2 mb-6">
            <Input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1"
            />
            <Button type="submit">
              <PlusCircle className="h-5 w-5 mr-1" />
              Add
            </Button>
          </form>

          {loading ? (
            <div className="text-center py-4">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No tasks yet. Add one above!</div>
          ) : (
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleTaskStatus(task.id)} className="text-primary">
                      {task.completed ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                    </button>
                    <span className={task.completed ? "line-through text-muted-foreground" : ""}>{task.title}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
