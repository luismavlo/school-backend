import { IsArray, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';


export class CreateStudentInClassDto {

  @IsArray()
  @IsNotEmpty()
  studentsId: number[];

}