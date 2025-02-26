import React from 'react'
import PropTypes from 'prop-types'

import { Card, CardContent, Typography, List } from '@mui/material'

import { SubSectionStatus } from '../data/dataShapes.js'
import ClassListItem from './ClassListItem.jsx'

export default function SubSection ({ subSection }) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography gutterBottom variant="h8" component="div" sx={{ width: '75%' }} >
          {subSection.name}
        </Typography>
        <Typography variant="body2" component="div" sx={{ color: 'text.secondary' }}>
          {subSection.status}
        </Typography>
        {Array.isArray(subSection.classes) && subSection.classes.length > 0 &&
          <List>
            {subSection.classes.map((classData, i) => (
              <ClassListItem key={i} classData={classData} />
            ))}
          </List>
        }
      </CardContent>
    </Card>

  )
}

SubSection.propTypes = {
  subSection: PropTypes.shape(SubSectionStatus).isRequired
}
