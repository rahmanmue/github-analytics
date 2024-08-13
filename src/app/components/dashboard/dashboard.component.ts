import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { UserService } from '../../services/user.service';
import { AsyncPipe, DatePipe, NgClass, NgFor } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectRepos } from '../../state/repos/repos.selectors';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CardComponent,
    NgClass,
    NavbarComponent,
    RouterOutlet,
    RouterLink,
    DatePipe,
    RouterLinkActive,
    AsyncPipe,
    NgFor,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  title = 'Github Analytics';
  user: any;
  active: string = 'repo';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.userService
      .getUser()
      .pipe(
        tap((data) => {
          this.user = data;
        })
      )
      .subscribe({
        error: (err) => console.log(err),
      });
  }

  setTab(tab: string) {
    this.active = tab;
  }
}
