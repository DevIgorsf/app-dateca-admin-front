import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Professor } from 'src/app/interfaces/professor';
import { ProfessorService } from 'src/app/service/professor/professor.service';

@Component({
    selector: 'app-update-professor',
    templateUrl: './update-professor.component.html',
    styleUrls: ['./update-professor.component.scss'],
    standalone: false
})
export class UpdateProfessorComponent {
  updateProfessorForm!: FormGroup
  validado: boolean = false;

  constructor(
    private service: ProfessorService,
    private fomBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    this.service.getProfessor(parseInt(id!)).subscribe((professor) => {
      this.updateProfessorForm = this.fomBuilder.group({
        registrationNumber: [professor.registrationNumber, Validators.required],
        name: [professor.name, Validators.required],
        phone: [professor.phone, Validators.required],
        email: [professor.email, Validators.required],
      });
    })
  }

  async updateProfessor() : Promise<void> {
    if(this.updateProfessorForm.valid) {
      const id = this.route.snapshot.paramMap.get('id')
      const updateProfessor: Professor = this.updateProfessorForm.value;
      await this.service.update(id!, updateProfessor)
      this.router.navigate(['/admin/professor']);
    }
  }

  cancelar() {
    this.router.navigate(['/admin/professor']);
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
