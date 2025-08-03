import { Routes } from '@angular/router';
import { Tailwind } from './tailwind/tailwind';
import { About } from './about/about';

export const routes: Routes = [
  { path: 'tailwind', component: Tailwind },
  { path: 'about/:username', component: About },
  { path: '', redirectTo: 'tailwind', pathMatch: 'full' },
];
