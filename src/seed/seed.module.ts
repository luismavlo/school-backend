import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ClassesModule } from 'src/classes/classes.module';
import { TeachersModule } from 'src/teachers/teachers.module';
import { StudentsModule } from 'src/students/students.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    ClassesModule,
    TeachersModule,
    StudentsModule
  ]
})
export class SeedModule {}
