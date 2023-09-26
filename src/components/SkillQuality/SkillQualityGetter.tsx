import { SkillQualityInfoRoot, SkillQuality, SkillQualityDetail, SkillQualityInfoCountRoot, SkillQualityInfoCargoquery } from '../../Type/SkillQualityType'
import mockDataSkillQuality from '../../test/mockDataSkillQuality.json'
export async function GetSkillQuality(): Promise<Map<string, SkillQuality>> {
  let skillQualityInfoCargoquery: SkillQualityInfoCargoquery[] = []
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  // if (false) {
    skillQualityInfoCargoquery = mockDataSkillQuality.cargoquery
  } else {
    const countUrl = GetPOEWikiQualityInfoCountUrl()
    const countData = await fetch(countUrl, { method: 'GET' })
    const countJson: SkillQualityInfoCountRoot = await countData.json()
    const queryCount = parseInt(countJson.cargoquery[0].title.count)
    console.log('GetSkillQuality Count', queryCount)
    const fetchQuery: Array<Promise<Response>> = []
    for (let index = 0; index < queryCount / 500; index++) {
      const url = GetPOEWikiSkillQualityInfoUrl(index)
      fetchQuery.push(fetch(url, { method: 'GET' }))
    }
    const responses: Response[] = await Promise.all(fetchQuery)
    for (const response of responses) {
      const jsonData: SkillQualityInfoRoot = await response.json()
      console.log('GetSkillQuality data', jsonData)
      skillQualityInfoCargoquery = skillQualityInfoCargoquery.concat(jsonData.cargoquery)
    }
  }
  const result: Map<string, SkillQuality> = new Map<string, SkillQuality>()
  for (let index = 0; index < skillQualityInfoCargoquery.length; index++) {
    const element = skillQualityInfoCargoquery[index].title
    let skillQuality: SkillQuality
    const skillQualityDetail: SkillQualityDetail = {
      qualityType: parseInt(element['set id']),
      weight: parseInt(element.weight),
      statText: element['stat text']
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
function GetPOEWikiQualityInfoCountUrl() {
  // const where = GetPOEWikiSkillAPIUrlWhereCondition(gemName)
  return 'https://www.poewiki.net/w/api.php?action=cargoquery&' +
    'tables=items,skill_quality,skill_gems&' +
    'join_on=items._pageID=skill_quality._pageID,items._pageID=skill_gems._pageID&' +
    'fields=COUNT(items.name)=count&' +
    'where=skill_quality.set_id IS NOT NULL&' +
    'order_by=items.name,skill_quality.set_id&' +
    'limit=1&' +
    'format=json'
}
function GetPOEWikiSkillQualityInfoUrl(offsetIndex: number | undefined) {
  // const where = GetPOEWikiSkillAPIUrlWhereCondition(gemName)
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
function GetPOEWikiSkillAPIUrlWhereCondition(gemName: string[]) {
  let where = ''
  for (let index = 0; index < gemName.length; index++) {
    const element = gemName[index]
    where += GetPOEWikiAPIUrlWhereConditionElement(element)
    if (index !== gemName.length - 1) where += 'or '
  }
  return where
}
function GetPOEWikiAPIUrlWhereConditionElement(gemName: string) {
  return 'items.name="' + gemName + '"'
}
