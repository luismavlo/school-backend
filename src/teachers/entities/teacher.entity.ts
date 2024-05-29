import { Class } from 'src/classes/entities';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class Teacher {

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
    () => Class,
    classes => classes.teacher,
    { cascade: true }
  )
  classes?: Class[];

}


