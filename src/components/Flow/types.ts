export type FlowData = {
  pastor: string
  groups: {
    sup1: string
    sup2: string
    cems: {
      name: string
      leaders: {
        name1: string
        name2: string
        auxiliares: {
          name: string
          users: { name: string; role: string }[]
        }[]
      }[]
    }[]
  }[]
}
