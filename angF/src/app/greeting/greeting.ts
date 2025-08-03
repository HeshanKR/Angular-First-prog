import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-greeting',
  imports: [CommonModule],
  templateUrl: './greeting.html',
})
export class Greeting {
  @Input() designation = ''; // Prop-like input
}
