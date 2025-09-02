// models/Hierarchy.ts

export interface User {
  name: string
  role: string
}

export interface Auxiliar {
  name: string
  users: User[]
}

export interface Leader {
  name1: string
  name2: string
  auxiliares: Auxiliar[]
}

export interface Cem {
  name: string
  leaders: Leader[]
}

export interface SupervisorGroup {
  sup1: string
  sup2: string
  cems: Cem[]
}

export interface PastorHierarchy extends Document {
  pastor: string
  groups: SupervisorGroup[]
}