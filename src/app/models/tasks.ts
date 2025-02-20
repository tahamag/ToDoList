export interface Task {
  id?: number
  title: string
  description: string
  taskDate: Date
  status: "pending" | "in-progress" | "completed"
  validationDate: Date
  userId: number
}

export interface User {
  id: number
  name: string
}

