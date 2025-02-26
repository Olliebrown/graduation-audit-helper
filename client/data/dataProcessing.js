// This data is inconsistent in the following ways:
// - The names of programs have concentrations embedded in them
// - The names of programs vary wildly from year to year in grammar and capitalization
// - The order of programs in inconsistent from student to student
//
// "I can't believe I have to write this function"
//  - GitHub Copilot, Oct 19th, 2024
function cleanThisAwfulData (rawData) {
  return rawData.map(row => {
    // Locate the general status programs
    const infoIndex = row.status.findIndex(status => status.name.toUpperCase().includes('GENERAL INFORMATION'))
    const univIndex = row.status.findIndex(status => status.name.toUpperCase().includes('UNIVERSITY REQUIREMENTS'))
    const honorsIndex = row.status.findIndex(status => status.name.toUpperCase().includes('HONORS COLLEGE'))

    // Locate any minors
    const minorIndexes = row.status.map((status, i) => {
      if (status.name.toUpperCase().includes('MINOR')) {
        return i
      } else {
        return -1
      }
    }).filter(index => index !== -1)

    // Everything else is a major
    const majors = row.status.reduce((acc, status, i) => {
      if (i !== infoIndex && i !== univIndex && i !== honorsIndex && !minorIndexes.includes(i)) {
        return [...acc, status]
      }
      return acc
    }, [])

    // Restructure 'status'
    return {
      ...row,
      status: {
        generalInfo: row.status[infoIndex],
        universityRequirements: row.status[univIndex],
        honorsRequirements: row.status[honorsIndex],
        minors: row.status.filter((status, i) => minorIndexes.includes(i)),
        majors
      }
    }
  })
}

function isCSDegree (name) {
  return name.toUpperCase().includes('COMPUTER SCIENCE') && !name.toUpperCase().includes('APPLIED')
}

export function buildStudentGridRows (rawData) {
  const cleanData = cleanThisAwfulData(rawData)
  return cleanData.map(row => {
    // Isolate the CS major from the rest
    const csMajor = row.status.majors.find(major => isCSDegree(major.name))
    const otherMajors = row.status.majors.filter(major => !isCSDegree(major.name))

    // Identify the concentration
    let concentration = 'N/A'
    if (csMajor.name.toUpperCase().includes('GAME DESIGN')) {
      concentration = 'GDD'
    } else if (csMajor.name.toUpperCase().includes('MOBILE APPLICATION')) {
      concentration = 'MOBILE'
    } else if (csMajor.name.toUpperCase().includes('CYBER SECURITY')) {
      concentration = 'CYBER'
    } else if (csMajor.name.toUpperCase().includes('INTERDISCIP')) {
      concentration = 'INTER'
    }

    // Flatten the data
    return {
      campusId: row.campusId ?? row.emplId,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,

      generalInfo: row.status.generalInfo ?? 'XX',
      universityRequirements: row.status.universityRequirements ?? 'XX',
      honorsRequirements: row.status.honorsRequirements ?? 'N/A',

      concentration,
      csMajorRequirements: csMajor ?? 'XX',
      otherMajorRequirements: otherMajors,
      minorRequirements: row.status.minors
    }
  })
}
