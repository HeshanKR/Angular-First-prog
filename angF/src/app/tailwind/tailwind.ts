import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../shared/data.service';

@Component({
  standalone: true,
  selector: 'app-tailwind',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './tailwind.html',
  styleUrl: './tailwind.css',
})
export class Tailwind {
  name = '';

  constructor(private dataService: DataService, private router: Router) {}

  goToAbout() {
    this.dataService.setData('name', this.name);
    this.router.navigate(['/about']);
  }
}
