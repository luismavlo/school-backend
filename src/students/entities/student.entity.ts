import { StudentsInClass } from 'src/classes/entities';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Student {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { 
    length: 100 
  })
  name: string;

  @Column('varchar', { 
    length: 100 
  })
  surname: string;

  @Column('varchar', {
    unique: true,
  })
  email: string;

  @OneToMany(
    () => StudentsInClass,
    studentsInClass => studentsInClass.student,
    { cascade: true }
  )
  studentInClass?: StudentsInClass[];

}


