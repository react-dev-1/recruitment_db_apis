import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeDTO } from '../create/create-resume.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateResumeDTO extends PartialType(CreateResumeDTO) {
  @IsNumber()
  @IsNotEmpty()
  id!: number;
}
