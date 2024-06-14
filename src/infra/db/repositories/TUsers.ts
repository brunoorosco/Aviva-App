export type ParamsUser = {
  name: string
  email: string
  birth: string
  cemId: string
  profile_id?: number
  street: string
  number: string
  city: string
  zipcode: string
  state?: string
  password: string
}

export interface ParamUserLogin {
  id?: string
  name: string
  password?: string
  email: string
}
