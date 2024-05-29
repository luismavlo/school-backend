import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { StudentsInClass } from './students-in-class.entity';


@Entity()
export class Class {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 100 })
  name: string;

  @Column('varchar', { length: 255 })
  description: string;

  @Column('tinyint', { default: 1 })
  status: number;

  @ManyToOne(
    () => Teacher,
    teacher => teacher.classes,
    { onDelete: 'SET NULL' }
  )
  teacher?: Teacher

  @OneToMany(
    () => StudentsInClass,
    studentsInClass => studentsInClass.classes,
    { cascade: true }
  )
  studentInClass?: StudentsInClass[];
}
