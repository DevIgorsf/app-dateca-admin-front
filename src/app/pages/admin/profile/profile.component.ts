import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Professor } from 'src/app/interfaces/professor';
import { ProfessorService } from 'src/app/service/professor/professor.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ProfileComponent {
  updateProfessorForm!: FormGroup;
  newPasswordProfessorForm!: FormGroup;
  validado: boolean = false;

  constructor(
    private service: ProfessorService,
    private fomBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    this.service.getPerfil().subscribe((professor) => {
      this.updateProfessorForm = this.fomBuilder.group({
        registrationNumber: [professor.registrationNumber, Validators.required],
        name: [professor.name, Validators.required],
        phone: [professor.phone, Validators.required],
        email: [professor.email, Validators.required],
      });
    })
    this.newPasswordProfessorForm = this.fomBuilder.group({
      password: ['', Validators.required],
      newPassword: ['', Validators.required],
    })
  }

  async updateProfessor() : Promise<void> {
    if(this.updateProfessorForm.valid) {
      const id = this.route.snapshot.paramMap.get('id')
      const updateProfessor: Professor = this.updateProfessorForm.value;
      await this.service.update(id!, updateProfessor)
      this.router.navigate(['/admin/dashboard']);
    }
  }

  async updatePassword() : Promise<void> {
    if(this.newPasswordProfessorForm.valid) {
      const id = this.route.snapshot.paramMap.get('id')
      const newPassword: Professor = this.newPasswordProfessorForm.value.password;
      await this.service.updatePassword(newPassword)
      this.router.navigate(['/admin/dashboard']);
    }
  }

  cancelar() {
    this.router.navigate(['/admin/dashboard']);
  }

  habilitarBotao(): string {
    if (this.updateProfessorForm.valid) {
      return 'botao-salvar';
    } else return 'botao-desabilitado';
  }

  campoValidado(campoAtual: string): string {
    if (
      this.updateProfessorForm.get(campoAtual)?.errors &&
      this.updateProfessorForm.get(campoAtual)?.touched
    ) {
      this.validado = false;
      return 'form-item input-invalido';
    } else {
      this.validado = true;
      return 'form-item';
    }
  }
}
