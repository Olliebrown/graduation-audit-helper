import React from 'react'
import PropTypes from 'prop-types'

import { SectionStatus } from '../data/dataShapes.js'
import SubSection from './SubSection.jsx'
import { Grid2 as Grid, Paper, Typography } from '@mui/material'

export default function ProgramSection ({ section }) {
  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ borderBottom: '1px solid grey' }}>
        {section.name}
      </Typography>
      <Grid container spacing={2}>
        {section.subSections?.map((subSection, i) => (
          <Grid item size={{ sm: 6, md: 4 }} key={i}>
            <SubSection key={i} subSection={subSection} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  )
}

ProgramSection.propTypes = {
  section: PropTypes.shape(SectionStatus).isRequired
}
