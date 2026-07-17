import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { UrlsController } from './urls.controller'
import { UrlsService } from './urls.service'

@Module({
  imports: [PrismaModule],
  controllers: [UrlsController],
  providers: [UrlsService],
})
export class UrlsModule {}
