import { AdminComponent } from './admin.component';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfessorsComponent } from './professors/professors.component';
import { StudentsComponent } from './students/students.component';

import { CourseComponent } from './course/course.component';
import { CreateProfessorComponent } from './professors/create-professor/create-professor.component';
import { UpdateProfessorComponent } from './professors/update-professor/update-professor.component';
import { CreateCourseComponent } from './course/create-course/create-course.component';
import { UpdateCourseComponent } from './course/update-course/update-course.component';
import { QuestionComponent } from './question/question.component';
import { CreateQuestionComponent } from './question/create-question/create-question.component';
import { RankingComponent } from './ranking/ranking.component';
import { ProfileComponent } from './profile/profile.component';
import { EnadeComponent } from './enade/enade.component';
import { CreateEnadeComponent } from './enade/create-enade/create-enade.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'perfil',
        component: ProfileComponent,
      },
      {
        path: 'professor',
        component: ProfessorsComponent,
      },
      {
        path: 'professor/adicionar-professor',
        component: CreateProfessorComponent,
      },
      {
        path: 'professor/editar-professor/:id',
        component: UpdateProfessorComponent,
      },
      {
        path: 'aluno',
        component: StudentsComponent,
      },
      {
        path: 'materia',
        component: CourseComponent,
      },
      {
        path: 'materia/adicionar-materia',
        component: CreateCourseComponent,
      },
      {
        path: 'materia/editar-materia/:id',
        component: UpdateCourseComponent,
      },
      {
        path: 'questao',
        component: QuestionComponent,
      },
      {
        path: 'questao/adicionar-questao',
        component: CreateQuestionComponent,
      },
      {
        path: 'questao/editar-questao/:id',
        component: CreateQuestionComponent,
      },
      {
        path: 'enade',
        component: EnadeComponent,
      },
      {
        path: 'enade/adicionar-enade',
        component: CreateEnadeComponent,
      },
      {
        path: 'enade/editar-enade/:id',
        component: CreateEnadeComponent,
      },
      {
        path: 'ranking',
        component: RankingComponent,
      },
      {
        path: 'importacao',
        loadComponent: () =>
          import('./importacao/upload/importacao-upload.component').then((m) => m.ImportacaoUploadComponent),
      },
      {
        path: 'importacao/:jobId/revisao',
        loadComponent: () =>
          import('./importacao/revisao/importacao-revisao.component').then((m) => m.ImportacaoRevisaoComponent),
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
