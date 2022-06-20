import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'weather-search', loadChildren: () => import('./weather-search-page/weather-search-page.module').then(m => m.WeatherSearchPageModule) },
  { path: '**', redirectTo: 'weather-search' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
