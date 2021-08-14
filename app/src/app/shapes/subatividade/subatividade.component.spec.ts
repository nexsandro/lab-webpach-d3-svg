import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubatividadeComponent } from './subatividade.component';

describe('SubatividadeComponent', () => {
  let component: SubatividadeComponent;
  let fixture: ComponentFixture<SubatividadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubatividadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubatividadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
