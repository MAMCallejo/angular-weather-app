import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeatherSearchPageComponent } from './weather-search-page.component';

const routes: Routes = [{ path: '', component: WeatherSearchPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeatherSearchPageRoutingModule { }
