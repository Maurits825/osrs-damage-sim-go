import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';

@Pipe({
  name: 'wikiItemIcon',
})
export class WikiItemIconPipe implements PipeTransform {
  constructor(private http: HttpClient) {}

  transform(name: string): Observable<string> {
    name = name.replaceAll(' ', '_');
    const url = 'https://oldschool.runescape.wiki/images/' + name + '.png';
    const url2 = 'https://oldschool.runescape.wiki/images/' + name + '_5.png';

    return this.http.get(url, { observe: 'response' }).pipe(
      map((response) => {
        if (response.status === 200) {
          return url;
        } else {
          return url2;
        }
      }),
      catchError((error) => {
        if (error.status === 404) {
          return of(url2);
        } else {
          return of(url);
        }
      })
    );
  }
}
