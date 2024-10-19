import fs from 'fs'
import puppeteer from 'puppeteer'

import { getProgramsStatus, loginToAccessStout, navigateToStudentPage, openAdvisingAudit } from './accessStout.js'

const rawData = fs.readFileSync('./scraper/data/dec24Grads.json', { encoding: 'utf8' })
const students = JSON.parse(rawData)

async function doTheThing () {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  page.setDefaultTimeout(5000)

  try {
    // Navigate to access stout and log in
    await loginToAccessStout(page)

    for (let i = 0; i < students.length; i++) {
      // Navigate to a student page and open their advising audit
      await navigateToStudentPage(page, students[i].campusId)
      await openAdvisingAudit(page)

      // Read and save program status
      const status = await getProgramsStatus(page)
      students[i].status = status
    }

    // Write out results
    fs.writeFileSync('./output/dec24Grads-status.json', JSON.stringify(students, null, 2))
  } catch (error) {
    console.error(error)
  } finally {
    // Close the browser
    await browser.close()
  }
}

doTheThing()
