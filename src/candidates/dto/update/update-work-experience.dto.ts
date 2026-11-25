import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkExperienceDTO } from '../create/create-work-experience.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateWorkExperienceDTO extends PartialType(CreateWorkExperienceDTO) {
  @IsNumber()
  @IsNotEmpty()
  id!: number;
}
