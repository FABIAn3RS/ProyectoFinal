import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Updatepassword } from './updatepassword';

describe('Updatepassword', () => {
  let component: Updatepassword;
  let fixture: ComponentFixture<Updatepassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Updatepassword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Updatepassword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
