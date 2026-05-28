import { Component } from '@angular/core';
import { UserShellComponent } from './layout/user-shell/user-shell.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UserShellComponent],
  template: '<app-user-shell />'
})
export class App {}
