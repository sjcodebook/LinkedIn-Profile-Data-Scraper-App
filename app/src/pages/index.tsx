import Head from 'next/head'
import Link from 'next/link'
import { Stack, Typography } from '@mui/material'

import UsersCSVInput from '@/components/UsersCSVInput'
import UnScrapedDataTable from '@/components/UnScrapedDataTable'

export default function Home() {
  return (
    <>
      <Head>
        <title>LinkedIn Profile Data Scraper App</title>
      </Head>
      <Stack mt={2} spacing={2} pb={5}>
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Typography variant='h4'>Admin</Typography>
          <Link href='/scraped-data' style={{ textDecoration: 'none' }}>
            <Typography variant='h6'>{'Go To Scraped Data Page =>'}</Typography>
          </Link>
        </Stack>
        <UsersCSVInput />
        <UnScrapedDataTable />
      </Stack>
    </>
  )
}
