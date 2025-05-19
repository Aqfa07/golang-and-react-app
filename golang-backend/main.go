package main

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// Task represents a task in our application
type Task struct {
	ID        string    `json:"id"`
	Title     string    `json:"title"`
	Completed bool      `json:"completed"`
	CreatedAt time.Time `json:"createdAt"`
}

// In-memory storage for tasks (in a real app, use a database)
var tasks = []Task{
	{ID: "1", Title: "Learn Golang", Completed: false, CreatedAt: time.Now()},
	{ID: "2", Title: "Build a REST API", Completed: false, CreatedAt: time.Now()},
	{ID: "3", Title: "Connect with React", Completed: false, CreatedAt: time.Now()},
}

func main() {
	r := gin.Default()

	// Configure CORS to allow requests from your React frontend
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Routes
	r.GET("/api/tasks", getTasks)
	r.GET("/api/tasks/:id", getTask)
	r.POST("/api/tasks", createTask)
	r.PUT("/api/tasks/:id", updateTask)
	r.DELETE("/api/tasks/:id", deleteTask)

	// Start server
	r.Run(":8080") // Listen on port 8080
}

// GET /api/tasks - Get all tasks
func getTasks(c *gin.Context) {
	c.JSON(http.StatusOK, tasks)
}

// GET /api/tasks/:id - Get a specific task
func getTask(c *gin.Context) {
	id := c.Param("id")

	for _, task := range tasks {
		if task.ID == id {
			c.JSON(http.StatusOK, task)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
}

// POST /api/tasks - Create a new task
func createTask(c *gin.Context) {
	var newTask Task

	if err := c.ShouldBindJSON(&newTask); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if newTask.Title == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title is required"})
		return
	}

	// Generate a new UUID for the task
	newTask.ID = uuid.New().String()
	newTask.CreatedAt = time.Now()
	newTask.Completed = false

	tasks = append(tasks, newTask)
	c.JSON(http.StatusCreated, newTask)
}

// PUT /api/tasks/:id - Update a task
func updateTask(c *gin.Context) {
	id := c.Param("id")
	var updatedTask Task

	if err := c.ShouldBindJSON(&updatedTask); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for i, task := range tasks {
		if task.ID == id {
			// Update only the fields that were provided
			if updatedTask.Title != "" {
				tasks[i].Title = updatedTask.Title
			}
			
			// For boolean fields, we need to check if they were explicitly set
			if c.Request.Method == "PUT" {
				tasks[i].Completed = updatedTask.Completed
			}
			
			c.JSON(http.StatusOK, tasks[i])
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
}

// DELETE /api/tasks/:id - Delete a task
func deleteTask(c *gin.Context) {
	id := c.Param("id")

	for i, task := range tasks {
		if task.ID == id {
			// Remove the task from the slice
			tasks = append(tasks[:i], tasks[i+1:]...)
			c.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
}
