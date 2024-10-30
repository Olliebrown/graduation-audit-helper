import dotenv from 'dotenv'
import * as PAGE from './pageHelpers.js'

// Initialize secrets from .env file
dotenv.config()
const USERNAME = process.env.USERNAME ?? 'badname'
const PASSWORD = process.env.PASSWORD ?? 'badpass'

const ROOT_URL = 'https://access.uwstout.edu/'
const ADVISEE_URL = 'https://www.uwstout.sis.wisconsin.edu/psp/stoprd-fd/EMPLOYEE/SA/c/SSR_ADVISEE_OVRD.SSS_ADVISEE_LIST.GBL'

async function getContentFrame (page) {
  const frame = await page.frames().find(f => f.name() === 'TargetContent')
  if (!frame) {
    throw new Error('Failed to find main content frame')
  }
  return frame
}

export async function loginToAccessStout (page) {
  // Navigate the page to a URL.
  await page.goto(ROOT_URL)

  // Set screen size.
  await page.setViewport({ width: 1200, height: 1024 })

  // Enter email and proceed
  await page.waitForSelector('input[aria-label="Please enter your email address"]')
  await page.locator('input[aria-label="Please enter your email address"]').fill(USERNAME)
  await page.locator('input[type="submit"]').click()

  // Enter password and proceed
  await page.waitForSelector(`input[aria-label="Enter the password for ${USERNAME}"]`)
  await page.locator(`input[aria-label="Enter the password for ${USERNAME}"]`).fill(PASSWORD)
  await page.locator('input[type="submit"]').click()

  // Wait for access stout page to load (give plenty of time as requires two-step)
  await page.waitForSelector('div[id*=logoswan]', { timeout: 60000 })
}

export async function navigateToStudentPage (page, campusId) {
  // Navigate the page to a URL and grab frame
  await page.goto(ADVISEE_URL)
  const frame = await getContentFrame(page)

  // Click the button for other students
  await frame.waitForSelector('input[value="View data for other students"]')
  await frame.locator('input[value="View data for other students"]').click()

  // Fill in campus ID and submit
  await frame.waitForSelector('input[id*=CAMPUS_ID]')
  await frame.locator('input[id*=CAMPUS_ID]').fill(campusId)
  await frame.locator('input[value="Search"]').click()

  // Wait for the student page to load
  await page.waitForFunction(PAGE.STUDENT, { timeout: 30000 })
}

export async function getHolds (page) {
  // Make sure we are on the right page
  if (!await page.evaluate(PAGE.STUDENT)) {
    throw new Error('Must be on student page before opening advising audit')
  }

  // Get main content frame
  const frame = await getContentFrame(page)

  // Grab and return all hold rows
  return await frame.$$eval('tr[id*=SRVCIND_HOLD]',
    rows => Array.from(rows).map(row => row.textContent.trim())
  )
}

export async function getEnrollmentDates (page) {
  // Make sure we are on the right page
  if (!await page.evaluate(PAGE.STUDENT)) {
    throw new Error('Must be on student page before opening advising audit')
  }

  let frame = await getContentFrame(page)

  // Check if the 'more appointment' link is present
  if (await frame.$('a[id*=MORE_APPT]') === null) {
    return []
  }

  // Navigate to the enrollment dates page
  await frame.locator('a[id*=MORE_APPT]').click()

  // Wait for the page to load
  await page.waitForFunction(PAGE.ENROLLMENT_DATES, { timeout: 30000 })

  // Click the radio button for the latest date
  frame = await getContentFrame(page)
  const buttons = await frame.$$('input[type=radio]')
  if (buttons.length > 0) {
    // Click the button
    await buttons[buttons.length - 1].click()

    // Click the 'continue' button
    await frame.locator('input[value="Continue"]').click()

    // Wait for the enrollment table to open
    frame = await getContentFrame(page)
  }

  // Grab the date
  const row = await frame.waitForSelector('tr[id*=STDNT_ENRL]')
  const date = await row.evaluate(rowE => rowE.cells[1].textContent.trim())

  // Return to the student page
  await frame.locator('input[id*=CANCEL_BTN]').click()
  await page.waitForFunction(PAGE.STUDENT, { timeout: 30000 })

  // Return back the date
  return date
}

export async function getAdvisorInfo (page) {
  // Make sure we are on the right page
  if (!await page.evaluate(PAGE.STUDENT)) {
    throw new Error('Must be on student page before opening advising audit')
  }

  let frame = await getContentFrame(page)

  // Check if the 'advisors' link is present
  if (await frame.$('a[id*=MORE_ADVISOR]') === null) {
    return []
  }

  // Navigate to the advisor page
  await frame.locator('a[id*=MORE_ADVISOR]').click()

  // Wait for the page to load
  await page.waitForFunction(PAGE.ADVISORS, { timeout: 30000 })

  // Grab advisor names and emails
  frame = await getContentFrame(page)
  const advisors = await frame.$$eval('a[id*=ADVR_NAME]', links =>
    Array.from(links).map(link => ({
      name: link.textContent.trim(),
      email: link.getAttribute('href').split(':')[1]
    }))
  )
  const programs = await frame.$$eval('span[id*=ADVR_COMMITTEE]', spans => (
    Array.from(spans).map(span => span.textContent.trim().split('(')[0])
  ))

  // Return to the student page
  await frame.locator('input[id*=CANCEL_BTN]').click()
  await page.waitForFunction(PAGE.STUDENT, { timeout: 30000 })

  // Return back the advisor info
  return advisors.map((advisor, i) => ({ ...advisor, program: programs[i] }))
}

