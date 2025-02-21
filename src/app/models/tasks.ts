export interface Task {
  id?: number
  title: string
  description: string
  taskDate: Date
  status: "pending" | "in-progress" | "completed"
  validationDate: Date
  userId: string
}

export interface User {
  _id: string
  name: string
}

