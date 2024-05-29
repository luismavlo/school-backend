import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateStudentDto {

  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  surname: string;

  @IsString()
  @IsEmail()
  email: string;

}
