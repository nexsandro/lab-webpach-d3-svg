import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorComponent } from './shapes/editor/editor.component';
import { ProcessosComponent } from './shapes/processos/processos.component';
import { ProcessoComponent } from './shapes/processo/processo.component';
import { AtividadeComponent } from './shapes/atividade/atividade.component';
import { SubatividadeComponent } from './shapes/subatividade/subatividade.component';
import { RiscoComponent } from './shapes/risco/risco.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    ProcessosComponent,
    ProcessoComponent,
    AtividadeComponent,
    SubatividadeComponent,
    RiscoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
