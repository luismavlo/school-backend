import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { ClassesModule } from 'src/classes/classes.module';

@Module({
  controllers: [TeachersController],
  providers: [TeachersService],
  imports: [
    TypeOrmModule.forFeature([Teacher]),
  ],
  exports: [
    TeachersService,
    TypeOrmModule
  ]
})
export class TeachersModule {}
