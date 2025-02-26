import PropTypes from 'prop-types'

const AdvisorInfo = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string,
  program: PropTypes.string
}

export const ClassData = {
  number: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  credits: PropTypes.string,
  term: PropTypes.string,
  status: PropTypes.string
}

const SectionData = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  collapsed: PropTypes.bool,
  status: PropTypes.string
}

export const SubSectionStatus = {
  ...SectionData,
  classes: PropTypes.arrayOf(
    PropTypes.shape(ClassData)
  )
}

export const SectionStatus = {
  ...SectionData,
  subSections: PropTypes.arrayOf(
    PropTypes.shape(SubSectionStatus)
  )
}

export const ProgramStatus = {
  ...SectionData,
  sections: PropTypes.arrayOf(
    PropTypes.shape(SectionStatus)
  )
}

export const RawStudent = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  campusId: PropTypes.string,
  emplId: PropTypes.string,
  holds: PropTypes.arrayOf(PropTypes.string),
  advisors: PropTypes.arrayOf(
    PropTypes.shape(AdvisorInfo)
  ),
  enrollment: PropTypes.string,
  status: PropTypes.arrayOf(
    PropTypes.shape(ProgramStatus)
  )
}
