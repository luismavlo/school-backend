import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Class, StudentsInClass } from './entities';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { TeachersService } from 'src/teachers/teachers.service';
import { StudentsService } from 'src/students/students.service';
import { CreateStudentInClassDto } from './dto/create-student-in-class.dto';
import { AssingTeacherToClassDto } from './dto/assing-teacher-to-class.dto';

@Injectable()
export class ClassesService {

  private readonly logger = new Logger('ClassesService');

  constructor(

    private readonly studentService: StudentsService,

    private readonly teacherService: TeachersService,

    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,

    @InjectRepository(StudentsInClass)
    private readonly studentsInClassRepository: Repository<StudentsInClass>,

    private readonly dataSource: DataSource,
  ) { }

  async create (createClassDto: CreateClassDto) {
    try {

      const { teacherId, ...classDetails } = createClassDto;

      let teacher = null;

      if (teacherId === 0) {
        teacher = null;
      }

      if (teacherId) {
        teacher = await this.teacherService.findOne(createClassDto.teacherId)
      }

      const newClass = this.classRepository.create({
        ...classDetails,
        teacher: teacher
      });
      await this.classRepository.save(newClass);

      return createClassDto;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll (paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;

      const total = await this.classRepository.count({ where: { status: 1 } });

      const classes = await this.classRepository.find({
        where: {
          status: 1
        },
        take: limit,
        skip: offset,
        relations: ['teacher'],
      });

      return {
        classes,
        total
      }
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne (id: number) {
    const classFoundIt = await this.classRepository.findOne({
      where: {
        id,
        status: 1
      },
      relations: ['teacher']
    });

    if (!classFoundIt) {
      throw new NotFoundException(`Class with id ${id} not found`);
    }

    return classFoundIt;
  }

  async update (id: number, updateClassDto: UpdateClassDto) {
    const classFoundIt = await this.classRepository.preload({
      id: id,
      ...updateClassDto
    })

    if (!classFoundIt)
      throw new NotFoundException(`Class with id ${id} not found`);

    try {
      await this.classRepository.save(classFoundIt);

      return classFoundIt;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove (id: number) {
    const classFoundIt = await this.findOne(id);
    try {
      classFoundIt.status = 0; 
      await this.classRepository.save(classFoundIt);
      return classFoundIt;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async addStudentToClass (id: number, createStudentInClassDto: CreateStudentInClassDto) {
    const classFoundIt = await this.findOne(id);

    const studentsPromises = createStudentInClassDto.studentsId.map(async (studentId) => {

      const student = await this.studentService.findOne(studentId);

      return student;
    })

    const students = await Promise.all(studentsPromises);

    const studentsInClassData = students.map((student) => {
      return this.studentsInClassRepository.create({
        student: student,
        classes: classFoundIt
      })
    })

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(StudentsInClass, studentsInClassData);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleExceptions(error);
    }
  }

  async addTeacherToClass (id: number, createTeacherInClassDto: AssingTeacherToClassDto) {

    const teacher = await this.teacherService.findOne(createTeacherInClassDto.teacherId);

    const classFoundIt = await this.classRepository.preload({
      id: id,
      teacher: teacher
    })

    if (!classFoundIt)
      throw new NotFoundException(`Class with id ${id} not found`);

    try {
      await this.classRepository.save(classFoundIt);

      return classFoundIt;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findStudents (id: number) {

    const classFoundIt = await this.findOne(id);

    const studentsInClass = await this.studentsInClassRepository.find({
      where: {
        classes: classFoundIt
      },
      relations: ['student']
    })

    return studentsInClass;

  }

  async deleteStudentsInClass(studentId: number) {
    const studentFoundIt = await this.studentService.findOne(studentId);

    const studentsInClass = await this.studentsInClassRepository.find({
      where: {
        student: studentFoundIt
      },
      relations: ['student']
    })

    if (!studentsInClass) {
      return
    }
      
    try {
      await this.studentsInClassRepository.remove(studentsInClass);

      return studentsInClass;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async deleteAllClasses(){

    const queryStudentsInClass = this.studentsInClassRepository.createQueryBuilder('students_in_class')

    const queryClasses = this.classRepository.createQueryBuilder('class')

    try {
      
      await queryStudentsInClass.delete().where({}).execute();

      await queryClasses.delete().where({}).execute();

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
