import { environment } from './../../environments/environment';
import { Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class CategoriaService {

  categoriasUrl = '';

  constructor(private http: AuthHttp) {
    this.categoriasUrl = `${environment.apiUrl}/categorias`;
  }


  listarTodas(): Promise<any> {
    return this.http.get(this.categoriasUrl)
            .toPromise()
            .then(response => response.json());
  }

}
