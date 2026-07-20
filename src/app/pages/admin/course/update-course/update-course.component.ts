import { Professor } from 'src/app/interfaces/professor';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ElementRef, Inject, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { Course } from 'src/app/interfaces/course';
import { CourseService } from 'src/app/service/course/course.service';
import { ProfessorService } from 'src/app/service/professor/professor.service';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

@Component({
    selector: 'app-update-course',
    templateUrl: './update-course.component.html',
    styleUrls: ['./update-course.component.scss'],
    standalone: false
})
export class UpdateCourseComponent {
  allProfessors: Professor[] = [];
  professors: Professor[] = [];
  filteredProfessors!: Observable<Professor[]>;
  professorsSubscription: Subscription = new Subscription();

  updateCourseForm!: FormGroup
  validado: boolean = false;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  professorCtrl = new FormControl('');

  @ViewChild('professortInput')
  professorInput!: ElementRef<HTMLInputElement>;

  constructor(
    private service: CourseService,
    private fomBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private professorService: ProfessorService,
    private formBuilder: FormBuilder,
    @Inject(LiveAnnouncer) private announcer: LiveAnnouncer
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    this.service.getCourse(parseInt(id!)).subscribe((course) => {
      this.updateCourseForm = this.fomBuilder.group({
        code: [course.code, Validators.required],
        name: [course.name, Validators.required],
        semester: [course.semester, Validators.required],
        professorList: [course.professorList, Validators.required],
      });
      this.professors = course.professorList;
    });
    this.service.getAll();
    this.professorsSubscription = this.professorService.professors$.subscribe((professors) => {
      this.allProfessors = professors;
      this.filteredProfessors = this.professorCtrl.valueChanges.pipe(
        startWith(null),
        map((professor: string | null) => professor ? this.filterProfessors(professor) : this.allProfessors.slice())
      );
      
      this.filteredProfessors = this.filteredProfessors.pipe(
        map(professors => professors.filter(p => !this.professors.some(selectedProf => selectedProf.name === p.name)))
      );

    });
  }

  filterProfessors(value: string): Professor[] {
    const filterValue = value.toLowerCase();
    return this.allProfessors.filter((professor) =>
      professor.name?.toLowerCase().includes(filterValue) &&
      !this.professors.some(selectedProf => selectedProf.name === professor.name)
    );
  }

  async updateCourse(): Promise<void> {
    if (this.updateCourseForm.valid) {
      const newCourse: Course = {
        code: this.updateCourseForm.get('code')?.value,
        name: this.updateCourseForm.get('name')?.value,
        semester: this.updateCourseForm.get('semester')?.value,
        professorList: this.professors,
      };
      const id = this.route.snapshot.paramMap.get('id')
      await this.service.update(id!, newCourse);
      this.router.navigate(['/admin/materia']);
    }
  }

  cancelar() {
    this.router.navigate(['/admin/materia']);
  }

  habilitarBotao(): string {
    if (this.updateCourseForm.valid) {
      return 'botao-salvar';
    } else return 'botao-desabilitado';
  }

  campoValidado(campoAtual: string): string {
    if (
      this.updateCourseForm.get(campoAtual)?.errors &&
      this.updateCourseForm.get(campoAtual)?.touched
    ) {
      this.validado = false;
      return 'form-item input-invalido';
    } else {
      this.validado = true;
      return 'form-item';
    }
  }

  remove(professor: Professor): void {
    const index = this.professors.indexOf(professor);

    if (index >= 0) {
      this.professors.splice(index, 1);

      this.filteredProfessors = this.filteredProfessors.pipe(map(professors => [...professors, professor]));
    }

    this.announcer.announce(`Removed ${professor.name}`);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const professor = event.option.value as Professor;
    this.professors.push(professor);

    this.filteredProfessors = this.filteredProfessors.pipe(map(professors => professors.filter(p => p.name !== professor.name)));

    this.professorInput.nativeElement.value = '';
    this.professorCtrl.setValue(null);
  }

  add(event: MatChipInputEvent): void {
    const value = event.value.trim();

    // Check if the input value is not empty
    if (value) {
      const professorToAdd = this.allProfessors.find((professor) => professor.name === value);

      // If the professor is found, add it to the list of professors
      if (professorToAdd) {
        this.professors.push(professorToAdd);
      }
    }

    // Clear the input value
    event.chipInput!.clear();

    this.professorCtrl.setValue(null);
  }
}

