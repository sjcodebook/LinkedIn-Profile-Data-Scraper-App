import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { TRPCError } from '@trpc/server'

export const userDataRouter = createTRPCRouter({
  getAllUnscrapedData: publicProcedure
    .input(z.object({ take: z.number(), skip: z.number().optional() }))
    .query(async ({ input, ctx }) => {
      const allUsers = await ctx.prisma.userData.findMany({
        take: input.take,
        skip: input.skip ?? 0,
        where: {
          isScraped: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
      const totalUsers = await ctx.prisma.userData.count({
        where: {
          isScraped: false,
        },
      })
      return {
        data: allUsers,
        total: totalUsers,
        page: input.skip && input.take ? input.skip / input.take + 1 : 0,
        totalPages: input.take ? Math.ceil(totalUsers / input.take) : 0,
      }
    }),

  create: publicProcedure
    .input(
      z
        .object({
          'First Name': z.string().optional(),
          'Last Name': z.string().optional(),
          Title: z.string().optional(),
          Company: z.string().optional(),
          Email: z.string().optional(),
          Industry: z.string().optional(),
          Seniority: z.string().optional(),
          Departments: z.string().optional(),
          Stage: z.string().optional(),
          'Person Linkedin Url': z.string().optional(),
          City: z.string().optional(),
          State: z.string().optional(),
          Country: z.string().optional(),
          Website: z.string().optional(),
          'Company Linkedin Url': z.string().optional(),
          'Facebook Url': z.string().optional(),
          'Twitter Url': z.string().optional(),
          'Company City': z.string().optional(),
          'Company State': z.string().optional(),
          'Company Country': z.string().optional(),
        })
        .passthrough()
        .array()
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!input) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `No data was send to the server.`,
          })
        }
        const post = await ctx.prisma.userData.createMany({
          data: input.map((row) => ({
            firstName: row['First Name'] ?? null,
            lastName: row['Last Name'] ?? null,
            role: row.Title ?? null,
            company: row.Company ?? null,
            email: row.Email ?? null,
            seniority: row.Seniority ?? null,
            department: row.Departments ?? null,
            stage: row.Stage ?? null,
            industry: row.Industry ?? null,
            personalLinkedinUrl: row['Person Linkedin Url'] ?? null,
            city: row.City ?? null,
            state: row.State ?? null,
            country: row.Country ?? null,
            companyWebsite: row.Website ?? null,
            companyLinkedinUrl: row['Company Linkedin Url'] ?? null,
            companyFacebookUrl: row['Facebook Url'] ?? null,
            companyTwitterUrl: row['Twitter Url'] ?? null,
            companyCity: row['Company City'] ?? null,
            companyState: row['Company State'] ?? null,
            companyCountry: row['Company Country'] ?? null,
            rawData: row as unknown as Record<string, string>,
          })),
        })
        return post
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: (error as string) || 'Something went wrong',
        })
      }
    }),
})
