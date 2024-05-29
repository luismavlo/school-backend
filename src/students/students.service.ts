import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ClassesService } from 'src/classes/classes.service';

@Injectable()
export class StudentsService {

  private readonly logger = new Logger('StudentsService');

  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>
  ) { }

  async create (createStudentDto: CreateStudentDto) {
    try {
      const student = this.studentsRepository.create(createStudentDto);
      await this.studentsRepository.save(student);

      return student;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll (paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;

      const total = await this.studentsRepository.count();

      console.log(total);

      const students = await this.studentsRepository.find({
        take: limit,
        skip: offset
      });

      return {
        students,
        total
      }
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne (id: number) {
    const student = await this.studentsRepository.findOne({
      where: {
        id
      }
    });

    if (!student) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }

    return student;
  }

  async update (id: number, updateStudentDto: UpdateStudentDto) {

    const student = await this.studentsRepository.preload({
      id: id,
      ...updateStudentDto
    })

    if (!student)
      throw new NotFoundException(`Student with id ${id} not found`);

    try {
      await this.studentsRepository.save(student);

      return student;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove (id: number) {
    const student = await this.findOne(id);
    try {
      await this.studentsRepository.remove(student);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async deleteAllStudents(){
    const queryStudents = this.studentsRepository.createQueryBuilder('student')

    try {
      await queryStudents.delete().where({}).execute();

      return 'ok'
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private handleExceptions (error: any) {
    if (error.errno === 1062)
      throw new BadRequestException('This student already exists');

    this.logger.error(error);

    throw new InternalServerErrorException('Somehting went very wrong!');
  }
}
