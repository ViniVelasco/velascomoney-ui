import { FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';

import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';

import { ToastyService } from 'ng2-toasty';

import { PessoaService, PessoaFiltro } from './../pessoa.service';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { Pessoa } from '../../core/model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent implements OnInit {

  pessoas = [];
  totalRegistros = 0;
  filtro = new PessoaFiltro();

  @ViewChild('tabelaPessoas') tabelaPessoas;

  constructor(private pessoaService: PessoaService,
              private toasty: ToastyService,
              private confirmation: ConfirmationService,
              private errorHandler: ErrorHandlerService,
              private title: Title) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa de Pessoa');
    // this.pesquisar();
  }

  pesquisar(pagina = 0) {

    this.filtro.pagina = pagina;

    this.pessoaService.pesquisar(this.filtro)
    .then(resultado => {
      this.pessoas = resultado.pessoas;
      this.totalRegistros = resultado.total;
      console.log(this.pessoas);
    });
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  confirmarExclusao(pessoa: any) {
    this.confirmation.confirm({
      message: 'Deseja excluir a pessoa?',
      accept: () => {
        this.excluir(pessoa);
      }
    });
  }

  excluir(pessoa: any) {
    this.pessoaService.excluir(pessoa.codigo)
      .then(() => {
        if (this.tabelaPessoas.first === 0) {
          this.pesquisar();
        } else {
          this.tabelaPessoas.first = 1;
        }

        this.toasty.success('Pessoa excluída com sucesso');
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  mudarStatus(pessoa: any) {
    this.pessoaService.mudarStatus(pessoa.codigo, !pessoa.ativo)
      .then(() => {
        if (this.tabelaPessoas.first === 0) {
          this.pesquisar();
        } else {
          this.tabelaPessoas.first = 1;
        }

        const alterada = pessoa.ativo === true ? 'desativada' : 'ativada';

        this.toasty.success(`Pessoa ${alterada} com sucesso`);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
