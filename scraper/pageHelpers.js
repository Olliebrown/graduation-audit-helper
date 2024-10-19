export function STUDENT () {
  let titleElem = document.querySelector('span[id*=TRANSACT_TITLE]')
  if (!titleElem) {
    const iFrame = document.querySelector('iframe')
    if (!iFrame) return false
    titleElem = iFrame.contentDocument.querySelector('span[id*=TRANSACT_TITLE]')
  }
  if (!titleElem) return false
  return titleElem.textContent.toLowerCase() === 'advisee student center'
}

export function AUDIT () {
  let titleElem = document.querySelector('span[id*=TRANSACT_TITLE]')
  if (!titleElem) {
    const iFrame = document.querySelector('iframe')
    if (!iFrame) return false
    titleElem = iFrame.contentDocument.querySelector('span[id*=TRANSACT_TITLE]')
  }
  if (!titleElem) return false
  return titleElem.textContent.toLowerCase() === 'advisee requirements'
}
