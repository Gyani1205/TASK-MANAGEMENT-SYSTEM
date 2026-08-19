import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseOptionalIntPipe implements PipeTransform {
  transform(value: string | undefined, _metadata: ArgumentMetadata): number | undefined {
    if (value === undefined || value === '') return undefined;
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      throw new BadRequestException('Value must be a valid integer');
    }
    return parsed;
  }
}
