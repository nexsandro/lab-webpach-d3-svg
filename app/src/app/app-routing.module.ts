import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProcessosComponent } from './shapes/processos/processos.component';
import { ProcessoComponent } from './shapes/processo/processo.component';
import { AtividadeComponent } from './shapes/atividade/atividade.component';
import { SubatividadeComponent } from './shapes/subatividade/subatividade.component';
import { RiscoComponent } from './shapes/risco/risco.component';

const routes: Routes = [
  { path: 'shapes/processos', component: ProcessosComponent },
  { path: 'shapes/processo', component: ProcessoComponent },
  { path: 'shapes/subatividade', component: SubatividadeComponent },
  { path: 'shapes/atividade', component: AtividadeComponent },
  { path: 'shapes/risco', component: RiscoComponent },
  { path: '', component: ProcessosComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
