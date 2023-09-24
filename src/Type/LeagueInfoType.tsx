export interface LeagueInfoRoot {
  cargoquery: LeagueInfo[]
}

export interface LeagueInfo {
  title: Title
}

export interface Title {
  name: string
  ordinal: string
  "release date": string
  "release version": string
  "short name": string
  "release date__precision": string
}