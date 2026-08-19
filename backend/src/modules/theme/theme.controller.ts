import { Controller, Get, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ThemeService } from './theme.service';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('theme')
@ApiBearerAuth()
@Controller('theme')
export class ThemeController {
  constructor(private readonly themeService: ThemeService) {}

  @Get()
  @ApiOperation({ summary: "Get the current user's persisted theme mode and accent color" })
  get(@CurrentUser() user: JwtPayload) {
    return this.themeService.getForUser(user.sub);
  }

  @Patch()
  @ApiOperation({ summary: 'Update theme mode and/or accent color' })
  update(@CurrentUser() user: JwtPayload, @Body() dto: UpdateThemeDto) {
    return this.themeService.update(user.sub, dto);
  }
}
