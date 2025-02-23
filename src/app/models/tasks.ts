export interface Task {
  _id?: string
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

