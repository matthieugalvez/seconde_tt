import { Test } from '@nestjs/testing'
import { PrismaService } from '../prisma/prisma.service'
import { UrlsService } from './urls.service'

describe('UrlsService', () => {
  const prisma = {
    url: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  }

  let service: UrlsService

  beforeEach(async () => {
    jest.clearAllMocks()

    const module = await Test.createTestingModule({
      providers: [
        UrlsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile()

    service = module.get(UrlsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('creates a shortened URL with a URL-safe code', async () => {
    const createdUrl = {
      id: 1,
      code: 'abc1234',
      originalUrl: 'https://example.com',
      createdAt: new Date(),
    }

    prisma.url.create.mockResolvedValue(createdUrl)

    await expect(service.create(createdUrl.originalUrl)).resolves.toEqual(
      createdUrl,
    )

    const createCall = prisma.url.create.mock.calls[0][0]

    expect(createCall.data.originalUrl).toBe(createdUrl.originalUrl)
    expect(createCall.data.code).toMatch(/^[A-Za-z0-9_-]{7}$/)
  })

  it('lists URLs from newest to oldest', async () => {
    prisma.url.findMany.mockResolvedValue([])

    await expect(service.findAll()).resolves.toEqual([])

    expect(prisma.url.findMany).toHaveBeenCalledWith({
      orderBy: {
        createdAt: 'desc',
      },
    })
  })

  it('finds a URL by its code', async () => {
    prisma.url.findUnique.mockResolvedValue(null)

    await expect(service.findByCode('abc1234')).resolves.toBeNull()

    expect(prisma.url.findUnique).toHaveBeenCalledWith({
      where: {
        code: 'abc1234',
      },
    })
  })
})
