import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Res,
} from '@nestjs/common'
import type { Response } from 'express'
import { CreateUrlDto } from './dto/create-url.dto'
import { UrlsService } from './urls.service'

@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('api/urls')
  create(@Body() createUrlDto: CreateUrlDto) {
    return this.urlsService.create(createUrlDto.url)
  }

  @Get('api/urls')
  findAll() {
    return this.urlsService.findAll()
  }

  @Get(':code')
  async redirect(@Param('code') code: string, @Res() response: Response) {
    const url = await this.urlsService.findByCode(code)

    if (!url) {
      throw new NotFoundException('Short URL not found')
    }

    return response.redirect(HttpStatus.FOUND, url.originalUrl)
  }
}
