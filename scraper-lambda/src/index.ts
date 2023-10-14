//@ts-nocheck
import { APIGatewayProxyHandler } from 'aws-lambda'
import axios from 'axios'

import { LinkedInProfileScraper } from './_LinkedInScraper'

const getProfileData = async (url: string): Promise<any> => {
  let result = null
  try {
    const response = await axios.get('https://example.com/api/getAuthCookie')
    console.log(response)
    console.log(response?.data)
    if (
      response.status === 200 &&
      response.statusText === 'OK' &&
      response.data?.records?.length > 0
    ) {
      const scraper = new LinkedInProfileScraper({
        sessionCookieValue: response.data?.records?.[0]?.cookie,
        keepAlive: false,
        headless: false,
        timeout: 50000,
      })
      await scraper.setup()
      result = await scraper.run(url)
      await scraper.close()
    }
  } catch (err) {
    console.log('err++++++++++')
    console.error(err)
  } finally {
    return result
  }
}

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const response = await axios.get('https://example.com/api/getLinkedInProfile')
    console.log(response)
    console.log(response?.data)
    if (
      response.status === 200 &&
      response.statusText === 'OK' &&
      response.data?.records?.length > 0
    ) {
      let personalLinkedinUrl = response.data?.records?.[0]?.personalLinkedinUrl
      if (!personalLinkedinUrl || typeof personalLinkedinUrl !== 'string') {
        throw new Error('No personalLinkedinUrl found.')
      }
      if (!personalLinkedinUrl.endsWith('/')) {
        personalLinkedinUrl = `${personalLinkedinUrl}/`
      }
      personalLinkedinUrl = personalLinkedinUrl.replace('http', 'https')
      let data = await getProfileData(personalLinkedinUrl)
      if (!data) {
        axios
          .post(
            'slack-api-key',
            {
              text: '============Please check the LinkedIn profile login status.==============',
            },
            {
              headers: {
                'Content-type': 'application/json',
              },
            }
          )
          .then((response) => {
            console.log('Sent message to Slack successfully:', response.data)
          })
          .catch((error) => {
            console.error('Error sending message to Slack:', error)
          })
        return {
          statusCode: 404,
          body: 'No data found. Pls check',
          headers: {
            'Content-Type': 'text/plain',
          },
          isBase64Encoded: false,
        }
      }
      console.log('ok++++++++++++++++++++1')
      console.log(data)
      const dataRes = await axios.post('https://example.com/api/scrapingUpdateData', {
        data: JSON.stringify({
          ...data,
          profileId: response.data?.records?.[0]?.id,
        }),
      })
      console.log(dataRes?.data)
      if (dataRes.status === 200 && dataRes.statusText === 'OK') {
        console.log('ok++++++++++++++++++++2')
        await axios.post('https://example.com/api/scrapingUpdate', {
          id: response.data?.records?.[0]?.id,
        })
        console.log('ok++++++++++++++++++++3')
        return {
          statusCode: 200,
          body: 'done',
          headers: {
            'Content-Type': 'text/plain',
          },
          isBase64Encoded: false,
        }
      } else {
        console.log('ok++++++++++++++++++++4')
        axios
          .post(
            'slack-api-key',
            {
              text: '============Something is wrong with scrapingUpdateData. Please check the logs.============',
            },
            {
              headers: {
                'Content-type': 'application/json',
              },
            }
          )
          .then((response) => {
            console.log('Sent message to Slack successfully:', response.data)
          })
          .catch((error) => {
            console.error('Error sending message to Slack:', error)
          })
        return {
          statusCode: 500,
          body: 'Something went wrong with scrapingUpdateData',
          headers: {
            'Content-Type': 'text/plain',
          },
          isBase64Encoded: false,
        }
      }
    }
    axios
      .post(
        'slack-api-key',
        {
          text: '============Something is wrong with getLinkedInProfile. Please check the logs.============',
        },
        {
          headers: {
            'Content-type': 'application/json',
          },
        }
      )
      .then((response) => {
        console.log('Sent message to Slack successfully:', response.data)
      })
      .catch((error) => {
        console.error('Error sending message to Slack:', error)
      })
    return {
      statusCode: 500,
      body: 'Something went wrong',
      headers: {
        'Content-Type': 'text/plain',
      },
      isBase64Encoded: false,
    }
  } catch (error) {
    console.error(error)
    axios
      .post(
        'slack-api-key',
        {
          text: '============Something went wrong. Please check the logs.============\n\n' + error,
        },
        {
          headers: {
            'Content-type': 'application/json',
          },
        }
      )
      .then((response) => {
        console.log('Sent message to Slack successfully:', response.data)
      })
      .catch((error) => {
        console.error('Error sending message to Slack:', error)
      })
    return {
      statusCode: 500,
      body: error as string,
      headers: {
        'Content-Type': 'text/plain',
      },
      isBase64Encoded: false,
    }
  }
}
