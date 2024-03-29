/** @format */

import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
  providedIn: "root",
})
export class ServerService {
  public url: string = "";
  public token: string = "";

  constructor(private readonly http: HttpClient) {}

  /**
   * Adds auth headers to the request
   */
  private formateRequestHeader(): HttpHeaders {
    let httpHeaders: HttpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.set("Authorization", "Bearer " + this.token);
    return httpHeaders;
  }

  public get<T>(endpoint: string): Observable<T> {
    let headers: any = this.formateRequestHeader();
    return this.http.get<T>(this.url + endpoint, { headers: headers });
  }

  public post<T>(endpoint: string, body: any): Observable<T> {
    let headers: any = this.formateRequestHeader();
    return this.http.post<T>(this.url + endpoint, body, { headers: headers });
  }

  public put<T>(endpoint: string, body: any): Observable<T> {
    let headers: any = this.formateRequestHeader();
    return this.http.put<T>(this.url + endpoint, body, { headers: headers });
  }

  public delete<T>(endpoint: string): Observable<T> {
    let headers: any = this.formateRequestHeader();
    return this.http.delete<T>(this.url + endpoint, { headers: headers });
  }

  public patch<T>(endpoint: string, body: any): Observable<T> {
    let headers: any = this.formateRequestHeader();
    return this.http.patch<T>(this.url + endpoint, body, { headers: headers });
  }

  public downloadFile(url: string) {
    return this.http.get(url, { responseType: "blob" });
  }
}
