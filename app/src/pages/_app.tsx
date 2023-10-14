import { type AppType } from 'next/app'
import { CssBaseline, Container } from '@mui/material'
import { api } from '@/utils/api'
import '@/styles/globals.css'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Container maxWidth='xl'>
      <CssBaseline />
      <Component {...pageProps} />
    </Container>
  )
}

export default api.withTRPC(MyApp)
