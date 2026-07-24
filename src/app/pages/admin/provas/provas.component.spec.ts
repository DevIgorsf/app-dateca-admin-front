import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvasComponent } from './provas.component';

describe('ProvasComponent', () => {
  let component: ProvasComponent;
  let fixture: ComponentFixture<ProvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
