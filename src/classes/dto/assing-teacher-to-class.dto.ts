import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';



export class AssingTeacherToClassDto {

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  teacherId: number;
}