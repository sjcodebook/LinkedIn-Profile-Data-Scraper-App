/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/server/db'
import moment from 'moment-timezone'

interface ScrapedData {
  profileId: string
  skills: Skill[]
  education: Education[]
  experiences: Experience[]
  userProfile: UserProfile
  certifications: Certification[]
  projectAccomplishments: ProjectAccomplishment[]
  languageAccomplishments: LanguageAccomplishment[]
}

interface Skill {
  skillName: string | null
  endorsementCompany: string | null
}

interface Education {
  media: {
    title: string | null
    details: string | null
    url: string | null
  }[]
  endDate: string | null
  startDate: string | null
  degreeName: string | null
  schoolName: string | null
  description: string | null
  durationInDays: number | null
}

interface Experience {
  title: string | null
  company: string | null
  endDate: string | null
  location: Location
  startDate: string | null
  description: string | null
  durationInDays: number | null
  employmentType: string | null
  endDateIsPresent: boolean
}

interface Location {
  city: string | null
  country: string | null
  province: string | null
}

interface UserProfile {
  url: string | null
  photo: string | null
  title: string | null
  fullName: string | null
  location: Location
  description: string | null
}

interface Certification {
  name: string | null
  issueDate: string | null
  issuingOrganization: string | null
}

interface ProjectAccomplishment {
  endDate: string | null
  startDate: string | null
  description: string | null
  projectLink: string | null
  projectName: string | null
}

interface LanguageAccomplishment {
  language: string | null
  proficiency: string | null
}

export const formatDate = (date: moment.MomentInput | string): string => {
  if (date === 'Present' || date === 'present') {
    return moment.utc().toISOString()
  }

  return moment(date, 'MMMY').toISOString()
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const body = req?.body as {
        data: string
      }
      console.log(body)
      if (!body?.data && typeof body?.data !== 'string' && JSON.parse(body?.data || '{}')) {
        throw new Error('No data was send to the server.')
      }
      const data = JSON.parse(body?.data) as ScrapedData
      console.log(data)
      await prisma.rawScrapedData.create({
        data: {
          rawData: JSON.parse(body?.data),
        },
      })
      const record = await prisma.scrapedProfileData.create({
        data: {
          url: data?.userProfile?.url ?? null,
          title: data?.userProfile?.title ?? null,
          fullName: data?.userProfile?.fullName ?? null,
          city: data?.userProfile?.location?.city ?? null,
          country: data?.userProfile?.location?.country ?? null,
          province: data?.userProfile?.location?.province ?? null,
          description: data?.userProfile?.description ?? null,
          user: {
            connect: {
              id: data?.profileId,
            },
          },
          skills: {
            create:
              data?.skills?.map((skill) => ({
                skillName: skill?.skillName ?? null,
                endorsementCompany: skill?.endorsementCompany ?? null,
              })) ?? [],
          },
          educations: {
            create:
              data?.education?.map((edu) => ({
                endDate: edu?.endDate ? new Date(edu?.endDate) : null,
                startDate: edu?.startDate ? new Date(edu?.startDate) : null,
                degreeName: edu?.degreeName ?? null,
                schoolName: edu?.schoolName ?? null,
                description: edu?.description ?? null,
                durationInDays: edu?.durationInDays ?? null,
                media: {
                  create:
                    edu?.media?.map((m) => ({
                      title: m?.title ?? null,
                      details: m?.details ?? null,
                      url: m?.url ?? null,
                    })) ?? [],
                },
              })) ?? [],
          },
          experiences: {
            create:
              data?.experiences?.map((exp) => ({
                title: exp?.title ?? null,
                company: exp?.company ?? null,
                endDate: exp?.endDate ? new Date(exp?.endDate) : null,
                city: exp?.location?.city ?? null,
                country: exp?.location?.country ?? null,
                province: exp?.location?.province ?? null,
                startDate: exp?.startDate ? new Date(exp?.startDate) : null,
                description: exp?.description ?? null,
                durationInDays: exp?.durationInDays ?? null,
                employmentType: exp?.employmentType ?? null,
                endDateIsPresent: exp?.endDateIsPresent ?? false,
              })) ?? [],
          },
          certifications: {
            create:
              data?.certifications?.map((cert) => ({
                name: cert?.name ?? null,
                issueDate: cert?.issueDate ? formatDate(cert?.issueDate) : null,
                issuingOrganization: cert?.issuingOrganization ?? null,
              })) ?? [],
          },
          projectAccomplishments: {
            create:
              data?.projectAccomplishments?.map((proj) => ({
                endDate: proj?.endDate ? new Date(proj?.endDate) : null,
                startDate: proj?.startDate ? new Date(proj?.startDate) : null,
                description: proj?.description ?? null,
                projectLink: proj?.projectLink ?? null,
                projectName: proj?.projectName ?? null,
              })) ?? [],
          },
          languageAccomplishments: {
            create:
              data?.languageAccomplishments?.map((lang) => ({
                language: lang?.language ?? null,
                proficiency: lang?.proficiency ?? null,
              })) ?? [],
          },
        },
      })
      res.status(200).json({ message: 'Created Successfully!', record })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Something Went Wrong', error })
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}
