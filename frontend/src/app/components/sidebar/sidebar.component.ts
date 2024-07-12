import { Component, ViewChild } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { MenubarModule } from 'primeng/menubar';
import { TabMenuModule } from 'primeng/tabmenu';
import { CommonModule } from '@angular/common';
import {
  AuthService,
  isLoggedIn,
  loggedName,
} from '../../services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SidebarModule,
    ButtonModule,
    RippleModule,
    AvatarModule,
    StyleClassModule,
    MenubarModule,
    TabMenuModule,
    CommonModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  sidebarVisible: boolean = false;
  name: string | null = '';
  isLogt: boolean | null = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.name = loggedName();
    this.isLogt = isLoggedIn();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.name = loggedName();
        this.isLogt = isLoggedIn();
      });
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  logout() {
    this.name = '';
    this.isLogt = null;
    this.sidebarVisible = false;
    this.authService.logout();
  }

  permission() {
    const userType = localStorage.getItem('type');
    return userType === 'user';
  }
}
