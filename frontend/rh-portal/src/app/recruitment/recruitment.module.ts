import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RecruitmentComponent } from './recruitment.component';

const routes: Routes = [
  { path: '', component: RecruitmentComponent }
];

@NgModule({
  declarations: [RecruitmentComponent],
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class RecruitmentModule {}
