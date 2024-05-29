import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class, StudentsInClass } from './entities';
import { TeachersModule } from 'src/teachers/teachers.module';
import { StudentsModule } from 'src/students/students.module';

@Module({
  controllers: [ClassesController],
  providers: [ClassesService],
  imports: [
    TypeOrmModule.forFeature([Class, StudentsInClass]),

    TeachersModule,

    StudentsModule
  ],
  exports: [
    ClassesService,
    TypeOrmModule
  ]
})
export class ClassesModule {}
