import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wikiItemIcon'
})
export class WikiItemIconPipe implements PipeTransform {
    transform(name: string) {
        name = name.replaceAll(" ", "_");
        return "https://oldschool.runescape.wiki/images/" + name + ".png";
    }
}