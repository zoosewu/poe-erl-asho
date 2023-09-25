import { SkillQualityInfoRoot, SkillQuality, SkillQualityDetail } from '../Type/SkillQualityType'
import mockDataSkillQuality from '../test/mockDataSkillQuality.json'
export async function GetSkillQuality (gemNames: string[]): Promise<Map<string, SkillQuality>> {
  const url = GetPOEWikiAPIUrl(gemNames)
  console.log('GetSkillQuality url', url)
  // const data = await fetch(url, { method: "GET", });
  // const jsonData: SkillQualityInfoRoot = await data.json();
  const jsonData: SkillQualityInfoRoot = mockDataSkillQuality
  const result: Map<string, SkillQuality> = new Map<string, SkillQuality>()
  for (let index = 0; index < jsonData.cargoquery.length; index++) {
    const element = jsonData.cargoquery[index].title
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
      result.set(element.name, skillQuality)
    }
    skillQuality?.qualityDetails.push(skillQualityDetail)
  }
  return result
}

function GetPOEWikiAPIUrl (gemName: string[]) {
  const where = GetPOEWikiAPIUrlWhereCondition(gemName)
  return 'https://www.poewiki.net/w/api.php?action=cargoquery&' +
    'tables=items,skill_quality,skill_gems&' +
    'join_on=items._pageID=skill_quality._pageID,items._pageID=skill_gems._pageID&' +
    'fields=' +
    'items.name,' +
    'skill_gems.gem_tags,' +
    'skill_quality.set_id,' +
    'skill_quality.weight,' +
    'skill_quality.stat_text&' +
    'where=' + where +
    '&order_by=items.name,skill_quality.set_id&' +
    'limit=500&' +
    'format=json'
}
function GetPOEWikiAPIUrlWhereCondition (gemName: string[]) {
  let where = ''
  for (let index = 0; index < gemName.length; index++) {
    const element = gemName[index]
    where += GetPOEWikiAPIUrlWhereConditionElement(element)
    if (index !== gemName.length - 1) where += 'or '
  }
  return where
}
function GetPOEWikiAPIUrlWhereConditionElement (gemName: string) {
  return 'items.name="' + gemName + '"'
}
