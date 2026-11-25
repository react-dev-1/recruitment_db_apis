import { PartialType } from "@nestjs/mapped-types";
import { CreateJobPostingDTO } from "./create-job-posting.dto";
import { IsInt, IsNotEmpty } from "class-validator";

export class UpdateJobPostingDTO extends PartialType(CreateJobPostingDTO) {
    @IsInt()
    @IsNotEmpty()
    id!: number;
}
