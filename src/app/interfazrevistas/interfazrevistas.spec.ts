import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interfazrevistas } from './interfazrevistas';

describe('Interfazrevistas', () => {
  let component: Interfazrevistas;
  let fixture: ComponentFixture<Interfazrevistas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Interfazrevistas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Interfazrevistas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
