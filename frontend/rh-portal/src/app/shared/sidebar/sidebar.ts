import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent {
  readonly adminNav: NavItem[] = [
    { label: 'Tableau de bord', icon: 'dashboard', route: '/admin/dashboard' },
    { label: 'Employés', icon: 'group', route: '/admin/employees' },
    { label: 'Offres d\'emploi', icon: 'work', route: '/admin/jobs' },
    { label: 'Candidatures', icon: 'assignment_ind', route: '/admin/applications' },
    { label: 'Congés', icon: 'event', route: '/admin/conges' },
    { label: 'Validation des congés', icon: 'task_alt', route: '/admin/conges/validation' },
    { label: 'Paie', icon: 'paid', route: '/admin/paie' },
    { label: 'Évaluations', icon: 'assessment', route: '/admin/performances' }
  ];
}
