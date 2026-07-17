import { IsUrl } from 'class-validator'

export class CreateUrlDto {
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
  })
  url!: string
}
