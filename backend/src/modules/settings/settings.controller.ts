import { Controller, Get, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateFieldPreferenceDto } from './dto/update-field-preference.dto';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('settings')
@ApiBearerAuth()
@Controller('settings/field-visibility')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get which task board columns are visible for the current user' })
  get(@CurrentUser() user: JwtPayload) {
    return this.settingsService.getFieldPreferences(user.sub);
  }

  @Patch()
  @ApiOperation({ summary: 'Update visible task columns (Priority, Members, Status, Reporter, Labels, Due Date)' })
  update(@CurrentUser() user: JwtPayload, @Body() dto: UpdateFieldPreferenceDto) {
    return this.settingsService.updateFieldPreferences(user.sub, dto);
  }
}
