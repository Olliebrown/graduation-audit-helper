const programs = document.querySelector('iframe').contentDocument.querySelectorAll('div[id*="DPR_GROUPBOX1GP"] > a')
const programBody = document.evaluate('../../../..[1]', programs[2]).iterateNext()
const sections = programBody.querySelectorAll('div[id*=DESCRLONG_03] span.PSLONGEDITBOX')
const sectionRoot = document.evaluate('ancestor::tr[1]', sections[0]).iterateNext()
const subSections = []
let curRow = sectionRoot
while (curRow !== null) {
  if (curRow.querySelector('.PAGROUPDIVIDER')) {
    break
  } else if (curRow.querySelector('.PSGROUPBOXLABEL')) {
    subSections.push(curRow)
  }
  curRow = document.evaluate('following-sibling::*[1]', curRow).iterateNext()
}
