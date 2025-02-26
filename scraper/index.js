import fs from 'fs'
import puppeteer from 'puppeteer'

import * as AccessStout from './accessStout.js'

const rawData = fs.readFileSync('./scraper/data/may25Grads.json', { encoding: 'utf8' })
const students = JSON.parse(rawData)

async function doTheThing () {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  page.setDefaultTimeout(5000)

  try {
    // Navigate to access stout and log in
    await AccessStout.loginToAccessStout(page)

    for (let i = 0; i < students.length; i++) {
      // Navigate to a student page and open their advising audit
      await AccessStout.navigateToStudentPage(page, students[i].campusId, students[i].emplId)

      // Read all the student data
      const holds = await AccessStout.getHolds(page)
      const advisors = await AccessStout.getAdvisorInfo(page)
      const enrollment = await AccessStout.getEnrollmentDates(page)

      // Open the advising audit and get the programs status
      await AccessStout.openAdvisingAudit(page)
      const status = await AccessStout.getProgramsStatus(page)

      // Save the data to the student object
      students[i].holds = holds
      students[i].advisors = advisors
      students[i].enrollment = enrollment
      students[i].status = status
    }

    // Write out results
    fs.writeFileSync('./output/may25Grads-status.json', JSON.stringify(students, null, 2))
  } catch (error) {
    console.error(error)
  } finally {
    // Close the browser
    // await browser.close()
  }
}

doTheThing()
