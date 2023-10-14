import { useState } from 'react'
import Papa, { type ParseResult } from 'papaparse'
import { MuiFileInput } from 'mui-file-input'
import { Box, Stack, Typography, CircularProgress } from '@mui/material'

const FileInput = <K,>({
  isLoading,
  mutate,
  mandatoryFields = [],
}: {
  isLoading: boolean
  mutate: K
  mandatoryFields?: string[]
}) => {
  const [file, setFile] = useState<File | null>(null)

  const onFileChange = (value: File | null) => {
    if (value) {
      setFile(value)
      Papa.parse(value as unknown as 'unique symbol', {
        complete: (result: ParseResult<unknown>) => {
          if (!result.meta.fields) {
            alert('No fields found in CSV')
            setFile(null)
            return
          }
          if (
            result.meta.fields.length === 0 ||
            result.meta.fields.length < mandatoryFields.length ||
            !mandatoryFields.every((field) => result.meta.fields?.includes(field))
          ) {
            alert(
              'Mandatory field(s) missing. Please check the CSV file.\n\nMandatory fields are: ' +
                mandatoryFields.join(', ')
            )
            setFile(null)
            return
          }
          if (mutate && typeof mutate === 'function') {
            mutate?.(result?.data)
          }
          setFile(null)
        },
        header: true,
      })
    } else {
      setFile(null)
    }
  }

  return (
    <Box>
      {isLoading ? (
        <Stack direction='row' justifyContent='flex-start' alignItems='center' gap={1}>
          <CircularProgress size={15} />
          <Typography variant='h6'>Loading Data In DB...</Typography>
        </Stack>
      ) : (
        <MuiFileInput
          value={file}
          onChange={onFileChange}
          placeholder='Upload CSV here to load data in DB'
          inputProps={{
            accept: '.csv',
          }}
          helperText='*Only CSV files are allowed'
          fullWidth
        />
      )}
    </Box>
  )
}

export default FileInput
