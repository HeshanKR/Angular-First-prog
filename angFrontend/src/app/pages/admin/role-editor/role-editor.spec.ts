import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleEditor } from './role-editor';

describe('RoleEditor', () => {
  let component: RoleEditor;
  let fixture: ComponentFixture<RoleEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleEditor],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
