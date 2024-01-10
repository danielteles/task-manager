import { Component, OnInit } from '@angular/core';
import { CsrfService } from './services/csrf.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'task-manager';

  constructor(private csrfService: CsrfService) {}

  ngOnInit() {
    this.csrfService.fetchCsrfToken();
  }
}
