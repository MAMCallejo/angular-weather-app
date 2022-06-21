import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeatherSearchPageComponent } from './weather-search-page/weather-search-page.component';
/**
 * Lazy loads weather search page and redirects any other routes to this page.
 */
const routes: Routes = [
  { path: 'weather-search', component: WeatherSearchPageComponent },
  { path: '**', redirectTo: 'weather-search' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
