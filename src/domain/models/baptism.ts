export type baptism = {
  date: Date
  people: People[]
}

type People = {
  name: string
  cem: string
  isCourse: boolean
}
