import { randomBytes } from 'node:crypto'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class UrlsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(originalUrl: string) {
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = randomBytes(5).toString('base64url')

      try {
        return await this.prisma.url.create({
          data: {
            code,
            originalUrl,
          },
        })
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          continue
        }

        throw error
      }
    }

    throw new InternalServerErrorException(
      'Unable to generate a unique short URL',
    )
  }

  findAll() {
    return this.prisma.url.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  findByCode(code: string) {
    return this.prisma.url.findUnique({
      where: {
        code,
      },
    })
  }
}
