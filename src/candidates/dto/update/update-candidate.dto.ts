import { PartialType } from '@nestjs/mapped-types';
import { CreateCandidateDTO } from '../create/create-candidate.dto';

export class UpdateCandidateDTO extends PartialType(CreateCandidateDTO) {}
