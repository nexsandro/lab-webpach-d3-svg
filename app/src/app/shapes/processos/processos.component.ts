import { Component, OnInit } from '@angular/core';
import { Processo } from '../model';
import { DATA } from '../data';

@Component({
  selector: 'app-processos',
  templateUrl: './processos.component.html',
  styleUrls: ['./processos.component.css']
})
export class ProcessosComponent implements OnInit {

  processos : Processo[];

  constructor() { }

  ngOnInit() {
    this.processos = DATA;
  }

}
