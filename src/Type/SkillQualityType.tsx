export interface SkillQualityInfoCountRoot {
  cargoquery: SkillQualityInfoCountCargoquery[]
}

export interface SkillQualityInfoCountCargoquery {
  title: Title
}

export interface Title {
  count: string
}

// from API
export interface SkillQualityInfoRoot {
  cargoquery: SkillQualityInfoCargoquery[]
}

export interface SkillQualityInfoCargoquery {
  title: SkillQualityInfo
}

export interface SkillQualityInfo {
  name: string
  'gem tags': string
  'set id': string
  weight: string
  'stat text': string
}

// from custom
export interface SkillQuality {
  name: string
  tags: string
  qualityDetails: SkillQualityDetail[]
}
export interface SkillQualityDetail {
  qualityType: number
  weight: number
  statText: string
}
