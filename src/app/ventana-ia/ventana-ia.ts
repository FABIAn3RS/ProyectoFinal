import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-ventana-ia',
  standalone: true,
  imports: [MatDialogModule], // Asegúrate de importar esto
  template: `
    <h2 mat-dialog-title>Resumen de IA</h2>
    <mat-dialog-content>
      <p>{{ data.texto || 'Sin resumen disponible' }}</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `
})
export class VentanaIA {
  // Al poner 'public' en el constructor, Angular crea la variable automáticamente
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}