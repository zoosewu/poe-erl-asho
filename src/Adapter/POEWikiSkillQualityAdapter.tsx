import { SkillQualityInfoRoot, SkillQuality, SkillQualityDetail, SkillQualityInfoCountRoot, SkillQualityInfoCargoquery } from '../Type/SkillQualityType'
import mockDataSkillQuality from '../test/mockDataSkillQuality.json'

export const FetchAllSkillQualityCount = async (): Promise<Response> => {
  const countUrl = GetPOEWikiQualityInfoCountUrl()
  return fetch(countUrl, { method: 'GET' })
}
function GetPOEWikiQualityInfoCountUrl() {
  return 'https://www.poewiki.net/w/api.php?action=cargoquery&' +
    'tables=items,skill_quality,skill_gems&' +
    'join_on=items._pageID=skill_quality._pageID,items._pageID=skill_gems._pageID&' +
    'fields=COUNT(items.name)=count&' +
    'where=skill_quality.set_id IS NOT NULL&' +
    'order_by=items.name,skill_quality.set_id&' +
    'limit=1&' +
    'format=json'
}
export const FetchAllSkillQuality = async (count: number): Promise<Response[]> => {
  const fetchQuery: Array<Promise<Response>> = []
  for (let index = 0; index < count / 500; index++) {
    const url = GetPOEWikiSkillQualityInfoUrl(index)
    fetchQuery.push(fetch(url, { method: 'GET' }))
  }
  return Promise.all(fetchQuery)
}
function GetPOEWikiSkillQualityInfoUrl(offsetIndex: number | undefined) {
  let offset = ''
  if (offsetIndex && offsetIndex > 0) offset = '&offset=' + (500 * offsetIndex)
  return 'https://www.poewiki.net/w/api.php?action=cargoquery&' +
    'tables=items,skill_quality,skill_gems&' +
    'join_on=items._pageID=skill_quality._pageID,items._pageID=skill_gems._pageID&' +
    'fields=' +
    'items.name,' +
    'skill_gems.gem_tags,' +
    'skill_quality.set_id,' +
    'skill_quality.weight,' +
    'skill_quality.stat_text&' +
    'where=skill_quality.set_id IS NOT NULL&' +
    'order_by=items.name,skill_quality.set_id&' +
    'limit=500&' +
    'format=json' + offset
}
export function POEWikiSkillQualityAdapter(skillQualityInfoCargoquery: SkillQualityInfoCargoquery[]): Map<string, SkillQuality> {
  const result: Map<string, SkillQuality> = new Map<string, SkillQuality>()
  for (let index = 0; index < skillQualityInfoCargoquery.length; index++) {
    const element = skillQualityInfoCargoquery[index].title
    let skillQuality: SkillQuality
    const skillQualityDetail: SkillQualityDetail = {
      qualityType: parseInt(element['set id']),
      weight: parseInt(element.weight),
      statText: element['stat text'].replace('&lt;br&gt;', '\n')
    } as SkillQualityDetail
    if (result.has(element.name)) {
      skillQuality = result.get(element.name) as SkillQuality
    } else {
      skillQuality = {
        name: element.name,
        tags: element['gem tags'],
        qualityDetails: []
      } as SkillQuality
      if (!element['gem tags']) console.log('quality', skillQuality, 'detail', skillQualityDetail, 'SkillQualityInfo', element)
      result.set(element.name, skillQuality)
    }
    skillQuality?.qualityDetails.push(skillQualityDetail)
  }
  return result
}


// function GetPOEWikiSkillAPIUrlWhereCondition(gemName: string[]) {
//   let where = ''
//   for (let index = 0; index < gemName.length; index++) {
//     const element = gemName[index]
//     where += GetPOEWikiAPIUrlWhereConditionElement(element)
//     if (index !== gemName.length - 1) where += 'or '
//   }
//   return where
// }
// function GetPOEWikiAPIUrlWhereConditionElement(gemName: string) {
//   return 'items.name="' + gemName + '"'
// }
