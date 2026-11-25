import { PartialType } from '@nestjs/mapped-types';
import { CreateEducationDTO } from '../create/create-education.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateEducationDTO extends PartialType(CreateEducationDTO) {
    @IsNumber()
    @IsNotEmpty()
    id!: number;
}
