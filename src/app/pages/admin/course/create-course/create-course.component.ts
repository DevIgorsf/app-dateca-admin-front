import { Professor } from 'src/app/interfaces/professor';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ElementRef, Inject, ViewChild, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { Course } from 'src/app/interfaces/course';
import { CourseService } from 'src/app/service/course/course.service';
import { ProfessorService } from 'src/app/service/professor/professor.service';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

@Component({
    selector: 'app-create-course',
    templateUrl: './create-course.component.html',
    styleUrls: ['./create-course.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class CreateCourseComponent {
  allProfessors: Professor[] = [];
  professors: Professor[] = [];
  filteredProfessors!: Observable<Professor[]>;
  professorsSubscription: Subscription = new Subscription();

  separatorKeysCodes: number[] = [ENTER, COMMA];
  professorCtrl = new FormControl('');

  validado: boolean = false;

  @ViewChild('professortInput')
  professorInput!: ElementRef<HTMLInputElement>;

  formulario: FormGroup = this.formBuilder.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    semester: ['', Validators.required],
    professor: [[]],
  });

  constructor(
    private service: CourseService,
    private professorService: ProfessorService,
    private formBuilder: FormBuilder,
    private router: Router,
    @Inject(LiveAnnouncer) private announcer: LiveAnnouncer
  ) {}

  ngOnInit(): void {
    this.service.getAll();
    this.professorsSubscription = this.professorService.professors$.subscribe((professors) => {
      this.allProfessors = professors;
      this.filteredProfessors = this.professorCtrl.valueChanges.pipe(
        startWith(null),
        map((professor: string | null) => professor ? this.filterProfessors(professor) : this.allProfessors.slice())
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

  async createCourse(): Promise<void> {
    if (this.formulario.valid) {
      const newCourse: Course = {
        code: this.formulario.get('code')?.value,
        name: this.formulario.get('name')?.value,
        semester: this.formulario.get('semester')?.value,
        professorList: this.professors,
      };
      await this.service.create(newCourse);
      this.router.navigate(['/admin/materia']);
    }
  }

  cancelar() {
    this.router.navigate(['/admin/materia']);
  }

  habilitarBotao(): string {
    if (this.formulario.valid) {
      return 'botao-salvar';
    } else return 'botao-desabilitado';
  }

  campoValidado(campoAtual: string): string {
    if (
      this.formulario.get(campoAtual)?.errors &&
      this.formulario.get(campoAtual)?.touched
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

    if (value) {
      const professorToAdd = this.allProfessors.find((professor) => professor.name === value);

      if (professorToAdd) {
        this.professors.push(professorToAdd);
      }
    }

    event.chipInput!.clear();

    this.professorCtrl.setValue(null);
  }
}

