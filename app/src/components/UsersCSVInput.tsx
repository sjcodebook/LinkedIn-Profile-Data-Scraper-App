import CSVInput from 'common/CSVInput'
import { api } from 'utils/api'

export default function UsersCSVInput() {
  const ctx = api.useContext()

  const { mutate, isLoading } = api.userData.create.useMutation({
    onSuccess: () => {
      void ctx.userData.getAllUnscrapedData.invalidate()
    },
    onError: (err) => {
      const errorMessage = err.data?.zodError?.fieldErrors?.content
      if (errorMessage?.[0]) {
        console.error(errorMessage[0])
      } else {
        console.error('Failed to post. Please try again.')
      }
    },
  })

  return (
    <CSVInput
      isLoading={isLoading}
      mutate={mutate}
      mandatoryFields={[
        'First Name',
        'Last Name',
        'Title',
        'Company',
        'Email',
        'Industry',
        'Seniority',
        'Departments',
        'Stage',
        'Person Linkedin Url',
        'City',
        'State',
        'Country',
        'Website',
        'Company Linkedin Url',
        'Facebook Url',
        'Twitter Url',
        'Company City',
        'Company State',
        'Company Country',
      ]}
    />
  )
}
