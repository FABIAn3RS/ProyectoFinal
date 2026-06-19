import { Component, OnInit, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Navegacion } from './navegacion/navegacion';
import { Footer } from './footer/footer';
import { inject as injectAnalytics } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navegacion, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})




export class App implements OnInit {
  protected readonly title = signal('VER0.5');
  private platformId = inject(PLATFORM_ID);


  ngOnInit() {
    // Only run on the browser, not on the server
    if (isPlatformBrowser(this.platformId)) {
      // Inicializa Analytics
      injectAnalytics();

      // Inicializa Speed Insights
      injectSpeedInsights();
    }
  }









}

