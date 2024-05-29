import { Injectable } from '@nestjs/common';
import { ClassesService } from 'src/classes/classes.service';
import { StudentsService } from 'src/students/students.service';
import { TeachersService } from 'src/teachers/teachers.service';
import { programmingClasses, students, teachers } from './data/seed-data';


@Injectable()
export class SeedService {

  constructor(
    private readonly classesService: ClassesService,
    private readonly studentsService: StudentsService,
    private readonly teachersService: TeachersService
  ) {}
  
  async runSeed(){

    await this.inserNewClasses();
    await this.inserNewStudents();
    await this.inserNewTeachers();

    return 'seed executed'
  }

  private async inserNewClasses(){
    await this.classesService.deleteAllClasses();

    const initDataClasses = programmingClasses

    const insertPromises = [];

    initDataClasses.forEach(classDetail => {
      insertPromises.push(this.classesService.create(classDetail))
    })

    await Promise.all(insertPromises);

    return true
  }

  private async inserNewStudents(){
    await this.studentsService.deleteAllStudents();

    const initDataStudents = students;

    const insertPromises = [];

    initDataStudents.forEach(student => {
      insertPromises.push(this.studentsService.create(student))
    })

    await Promise.all(insertPromises);

    return true
  }

  private async inserNewTeachers(){
    await this.teachersService.deleteAllTeachers();

    const initDataTeachers = teachers;

    const insertPromises = [];

    initDataTeachers.forEach(teacher => {
      insertPromises.push(this.teachersService.create(teacher))
    })

    await Promise.all(insertPromises);

    return true
  }

}
