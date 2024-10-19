/* eslint-disable no-unused-expressions */
() => {
  // function getCourseTable (e, findClosest = true) {
  //   // Is there just one table under this? (ignore it otherwise)
  //   if (findClosest && e.closest('table[id*=SAA_DPR_GROUPBOX]')) {
  //     e = e.closest('table[id*=SAA_DPR_GROUPBOX]')
  //   }

  //   const grids = e.querySelectorAll('table.PSLEVEL3GRID')
  //   if (grids.length !== 1) return null

  //   const rows = Array.from(grids[0].rows).slice(1)
  //   return rows.map(row => {
  //     return {
  //       number: row.cells[0].textContent.trim(),
  //       title: row.cells[1].textContent.trim(),
  //       credits: row.cells[2].textContent.trim(),
  //       term: row.cells[3].textContent.trim(),
  //       status: row.cells[row.cells.length - 1].querySelector('img').getAttribute('alt')
  //     }
  //   })
  // }

  // function getSubSections (e) {
  //   const sections = []

  //   let curRow = e
  //   while (curRow) {
  //     if (curRow.querySelector('.PAGROUPDIVIDER')) {
  //       break
  //     } else if (curRow.querySelector('.PSGROUPBOXLABEL')) {
  //       sections.push(curRow)
  //     }
  //     curRow = curRow.nextElementSibling
  //   }

  //   return sections.map(section => {
  //     const statusText = section.querySelector('div[id*=DESCRLONG_] span.PSLONGEDITBOX')
  //     return {
  //       title: section.querySelector('.PSGROUPBOXLABEL').textContent.trim(),
  //       status: statusText.firstChild?.textContent.trim(),
  //       description: section.childNodes[1]?.textContent.trim(),
  //       classes: getCourseTable(section, false)
  //     }
  //   })
  // }

  // function getSections (e, level) {
  //   if (level > 9) return null

  //   const sections = Array.from(e.querySelectorAll(`div[id*=DESCRLONG_0${level}] span.PSLONGEDITBOX`))
  //   if (sections.length === 0) {
  //     return getSections(e, level + 1)
  //   }

  //   return sections.map(section => {
  //     const sectionObj = {
  //       name: section.closest('tr')?.previousElementSibling?.textContent.trim(),
  //       status: section.firstChild?.textContent.trim(),
  //       description: section.childNodes[1]?.textContent.trim()
  //     }

  //     if (!sectionObj.description || !sectionObj.status.includes('Satisfied')) {
  //       sectionObj.description = sectionObj.status + sectionObj.description
  //       sectionObj.status = ''
  //     }

  //     const subSections = getSubSections(section.closest('tr'))
  //     if (subSections !== null) sectionObj.subSections = subSections

  //     return sectionObj
  //   })
  // }

  // const frameDoc = document.querySelector('iframe').contentDocument
  return Array.from(document.querySelectorAll('div[id*="DPR_GROUPBOX1GP"] > a')).map(e => {
    const programName = e.parentNode.lastChild.textContent.trim()
    const collapsed = (e.getAttribute('aria-expanded') === 'false')

    // const tbody = e.parentNode.parentNode.parentNode.parentNode
    return { name: programName, collapsed } // sections: getSections(tbody, 3) }
  })
}
