import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { Login } from './login';
import { SupabaseService } from '../services/SupabaseService';

const mockSupabaseService = {
  signIn: vi.fn()
};

describe('Login', () => {
  let component: Login;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
        { provide: SupabaseService, useValue: mockSupabaseService }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ---- TESTS DE EMAIL ----

  it('deberia crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('email vacio deberia ser invalido', () => {
    component.email.set('');
    expect(component.emailValido()).toBe(false);
  });

  it('email sin arroba deberia ser invalido', () => {
    component.email.set('usuariocorreo.com');
    expect(component.emailValido()).toBe(false);
  });

  it('email sin dominio deberia ser invalido', () => {
    component.email.set('usuario@');
    expect(component.emailValido()).toBe(false);
  });

  it('email correcto deberia ser valido', () => {
    component.email.set('usuario@correo.com');
    expect(component.emailValido()).toBe(true);
  });

  // ---- TESTS DE PASSWORD ----

  it('password vacia deberia ser invalida', () => {
    component.password.set('');
    expect(component.passwordValido()).toBe(false);
  });

  it('password menor a 6 caracteres deberia ser invalida', () => {
    component.password.set('abc');
    expect(component.passwordValido()).toBe(false);
  });

  it('password de exactamente 6 caracteres deberia ser valida', () => {
    component.password.set('abc123');
    expect(component.passwordValido()).toBe(true);
  });

  it('password larga deberia ser valida', () => {
    component.password.set('miPasswordSegura123');
    expect(component.passwordValido()).toBe(true);
  });

  // ---- TESTS DEL FORMULARIO COMPLETO ----

  it('formulario deberia ser invalido si email o password son incorrectos', () => {
    component.email.set('noesuncorreo');
    component.password.set('123');
    expect(component.formularioValido()).toBe(false);
  });

  it('formulario deberia ser valido con email y password correctos', () => {
    component.email.set('test@test.com');
    component.password.set('password123');
    expect(component.formularioValido()).toBe(true);
  });

  it('formulario invalido si email valido pero password corta', () => {
    component.email.set('test@test.com');
    component.password.set('123');
    expect(component.formularioValido()).toBe(false);
  });

  it('formulario invalido si password valida pero email malo', () => {
    component.email.set('correosindominio@');
    component.password.set('password123');
    expect(component.formularioValido()).toBe(false);
  });
});
