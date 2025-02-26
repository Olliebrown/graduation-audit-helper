import React from 'react'
import PropTypes from 'prop-types'

import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import { ProgramStatus } from '../data/dataShapes.js'
import ProgramSection from './ProgramSection.jsx'

export default function PrimaryProgram ({ program, index, expanded = false, setExpanded = () => {} }) {
  const panelId = `programPanel-${index}`
  const handleChange = (event, isExpanded) => {
    setExpanded(isExpanded ? panelId : false)
  }

  return (
    <Accordion expanded={expanded === panelId} onChange={handleChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography component="span" sx={{ width: '75%', flexShrink: 0 }}>
          {program.name}
        </Typography>
        <Typography component="span" sx={{ color: 'text.secondary' }}>
          {program.collapsed ? 'Satisfied' : 'Not satisfied'}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {program.sections?.map((section, i) => (
          <ProgramSection key={i} section={section} />
        ))}
      </AccordionDetails>
    </Accordion>
  )
}

PrimaryProgram.propTypes = {
  program: PropTypes.shape(ProgramStatus).isRequired,
  index: PropTypes.number.isRequired,
  expanded: PropTypes.string,
  setExpanded: PropTypes.func
}
