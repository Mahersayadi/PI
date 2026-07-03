import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AiComponent } from './ai.component';

const routes: Routes = [
  { path: '', component: AiComponent }
];

@NgModule({
  declarations: [AiComponent],
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class AiModule {}
