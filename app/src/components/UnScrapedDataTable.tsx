import { useState, useEffect } from 'react'
import { Stack, Typography } from '@mui/material'
import { Skeleton } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'

import { api } from 'utils/api'

interface Column {
  id:
    | 'firstName'
    | 'lastName'
    | 'role'
    | 'company'
    | 'email'
    | 'seniority'
    | 'department'
    | 'stage'
    | 'industry'
    | 'personalLinkedinUrl'
    | 'city'
    | 'state'
    | 'country'
    | 'companyWebsite'
    | 'companyLinkedinUrl'
    | 'companyFacebookUrl'
    | 'companyTwitterUrl'
    | 'companyCity'
    | 'companyState'
    | 'companyCountry'
  label: string
}

const columns: Column[] = [
  { id: 'firstName', label: 'FirstName' },
  { id: 'lastName', label: 'LastName' },
  { id: 'role', label: 'Role' },
  { id: 'company', label: 'Company' },
  { id: 'email', label: 'Email' },
  { id: 'seniority', label: 'Seniority' },
  { id: 'department', label: 'Department' },
  { id: 'stage', label: 'Stage' },
  { id: 'industry', label: 'Industry' },
  {
    id: 'personalLinkedinUrl',
    label: 'Person Linkedin Url',
  },
  { id: 'city', label: 'City' },
  { id: 'state', label: 'State' },
  { id: 'country', label: 'Country' },
  { id: 'companyWebsite', label: 'Company Website' },
  {
    id: 'companyLinkedinUrl',
    label: 'Company Linkedin Url',
  },
  { id: 'companyFacebookUrl', label: 'Facebook Url' },
  { id: 'companyTwitterUrl', label: 'Twitter Url' },
  { id: 'companyCity', label: 'Company City' },
  { id: 'companyState', label: 'Company State' },
  { id: 'companyCountry', label: 'Company Country' },
]

interface Data {
  firstName: string
  lastName: string
  role: string
  company: string
  email: string
  seniority: string
  department: string
  stage: string
  industry: string
  personalLinkedinUrl: string
  city: string
  state: string
  country: string
  companyWebsite: string
  companyLinkedinUrl: string
  companyFacebookUrl: string
  companyTwitterUrl: string
  companyCity: string
  companyState: string
  companyCountry: string
}

const Row = ({ row }: { row: Data }) => {
  return (
    <>
      <TableRow hover role='checkbox' tabIndex={-1}>
        {columns.map((column) => {
          const value = row[column.id]
          return <TableCell key={column.id}>{value}</TableCell>
        })}
      </TableRow>
    </>
  )
}

export default function UnScrapedData() {
  const [unscrapedData, setUnScrapedData] = useState<Data[]>([])
  const [page, setPage] = useState(0)
  const [loadedPages, setLoadedPages] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { data, isLoading } = api.userData.getAllUnscrapedData.useQuery({
    take: rowsPerPage,
    skip: rowsPerPage * page,
  })

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
    if (newPage < page) {
    }
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  useEffect(() => {
    if (page > loadedPages && !isLoading) {
      setLoadedPages(page)
    }
  }, [page, loadedPages, isLoading])

  useEffect(() => {
    const users = data?.data
    if (users && users.length !== 0 && (loadedPages === 0 || page > loadedPages)) {
      const allData = users.map((user) => ({
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        company: user.company,
        email: user.email,
        seniority: user.seniority,
        department: user.department,
        stage: user.stage,
        industry: user.industry,
        personalLinkedinUrl: user.personalLinkedinUrl,
        city: user.city,
        state: user.state,
        country: user.country,
        companyWebsite: user.companyWebsite,
        companyLinkedinUrl: user.companyLinkedinUrl,
        companyFacebookUrl: user.companyFacebookUrl,
        companyTwitterUrl: user.companyTwitterUrl,
        companyCity: user.companyCity,
        companyState: user.companyState,
        companyCountry: user.companyCountry,
      })) as Data[]
      if (page === 0) {
        setUnScrapedData(allData)
      } else if (page > loadedPages) {
        setUnScrapedData((prev) => [...prev, ...allData])
      }
    }
  }, [data, data?.data, page, rowsPerPage, loadedPages])

  if (!isLoading && unscrapedData.length === 0) return <div>No Data Found.</div>

  return (
    <Stack mt={2} spacing={2} pb={5}>
      <Typography mt={2} mb={-2}>
        All Unscraped Data
      </Typography>
      {isLoading ? (
        <Stack mt={2} spacing={2} pb={5}>
          <Skeleton variant='rounded' width='100%' height='80vh'>
            <div style={{ paddingTop: '57%' }} />
          </Skeleton>
        </Stack>
      ) : (
        <>
          {data?.data?.length === 0 ? (
            <div>No Data Found.</div>
          ) : (
            <TableContainer sx={{ height: '100%' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column.id}>{column.label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {unscrapedData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, i) => {
                      return <Row row={row} key={row.firstName + i + row.lastName} />
                    })}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component='div'
                count={data?.total ?? 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          )}
        </>
      )}
    </Stack>
  )
}
