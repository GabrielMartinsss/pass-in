import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { BadRequest } from './_errors/bad-request'

export async function uncheckIn(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/attendees/:attendeeId/uncheck-in',
    {
      schema: {
        summary: 'Uncheck-in an attendee',
        tags: ['check-ins'],
        params: z.object({
          attendeeId: z.coerce.number().int(),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { attendeeId } = request.params

      const attendeeCheckIn = await prisma.checkIn.findUnique({
        where: { attendeeId },
      })

      if (attendeeCheckIn === null) {
        throw new BadRequest('Attendee not found.')
      }

      await prisma.checkIn.delete({
        where: { attendeeId },
      })

      return reply.status(204).send()
    },
  )
}
