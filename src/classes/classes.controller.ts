import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateStudentInClassDto } from './dto/create-student-in-class.dto';
import { AssingTeacherToClassDto } from './dto/assing-teacher-to-class.dto';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto ) {
    return this.classesService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.update(+id, updateClassDto);
  }

  @Post(':id/assing-students')
  addStudentToClass(@Param('id') id: string ,@Body() createStudentInClassDto: CreateStudentInClassDto) {
    return this.classesService.addStudentToClass(+id,createStudentInClassDto);
  }

  @Post(':id/assing-teacher')
  addTeacherToClass(@Param('id') id: string ,@Body() createTeacherInClassDto: AssingTeacherToClassDto) {
    return this.classesService.addTeacherToClass(+id,createTeacherInClassDto);
  }

  @Get(':id/students')
  findStudents(@Param('id') id: string) {
    return this.classesService.findStudents(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classesService.remove(+id);
  }
}
