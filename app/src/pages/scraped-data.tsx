import { useState, useEffect } from 'react'
import Link from 'next/link'
import debounce from 'lodash/debounce'
import { Stack, Typography, Box } from '@mui/material'
import { Skeleton } from '@mui/material'
import TextField from '@mui/material/TextField'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Collapse from '@mui/material/Collapse'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import IconButton from '@mui/material/IconButton'

import { api } from 'utils/api'

interface Column {
  id: 'fullName' | 'title' | 'description' | 'city' | 'country' | 'province' | 'email'
  label: string
}

const columns: Column[] = [
  { id: 'fullName', label: 'Full Name' },
  { id: 'email', label: 'Email' },
  { id: 'title', label: 'Title' },
  { id: 'description', label: 'Description' },
  { id: 'city', label: 'City' },
  { id: 'province', label: 'Province' },
  { id: 'country', label: 'Country' },
]

interface Data {
  title: string
  fullName: string
  email: string
  city: string
  country: string
  province: string
  description: string
  user: User
  skills: Skill[]
  educations: Education[]
  experiences: Experience[]
  certifications: Certification[]
  projectAccomplishments: ProjectAccomplishment[]
  languageAccomplishments: LanguageAccomplishment[]
}

interface User {
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

interface Skill {
  skillName: string
  endorsementCompany: string
}

interface Education {
  media: {
    title: string
    details: string
    url: string
  }[]
  endDate: string
  startDate: string
  degreeName: string
  schoolName: string
  description: string
  durationInDays: number
}

interface Experience {
  title: string
  company: string
  endDate: string
  city: string
  country: string
  province: string
  startDate: string
  description: string
  durationInDays: number
  employmentType: string
  endDateIsPresent: boolean
}

interface Certification {
  name: string
  issueDate: string
  issuingOrganization: string
}

interface ProjectAccomplishment {
  endDate: string
  startDate: string
  description: string
  projectLink: string
  projectName: string
}

interface LanguageAccomplishment {
  language: string
  proficiency: string
}

const Row = ({ row }: { row: Data }) => {
  const [open, setOpen] = useState(false)

  const renderSubRow = (key: string) => {
    switch (key) {
      case 'user':
        return (
          <Table size='small' aria-label='purchases'>
            <TableHead>
              <TableRow>
                <TableCell>Role</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Seniority</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Stage</TableCell>
                <TableCell>Industry</TableCell>
                <TableCell>Personal Linkedin Url</TableCell>
                <TableCell>City</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Company Website</TableCell>
                <TableCell>Company Linkedin Url</TableCell>
                <TableCell>Company Facebook Url</TableCell>
                <TableCell>Company Twitter Url</TableCell>
                <TableCell>Company City</TableCell>
                <TableCell>Company State</TableCell>
                <TableCell>Company Country</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{row[key]?.role}</TableCell>
                <TableCell>{row[key]?.company}</TableCell>
                <TableCell>{row[key]?.email}</TableCell>
                <TableCell>{row[key]?.seniority}</TableCell>
                <TableCell>{row[key]?.department}</TableCell>
                <TableCell>{row[key]?.stage}</TableCell>
                <TableCell>{row[key]?.industry}</TableCell>
                <TableCell>{row[key]?.personalLinkedinUrl}</TableCell>
                <TableCell>{row[key]?.city}</TableCell>
                <TableCell>{row[key]?.state}</TableCell>
                <TableCell>{row[key]?.country}</TableCell>
                <TableCell>{row[key]?.companyWebsite}</TableCell>
                <TableCell>{row[key]?.companyLinkedinUrl}</TableCell>
                <TableCell>{row[key]?.companyFacebookUrl}</TableCell>
                <TableCell>{row[key]?.companyTwitterUrl}</TableCell>
                <TableCell>{row[key]?.companyCity}</TableCell>
                <TableCell>{row[key]?.companyState}</TableCell>
                <TableCell>{row[key]?.companyCountry}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )
      case 'skills':
        return (
          <Table size='small' aria-label='purchases'>
            <TableHead>
              <TableRow>
                <TableCell>Skill Name</TableCell>
                <TableCell>Endorsed By</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {row[key].map((r) => {
                return (
                  <TableRow key={r.skillName + r.endorsementCompany}>
                    <TableCell>{r.skillName}</TableCell>
                    <TableCell>{r.endorsementCompany}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )
      case 'educations':
        return (
          <Table size='small' aria-label='purchases'>
            <TableHead>
              <TableRow>
                <TableCell>Degree Name</TableCell>
                <TableCell>School Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Duration In Days</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>EndDate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {row[key].map((r) => {
                return (
                  <TableRow key={r.degreeName + r.schoolName}>
                    <TableCell>{r.degreeName}</TableCell>
                    <TableCell>{r.schoolName}</TableCell>
                    <TableCell>{r.description}</TableCell>
                    <TableCell>{r.durationInDays}</TableCell>
                    <TableCell>{new Date(r.startDate).toDateString()}</TableCell>
                    <TableCell>{new Date(r.endDate).toDateString()}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )
      case 'experiences':
        return (
          <Table size='small' aria-label='purchases'>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Employment Type</TableCell>
                <TableCell>Currently Working</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Province</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Duration In Days</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>EndDate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {row[key].map((r) => {
                return (
                  <TableRow key={r.title + r.company}>
                    <TableCell>{r.title}</TableCell>
                    <TableCell>{r.company}</TableCell>
                    <TableCell>{r.employmentType}</TableCell>
                    <TableCell>{r.endDateIsPresent ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{r.description}</TableCell>
                    <TableCell>{r.city}</TableCell>
                    <TableCell>{r.province}</TableCell>
                    <TableCell>{r.country}</TableCell>
                    <TableCell>{r.durationInDays}</TableCell>
                    <TableCell>{new Date(r.startDate).toDateString()}</TableCell>
                    <TableCell>{new Date(r.endDate).toDateString()}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )
      case 'certifications':
        return (
          <Table size='small' aria-label='purchases'>
            <TableHead>
              <TableRow>
                <TableCell>Certificate Name</TableCell>
                <TableCell>Issue Date</TableCell>
                <TableCell>Issuing Organization</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {row[key].map((r) => {
                return (
                  <TableRow key={r.name + r.issuingOrganization}>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{new Date(r.issueDate).toDateString()}</TableCell>
                    <TableCell>{r.issuingOrganization}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )
      case 'projectAccomplishments':
        return (
          <Table size='small' aria-label='purchases'>
            <TableHead>
              <TableRow>
                <TableCell>Project Name</TableCell>
                <TableCell>Project Link</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>EndDate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {row[key].map((r) => {
                return (
                  <TableRow key={r.projectName + r.projectLink}>
                    <TableCell>{r.projectName}</TableCell>
                    <TableCell>{r.projectLink}</TableCell>
                    <TableCell>{r.description}</TableCell>
                    <TableCell>{new Date(r.startDate).toDateString()}</TableCell>
                    <TableCell>{new Date(r.endDate).toDateString()}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )
      case 'languageAccomplishments':
        return (
          <Table size='small' aria-label='purchases'>
            <TableHead>
              <TableRow>
                <TableCell>Language</TableCell>
                <TableCell>Proficiency</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {row[key].map((r) => {
                return (
                  <TableRow key={r.language + r.proficiency}>
                    <TableCell>{r.language}</TableCell>
                    <TableCell>{r.proficiency}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )
      default:
        return <div>Not Found</div>
    }
  }

  return (
    <>
      <TableRow hover role='checkbox' tabIndex={-1}>
        <TableCell>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {columns.map((column) => {
          const value = row[column.id]
          return <TableCell key={column.id}>{value}</TableCell>
        })}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            {[
              'user',
              'skills',
              'educations',
              'experiences',
              'certifications',
              'projectAccomplishments',
              'languageAccomplishments',
            ].map((key) => {
              return (
                <Box my={2} p={2} bgcolor='#f8f8f8' key={key}>
                  <Typography variant='h6' gutterBottom component='div'>
                    {key?.toUpperCase()}
                  </Typography>
                  {renderSubRow(key)}
                </Box>
              )
            })}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default function ScrapedData() {
  const [scrapedData, setScrapedData] = useState<Data[]>([])
  const [page, setPage] = useState(0)
  const [loadedPages, setLoadedPages] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [query, setQuery] = useState('')

  const { data, isLoading } = api.scrapedData.getScrapedData.useQuery({
    take: rowsPerPage,
    skip: rowsPerPage * page,
    query,
  })

  const debouncedSearch = debounce((query: string) => {
    setQuery(query ? query?.trim() : '')
  }, 500)

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
    setPage(0)
    setLoadedPages(0)
  }, [query])

  useEffect(() => {
    const users = data?.data
    if (users && users.length !== 0 && (loadedPages === 0 || page > loadedPages)) {
      const allData = users.map((d) => ({
        id: d.id,
        fullName: d.fullName,
        email: d.user.email,
        title: d.title,
        description: d.description,
        city: d.city,
        country: d.country,
        province: d.province,
        user: d.user,
        skills: d.skills,
        educations: d.educations,
        experiences: d.experiences,
        certifications: d.certifications,
        projectAccomplishments: d.projectAccomplishments,
        languageAccomplishments: d.languageAccomplishments,
      })) as unknown as Data[]
      if (page === 0) {
        setScrapedData(allData)
      } else if (page > loadedPages) {
        setScrapedData((prev) => [...prev, ...allData])
      }
    }
  }, [data, data?.data, page, rowsPerPage, loadedPages])

  if (!isLoading && scrapedData.length === 0) return <div>No Data Found.</div>

  return (
    <Stack mt={2} spacing={2} pb={5}>
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <Typography variant='h4'>Scraped Data</Typography>
        <Link href='/' style={{ textDecoration: 'none' }}>
          <Typography variant='h6'>{'Go To Unscraped Data Page =>'}</Typography>
        </Link>
      </Stack>
      <TextField
        variant='outlined'
        label='Search By Name, Title, City, Country, Province or Email'
        onChange={(e) => debouncedSearch(e.target.value)}
      />
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
                    <TableCell />
                    {columns.map((column) => (
                      <TableCell key={column.id}>{column.label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {scrapedData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, i) => {
                      return <Row row={row} key={row.fullName + i + row.title} />
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
