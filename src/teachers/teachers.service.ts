import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TeachersService {

  private readonly logger = new Logger('TeachersService');

  constructor(
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>
  ) { }

  async create (createTeacherDto: CreateTeacherDto) {
    try {
      const teacher = this.teachersRepository.create(createTeacherDto);
      await this.teachersRepository.save(teacher);

      return teacher;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll (paginationDto?: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;

      const total = await this.teachersRepository.count();

      const teachers = await this.teachersRepository.find({
        take: limit,
        skip: offset
      });

      return {
        teachers,
        total
      }
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne (id: number) {

    const teacher = await this.teachersRepository.findOne({
      where: {
        id
      }
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with id ${id} not found`);
    }

    return teacher;

  }

  async update (id: number, updateTeacherDto: UpdateTeacherDto) {
    const teacher = await this.teachersRepository.preload({
      id: id,
      ...updateTeacherDto
    })

    if (!teacher)
      throw new NotFoundException(`Teacher with id ${id} not found`);

    try {
      await this.teachersRepository.save(teacher);

      return teacher;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove (id: number) {
    const teacher = await this.findOne(id);

    await this.teachersRepository.remove(teacher);
  }

  async deleteAllTeachers(){ 
    const queryTeachers = this.teachersRepository.createQueryBuilder('teacher')

    try {
      await queryTeachers.delete().where({}).execute();

      return 'ok'
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private handleExceptions (error: any) {
    if (error.errno === 1062)
      throw new BadRequestException('This teacher already exists');

    this.logger.error(error);

    throw new InternalServerErrorException('Somehting went very wrong!');
  }

}
