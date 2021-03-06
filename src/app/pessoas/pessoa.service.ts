import { Pessoa } from './../core/model';
import { Headers, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { AuthHttp } from 'angular2-jwt';
import { environment } from '../../environments/environment';

export class PessoaFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class PessoaService {

  pessoasUrl = '';

  constructor(private http: AuthHttp) {
    this.pessoasUrl = `${environment.apiUrl}/pessoas`;
   }

  pesquisar(filtro: PessoaFiltro): Promise<any> {
    const params = new URLSearchParams();

    params.set('size', filtro.itensPorPagina.toString());
    params.set('page', filtro.pagina.toString());

    if (filtro.nome) {
      params.append('nome', filtro.nome);
    }

    return this.http.get(this.pessoasUrl, { search: params })
            .toPromise()
            .then(response => {
              const responseJson = response.json();
              const pessoas = responseJson.content;
              const resultado = {
                pessoas: pessoas,
                total: responseJson.totalElements
              };
               return resultado;
          });
  }

  listarTodas(): Promise<any> {
    return this.http.get(this.pessoasUrl)
            .toPromise()
            .then(response => response.json().content);
  }

  excluir(codigo: number): Promise<void> {
    return this.http.delete(`${this.pessoasUrl}/${codigo}`)
            .toPromise()
            .then(() => {});
  }


  mudarStatus(codigo: number, ativo: boolean): Promise<void> {
    return this.http.put(`${this.pessoasUrl}/${codigo}/ativo`, ativo)
            .toPromise()
            .then(() => {});
  }

  adicionar(pessoa: Pessoa): Promise<Pessoa> {
    return this.http.post(this.pessoasUrl, JSON.stringify(pessoa))
            .toPromise()
            .then(response => response.json());
  }

  atualizar(pessoa: Pessoa): Promise<Pessoa> {
    return this.http.put(`${this.pessoasUrl}/${pessoa.codigo}`, JSON.stringify(pessoa))
              .toPromise()
              .then(pessoaAtualizada => {
                return pessoaAtualizada.json() as Pessoa;
              });
  }

  buscarPorCodigo(codigo: number): Promise<Pessoa> {
    return this.http.get(`${this.pessoasUrl}/${codigo}`)
            .toPromise()
            .then(pessoa => {
              return pessoa.json() as Pessoa;
            });
  }




}
