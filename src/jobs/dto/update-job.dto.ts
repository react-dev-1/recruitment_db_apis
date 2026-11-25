import { PartialType } from "@nestjs/mapped-types";
import { CreateJobDTO } from "./create-job.dto";

export class UpdateJobDTO extends PartialType(CreateJobDTO) {}