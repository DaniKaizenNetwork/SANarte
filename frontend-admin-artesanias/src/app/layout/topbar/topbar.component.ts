import { Component } from '@angular/core';
import { Bell, LucideAngularModule, Search, Settings } from 'lucide-angular';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    LucideAngularModule
  ],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  searchTerm = '';

  readonly bellIcon = Bell;
  readonly searchIcon = Search;
  readonly settingsIcon = Settings;

  onSearch(value: string): void {
    this.searchTerm = value.trim();
  }
}