export async function openAdvisingAudit (page) {
  // Make sure we are on the right page
  if (!await page.evaluate(PAGE.STUDENT)) {
    throw new Error('Must be on student page before opening advising audit')
  }

  // Get main content frame
  const frame = await getContentFrame(page)

  // Select the 'Academic Requirements' option (value 3010)
  await frame.waitForSelector('select[id*=MORE_ACADEMICS]')
  await frame.locator('select[id*=MORE_ACADEMICS]').fill('3010')
  await frame.locator('a[id*=GO_1]').click()

  // Wait for the audit to load
  await frame.waitForFunction(PAGE.AUDIT, { timeout: 30000 })
}

export async function fullyExpandAudit (page) {
  // Get main content frame
  const frame = await getContentFrame(page)

  // Click 'expand all' to expand any collapsed sections
  await frame.locator('input[id*=EXPAND_ALL]').click()

  // Find all tables and click 'view all' to fill tables fully
  // - Will keep clicking until no more 'view all' buttons are found
  await frame.waitForFunction(() => {
    const buttons = document.querySelectorAll('a.PSLEVEL3GRIDLABEL:nth-child(2)')
    let ready = true
    Array.from(buttons).forEach(b => {
      if (b.textContent.toLowerCase().includes('view all')) {
        b.click()
        ready = false
      }
    })
    return ready
  }, { timeout: 10000 })
}

export async function getProgramsStatus (page) {
  // Make sure we are on the right page
  if (!await page.evaluate(PAGE.AUDIT)) {
    throw new Error('Must be on advising audit top check program status')
  }

  // Get main content frame
  const frame = await getContentFrame(page)

  // Find all program headers and section roots
  const programs = await frame.$$('div[id*="DPR_GROUPBOX1GP"] > a')

  // Parse details of each program (before expanding everything)
  const results = []
  for (let i = 0; i < programs.length; i++) {
    const [name, collapsed] = await programs[i].evaluate(
      e => ([
        e.parentNode.lastChild.textContent.trim(),
        e.getAttribute('aria-expanded') === 'false'
      ])
    )

    results.push({ name, collapsed })
  }

  // Expand everything and parse sections
  await fullyExpandAudit(page)
  const programRoots = await frame.$$('div[id*="DPR_GROUPBOX1GP"] ::-p-xpath(../../..)')
  for (let i = 0; i < results.length; i++) {
    const sections = await getSections(programRoots[i], 3)
    if (sections) {
      results[i].sections = sections
    }
  }

  return results
}

async function getSections (e) {
  // Find the lowest level form here that has sections
  let level = 3
  let sections = []
  do {
    sections = await e.$$(`div[id*=DESCRLONG_0${level}] span.PSLONGEDITBOX`)
    level++
  } while (sections.length === 0 && level < 10)

  // Did we find any?
  if (sections.length === 0) {
    return null
  }

  // Parse details for each section
  const results = []
  for (let i = 0; i < sections.length; i++) {
    let [name, status, description] = await sections[i].evaluate(
      (section) => {
        // Look for title in two possible places
        let title = section.closest('tr')?.previousElementSibling?.textContent.trim()
        if (!title) {
          title = section.closest('div[id*=DPR_GROUPBOX]')?.querySelector('.PSGROUPBOXLABEL').textContent.trim()
        }

        // Return important stats
        return [
          title,
          section.firstChild?.textContent.trim(),
          section.childNodes[1]?.textContent.trim()
        ]
      }
    )

    // Clean up status and description
    if (!description || !status.includes('Satisfied')) {
      description = status + ' ' + description
      status = ''
    }

    // Build object and add to results array
    const secObj = { name, description }
    if (status) secObj.status = status

    // Locate the parent node for searching subsections
    const secParent = await sections[i].$('xpath/ancestor::tr[1]')
    if (secParent) {
      const subSections = await getSubSections(secParent)
      if (Array.isArray(subSections) && subSections.length > 0) {
        secObj.subSections = subSections
      }
    }

    results.push(secObj)
  }

  return results
}

async function getSubSections (e) {
  const sections = []
  let curRow = e
  while (curRow !== null) {
    if (await curRow.$('.PAGROUPDIVIDER')) {
      break
    } else if (await curRow.$('.PSGROUPBOXLABEL')) {
      sections.push(curRow)
    }
    curRow = await curRow.$('xpath/following-sibling::*[1]')
  }

  const results = []
  for (let i = 0; i < sections.length; i++) {
    const sectionObj = await sections[i].evaluate(
      (section) => {
        const statusText = section.querySelector('div[id*=DESCRLONG_] span.PSLONGEDITBOX')
        return {
          name: section.querySelector('.PSGROUPBOXLABEL').textContent.trim(),
          status: statusText?.firstChild?.textContent.trim(),
          description: statusText?.childNodes[1]?.textContent.trim()
        }
      }
    )

    const classes = await getCourseTable(sections[i], false)
    if (classes) sectionObj.classes = classes

    results.push(sectionObj)
  }

  return results
}

async function getCourseTable (e) {
  const grids = await e.$$('table.PSLEVEL3GRID')
  if (grids.length !== 1) return null

  return await grids[0].evaluate(
    (table) => {
      const rows = Array.from(table.rows).slice(1)
      return rows.map(row => {
        return {
          number: row.cells[0].textContent.trim(),
          title: row.cells[1].textContent.trim(),
          credits: row.cells[2].textContent.trim(),
          term: row.cells[3].textContent.trim(),
          status: row.cells[row.cells.length - 1].querySelector('img')?.getAttribute('alt') ?? 'N/A'
        }
      })
    }
  )
}
