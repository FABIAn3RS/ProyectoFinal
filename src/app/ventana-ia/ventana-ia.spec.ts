import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaIA } from './ventana-ia';

describe('VentanaIA', () => {
  let component: VentanaIA;
  let fixture: ComponentFixture<VentanaIA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentanaIA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentanaIA);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
