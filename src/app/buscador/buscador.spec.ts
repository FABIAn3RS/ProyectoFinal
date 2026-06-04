import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { Buscador } from './buscador';
import { SupabaseService } from '../services/SupabaseService';
import { Revistaplantilla } from '../interfazrevistas/interfazrevistas';

const mockSupabaseService = {
  getRevistas: vi.fn().mockResolvedValue([])
};

const revistasMock: Revistaplantilla[] = [
  { id: '1', titulo: 'Inteligencia Artificial en Salud', autor: 'Juan',
    universidad: 'UTE', categoria: 'Tecnología', fecha: '2024-01-01',
    resumen: 'Resumen 1', status: 'APR', user_id: 'u1', IA_valoracion: '5' },

  { id: '2', titulo: 'Historia del Ecuador', autor: 'Maria',
    universidad: 'PUCE', categoria: 'Historia', fecha: '2024-02-01',
    resumen: 'Resumen 2', status: 'APR', user_id: 'u2', IA_valoracion: '4' },

  { id: '3', titulo: 'Arte Moderno', autor: 'Carlos',
    universidad: 'UCE', categoria: 'Arte', fecha: '2024-03-01',
    resumen: 'Resumen 3', status: 'APR', user_id: 'u3', IA_valoracion: '3' },
];

describe('Buscador', () => {
  let component: Buscador;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Buscador],
      providers: [
        provideRouter([]),
        { provide: SupabaseService, useValue: mockSupabaseService }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(Buscador);
    component = fixture.componentInstance;
    (component as any).revistas.set(revistasMock);
    fixture.detectChanges();
  });

  it('deberia crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('sin criterio deberia mostrar todas las revistas', () => {
    component.criterio_busqueda.set('');
    component.selectcategoria.set('');
    expect(component.resultado().length).toBe(3);
  });

  it('buscar por titulo deberia filtrar correctamente', () => {
    component.criterio_busqueda.set('inteligencia');
    component.selectcategoria.set('');
    expect(component.resultado().length).toBe(1);
    expect(component.resultado()[0].titulo).toBe('Inteligencia Artificial en Salud');
  });

  it('buscar termino inexistente deberia retornar lista vacia', () => {
    component.criterio_busqueda.set('xyzterminoinexistente');
    component.selectcategoria.set('');
    expect(component.resultado().length).toBe(0);
  });

  it('busqueda deberia ser insensible a mayusculas', () => {
    component.criterio_busqueda.set('HISTORIA');
    component.selectcategoria.set('');
    expect(component.resultado().length).toBe(1);
  });

  it('filtrar por categoria deberia retornar solo las de esa categoria', () => {
    component.criterio_busqueda.set('');
    component.selectcategoria.set('Arte');
    expect(component.resultado().length).toBe(1);
    expect(component.resultado()[0].categoria).toBe('Arte');
  });

  it('categoria inexistente deberia retornar lista vacia', () => {
    component.criterio_busqueda.set('');
    component.selectcategoria.set('Medicina');
    expect(component.resultado().length).toBe(0);
  });

  it('titulo y categoria combinados deberia filtrar correctamente', () => {
    component.criterio_busqueda.set('inteligencia');
    component.selectcategoria.set('Tecnología');
    expect(component.resultado().length).toBe(1);
  });

  it('titulo correcto pero categoria incorrecta deberia retornar vacio', () => {
    component.criterio_busqueda.set('inteligencia');
    component.selectcategoria.set('Historia');
    expect(component.resultado().length).toBe(0);
  });
});
