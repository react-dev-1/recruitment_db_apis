import { PartialType } from "@nestjs/mapped-types";
import { CreateApplicationDTO } from "./create-application.dto";

export class UpdateApplicationDTO extends PartialType(CreateApplicationDTO) {}