import React from 'react'
import PropTypes from 'prop-types'

import { ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material'
import { School as ClassIcon } from '@mui/icons-material'

import { ClassData } from '../data/dataShapes'

export default function ClassListItem ({ classData }) {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar sx={{
          bgcolor: (classData.status === 'Taken' ? 'success.main' : 'warning.main')
        }}>
          <ClassIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={classData.title} secondary={classData.number} />
    </ListItem>
  )
}

ClassListItem.propTypes = {
  classData: PropTypes.shape(ClassData).isRequired
}
