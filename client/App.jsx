import React from 'react'
import { Grid2 as Grid, Box, Typography } from '@mui/material'

import StudentsTable from './components/StudentsTable.jsx'

function App () {
  return (
    <>
      <Typography variant="h1" component="h2" sx={{ pt: 4 }}>
        CS Graduation Checker
      </Typography>
      <Typography variant="h5" sx={{ pb: 2, borderBottom: '1px solid lightgrey', mb: 2 }}>
        Loading Data from&nbsp;
        <Box component="span" sx={{ p: 1, fontFamily: 'Monospace', backgroundColor: 'lightgrey' }}>
          <code>data/dec24Grads-status.json</code>
        </Box>
      </Typography>

      <Grid container spacing={2}>
        <Grid size={12}>
          <StudentsTable />
        </Grid>
      </Grid>
    </>
  )
}

export default App
