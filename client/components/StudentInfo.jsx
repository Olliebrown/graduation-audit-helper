import React from 'react'
import PropTypes from 'prop-types'

import { Grid2 as Grid, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material'

import PrimaryProgram from './PrimaryProgram.jsx'

import { RawStudent } from '../data/dataShapes'

export default function StudentInfo ({ studentData, isOpen = false, onClose = () => {} }) {
  const [expandedProgram, setExpandedProgram] = React.useState('')

  // Build program components
  const programs = studentData.status.map((program, i) => {
    return (
      <PrimaryProgram key={i} index={i} program={program} expanded={expandedProgram} setExpanded={setExpandedProgram} />
    )
  })

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{studentData.firstName} {studentData.lastName} ({studentData.emplId})</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2, flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="h6">Enrollment Information</Typography>
              <Typography>Enrollment: {studentData.enrollment}</Typography>
              <Typography>Holds: {studentData.holds.join(', ') || 'None'}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="h6">Advisors</Typography>
              {studentData.advisors?.map((advisor, index) => (
                <div key={index}>
                  <Typography>Name: {advisor.name}</Typography>
                  <Typography>Email: {advisor.email}</Typography>
                  <Typography>Program: {advisor.program}</Typography>
                </div>
              ))}
            </Grid>
            <Grid size={12}>
              {programs}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

StudentInfo.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  studentData: PropTypes.shape(RawStudent).isRequired
}
