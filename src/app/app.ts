import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navegacion } from './navegacion/navegacion';
import { Footer } from './footer/footer';
import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navegacion, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})




export class App implements OnInit {
  protected readonly title = signal('VER0.5');


  ngOnInit() {
    // Inicializa Analytics
    inject();

    // Inicializa Speed Insights
    injectSpeedInsights();
  }









}

