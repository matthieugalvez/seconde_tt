import { HttpStatus, NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import type { Response } from 'express'
import { UrlsController } from './urls.controller'
import { UrlsService } from './urls.service'

describe('UrlsController', () => {
  const urlsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByCode: jest.fn(),
  }

  const url = {
    id: 1,
    code: 'abc1234',
    originalUrl: 'https://example.com',
    createdAt: new Date(),
  }

  let controller: UrlsController

  beforeEach(async () => {
    jest.clearAllMocks()

    const module = await Test.createTestingModule({
      controllers: [UrlsController],
      providers: [
        {
          provide: UrlsService,
          useValue: urlsService,
        },
      ],
    }).compile()

    controller = module.get(UrlsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('creates a shortened URL', async () => {
    urlsService.create.mockResolvedValue(url)

    await expect(controller.create({ url: url.originalUrl })).resolves.toEqual(
      url,
    )

    expect(urlsService.create).toHaveBeenCalledWith(url.originalUrl)
  })

  it('lists shortened URLs', async () => {
    urlsService.findAll.mockResolvedValue([url])

    await expect(controller.findAll()).resolves.toEqual([url])
  })

  it('redirects to the original URL', async () => {
    const response = {
      redirect: jest.fn(),
    } as unknown as Response

    urlsService.findByCode.mockResolvedValue(url)

    await controller.redirect(url.code, response)

    expect(response.redirect).toHaveBeenCalledWith(
      HttpStatus.FOUND,
      url.originalUrl,
    )
  })

  it('throws when the code does not exist', async () => {
    const response = {
      redirect: jest.fn(),
    } as unknown as Response

    urlsService.findByCode.mockResolvedValue(null)

    await expect(
      controller.redirect('missing', response),
    ).rejects.toBeInstanceOf(NotFoundException)

    expect(response.redirect).not.toHaveBeenCalled()
  })
})
