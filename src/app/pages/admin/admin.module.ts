import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule, NgFor } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfessorsComponent } from './professors/professors.component';
import { StudentsComponent } from './students/students.component';
import { AdminComponent } from './admin.component';
import { NavbarComponent } from 'src/app/shared/navbar/navbar.component';
import { SidebarComponent } from 'src/app/shared/sidebar/sidebar.component';
import { CreateProfessorComponent } from './professors/create-professor/create-professor.component';
import { CourseComponent } from './course/course.component';
import { MessageModule } from 'src/app/shared/message/message.module';
import { UpdateProfessorComponent } from './professors/update-professor/update-professor.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CreateCourseComponent } from './course/create-course/create-course.component';
import { UpdateCourseComponent } from './course/update-course/update-course.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { QuestionComponent } from './question/question.component';
import { CreateQuestionComponent } from './question/create-question/create-question.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { CardComponent } from 'src/app/shared/card/card.component';
import { FormTextFieldComponent } from 'src/app/shared/form-text-field/form-text-field.component';
import { MatRadioModule } from '@angular/material/radio';
import { RankingComponent } from './ranking/ranking.component';
import { ProfileComponent } from './profile/profile.component';
import { EnadeComponent } from './enade/enade.component';
import { CreateEnadeComponent } from './enade/create-enade/create-enade.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';


@NgModule({
  declarations: [
    DashboardComponent,
    ProfessorsComponent,
    StudentsComponent,
    CreateProfessorComponent,
    CourseComponent,
    NavbarComponent,
    SidebarComponent,
    CardComponent,
    AdminComponent,
    FormTextFieldComponent,
    UpdateProfessorComponent,
    CreateCourseComponent,
    UpdateCourseComponent,
    QuestionComponent,
    CreateQuestionComponent,
    RankingComponent,
    ProfileComponent,
    EnadeComponent,
    CreateEnadeComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MessageModule,
    MatFormFieldModule,
    NgFor,
    MatAutocompleteModule,
    MatCardModule,
    MatSelectModule,
    MatChipsModule,
    MatRadioModule,
    MatIconModule,
    AsyncPipe,
    CanvasJSAngularChartsModule
  ],
  exports: [AdminComponent],
})
export class AdminModule { }
