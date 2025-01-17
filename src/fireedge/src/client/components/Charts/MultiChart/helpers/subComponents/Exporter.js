/* ------------------------------------------------------------------------- *
 * Copyright 2002-2023, OpenNebula Project, OpenNebula Systems               *
 *                                                                           *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may   *
 * not use this file except in compliance with the License. You may obtain   *
 * a copy of the License at                                                  *
 *                                                                           *
 * http://www.apache.org/licenses/LICENSE-2.0                                *
 *                                                                           *
 * Unless required by applicable law or agreed to in writing, software       *
 * distributed under the License is distributed on an "AS IS" BASIS,         *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  *
 * See the License for the specific language governing permissions and       *
 * limitations under the License.                                            *
 * ------------------------------------------------------------------------- */
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Button, Menu, MenuItem, Box } from '@mui/material'
import { Download } from 'iconoir-react'
import {
  exportDataToCSV,
  exportDataToPDF,
} from 'client/components/Charts/MultiChart/helpers/scripts'
import { useGeneralApi } from 'client/features/General'

/**
 * Renders a button that provides export options for data.
 *
 * @param {object} props - The properties for the component.
 * @param {Array} props.data - The data to be exported.
 * @param {Array} props.exportOptions - The available export options.
 * @param {object} props.exportHandlers - The handlers for each export type.
 * @returns {React.Component} The rendered export button component.
 */
export const ExportButton = ({ data, exportOptions, exportHandlers }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const { enqueueError } = useGeneralApi()

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleExport = (type) => {
    if (exportHandlers[type]) {
      const error = exportHandlers[type](data)
      if (error) {
        enqueueError(
          'Error exporting data to ' + type.toUpperCase() + ': ' + error.message
        )
      }
    }
    handleMenuClose()
  }

  const noData =
    !data ||
    data.length === 0 ||
    data.every((item) => !item.data || item.data.length === 0)

  return (
    <Box>
      <Button
        endIcon={<Download />}
        onClick={handleMenuOpen}
        disabled={noData}
        variant="outlined"
        sx={{
          padding: '3px 17px',
          transition: 'all 0.1s ease',
          '&:hover': {
            borderColor: '#2a2a2a',
          },
        }}
      >
        Export
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {exportOptions.map((option) => (
          <MenuItem key={option.type} onClick={() => handleExport(option.type)}>
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

ExportButton.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  exportOptions: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  exportHandlers: PropTypes.objectOf(PropTypes.func),
}

ExportButton.defaultProps = {
  exportOptions: [
    { type: 'csv', label: 'Export as CSV' },
    { type: 'pdf', label: 'Export as PDF' },
  ],
  exportHandlers: {
    csv: (data) => exportDataToCSV(data),
    pdf: (data) => exportDataToPDF(data),
  },
}
