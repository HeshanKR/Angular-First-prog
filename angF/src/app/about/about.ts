import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../shared/data.service';
import { Greeting } from '../greeting/greeting'; // 👈 import your component

@Component({
  standalone: true,
  selector: 'app-about',
  imports: [CommonModule, Greeting], // 👈 add it here
  templateUrl: './about.html',
})
export class About {
  username = '';
  name = '';
  designation = 'Scholarship Applicant'; // 👈 your reusable data

  constructor(private route: ActivatedRoute, private dataService: DataService) {
    // Get route param
    this.route.paramMap.subscribe((params) => {
      this.username = params.get('username') ?? 'Unknown';
    });

    // Get non-URL shared data
    this.name = this.dataService.getData('name') || 'No name provided';
  }
}
