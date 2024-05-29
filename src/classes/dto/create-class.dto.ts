import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateClassDto {

  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(5)
  description: string;

  @IsNumber()
  @IsOptional()
  teacherId?: number;

}
