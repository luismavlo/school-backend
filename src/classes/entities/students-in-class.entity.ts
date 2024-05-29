import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Class } from './class.entity';
import { Student } from 'src/students/entities/student.entity';


@Entity()
export class StudentsInClass {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(
        () => Class,
        classes => classes.studentInClass,
    )
    classes: Class

    @ManyToOne(
        () => Student,
        student => student.studentInClass,
        { onDelete: 'CASCADE' }
    )
    student: Student
}