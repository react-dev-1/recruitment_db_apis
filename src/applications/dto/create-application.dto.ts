import type { ApplicationStage, ApplicationStatus } from "../application.type";
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreateApplicationDTO {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  applied_at?: Date;

  @IsString()
  @IsOptional()
  source?: string;

  @IsEnum(['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'])
  @IsOptional()
  stage?: ApplicationStage;  

  @IsEnum(['in_progress', 'rejected', 'withdrawn', 'accepted'])
  @IsNotEmpty()
  status!: ApplicationStatus;

  @IsString()
  @IsOptional()
  rejection_reason?: string;
}