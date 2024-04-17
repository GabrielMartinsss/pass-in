import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { BadRequest } from './_errors/bad-request'

export async function cancelEventRegistration(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/events/:eventId/attendees/:attendeeId',
    {
      schema: {
        summary: 'Cancel event registration',
        tags: ['attendees'],
        params: z.object({
          eventId: z.string().uuid(),
          attendeeId: z.coerce.number(),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { eventId, attendeeId } = request.params

      const attendeeRegisteredWithThisEmail = await prisma.event.findUnique({
        where: {
          id: eventId,
        },
        select: {
          attendees: {
            select: {
              id: true,
            },
            where: {
              id: attendeeId,
            },
          },
        },
      })

      if (attendeeRegisteredWithThisEmail === null) {
        throw new BadRequest('Event not found.')
      }

      if (attendeeRegisteredWithThisEmail.attendees.length === 0) {
        throw new BadRequest('Attendee not found.')
      }

      const attendeeIdToRemove = attendeeRegisteredWithThisEmail.attendees[0].id

      await prisma.attendee.delete({
        where: {
          eventId,
          id: attendeeIdToRemove,
        },
      })

      return reply.status(204).send()
    },
  )
}
