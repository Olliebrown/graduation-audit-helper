import React from 'react'

import { Tooltip } from '@mui/material'
import { DataGrid, GridToolbar, useGridApiRef } from '@mui/x-data-grid'
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Dangerous as XIcon
} from '@mui/icons-material'

import { buildStudentGridRows } from '../data/dataProcessing.js'
import { studentStatusComparator } from './studentStatusHelpers.js'

function renderStatus (params) {
  switch (typeof params.value) {
    case 'string':
      switch (params.value) {
        case 'XX': return (
          <Tooltip title="Missing">
            <ErrorIcon color="error" />
          </Tooltip>
        )
        case 'N/A': return null
      }
      break

    case 'object': {
      const icon = (params.value.collapsed ? <CheckIcon color="success" /> : <XIcon color="warning" />)
      return (
        <Tooltip title={params.value.name}>
          {icon}
        </Tooltip>
      )
    }
  }
}

function renderMultiStatusGentle (params) {
  return params.value.map(status => renderStatus({ value: status }))
}

function renderMultiStatus (params) {
  if (!Array.isArray(params.value) || params.value.length === 0) {
    return (
      <Tooltip title="Missing">
        <ErrorIcon color="error" />
      </Tooltip>
    )
  }

  return params.value.map(status => renderStatus({ value: status }))
}

const columns = [
  { field: 'campusId', headerName: 'Campus ID' },
  { field: 'firstName', headerName: 'First Name' },
  { field: 'lastName', headerName: 'Last Name' },
  { field: 'email', headerName: 'Email' },
  { field: 'concentration', headerName: 'Concentration' },

  { field: 'universityRequirements', display: 'flex', align: 'center', headerName: 'Univ', renderCell: renderStatus, sortComparator: studentStatusComparator },
  { field: 'honorsRequirements', display: 'flex', align: 'center', headerName: 'Hon', renderCell: renderStatus, sortComparator: studentStatusComparator },

  { field: 'csMajorRequirements', display: 'flex', align: 'center', headerName: 'CS', renderCell: renderStatus, sortComparator: studentStatusComparator },
  { field: 'otherMajorRequirements', display: 'flex', align: 'center', headerName: 'Other', renderCell: renderMultiStatusGentle },
  { field: 'minorRequirements', display: 'flex', align: 'center', minWidth: 150, headerName: 'Minors', renderCell: renderMultiStatus }
]

export default function StudentsTable () {
  const apiRef = useGridApiRef()

  const [studentData, setStudentData] = React.useState([])
  React.useEffect(() => {
    fetch('data/dec24Grads-status.json')
      .then(res => res.json())
      .then(rawData => {
        setStudentData(buildStudentGridRows(rawData))
        setTimeout(() => apiRef.current?.autosizeColumns(), 500)
      })
  }, [apiRef])

  return (
    <DataGrid
      apiRef={apiRef}
      rows={studentData}
      columns={columns}
      getRowId={row => row.campusId}
      slots={{ toolbar: GridToolbar }}
      slotProps={{
        toolbar: { showQuickFilter: true }
      }}
    />
  )
}
