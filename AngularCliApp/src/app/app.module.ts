import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { TabMenuModule } from 'primeng/primeng';

import { CarModule } from './car/car.module';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './navmenu/navmenu.component';
import { CarComponent } from './car/car.component';
import { HomeComponent } from './home/home.component';
import { NoContentComponent } from './no-content';

import { HeroDetailComponent } from './hero/hero-detail.component';
import { HeroChildComponent } from './hero/hero-child.component';

export const ROUTES: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'car', component: CarComponent }
    // { path: '**', redirectTo: 'home' }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavMenuComponent,
    CarComponent,
    NoContentComponent,
    HeroDetailComponent,
    HeroChildComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,

    RouterModule.forRoot(ROUTES),

    // import own modules
    CarModule,

    // import primeng modules
    TabMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
