import { z } from 'zod'
import isemail from 'isemail'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'

export const scrapedDataRouter = createTRPCRouter({
  getScrapedData: publicProcedure
    .input(
      z.object({
        take: z.number().optional(),
        query: z.string().optional(),
        skip: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      let allUsers,
        totalUsers = 0
      if (input.query && isemail.validate(input.query)) {
        const user = await ctx.prisma.userData.findMany({
          where: { email: input.query },
        })
        if (user && user.length > 0) {
          allUsers = await ctx.prisma.scrapedProfileData.findMany({
            include: {
              user: true,
              skills: true,
              educations: true,
              experiences: true,
              certifications: true,
              projectAccomplishments: true,
              languageAccomplishments: true,
            },
            where: {
              userId: {
                in: user.map((u) => u.id),
              },
            },
          })
          totalUsers = 1
        }
      } else {
        const final: Record<string, unknown> = {}
        if (input.query) {
          final.where = {
            OR: [
              { fullName: { contains: input.query } },
              { title: { contains: input.query } },
              { city: { contains: input.query } },
              { country: { contains: input.query } },
              { province: { contains: input.query } },
            ],
          }
        }
        if (input.take) {
          final.take = input.take
        }
        if (input.skip) {
          final.skip = input.skip
        }
        allUsers = await ctx.prisma.scrapedProfileData.findMany({
          include: {
            user: true,
            skills: true,
            educations: true,
            experiences: true,
            certifications: true,
            projectAccomplishments: true,
            languageAccomplishments: true,
          },
          ...final,
        })
        totalUsers = await ctx.prisma.scrapedProfileData.count({
          ...(final?.where ? { where: final.where } : {}),
        } as unknown as Record<string, never>)
      }
      return {
        data: allUsers,
        total: totalUsers,
        page: input.skip && input.take ? input.skip / input.take + 1 : 0,
        totalPages: input.take ? Math.ceil(totalUsers / input.take) : 0,
      }
    }),
})
