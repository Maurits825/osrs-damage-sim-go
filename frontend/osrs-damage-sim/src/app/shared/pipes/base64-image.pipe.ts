import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'base64Image',
})
export class Base64ImagePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(encodedImage: string): SafeResourceUrl {
    var blob = this.dataURItoBlob(encodedImage);
    var url = URL.createObjectURL(blob);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  dataURItoBlob(dataURI: string) {
    var byteString = window.atob(dataURI);

    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    var blob = new Blob([ab], { type: 'image/png' });
    return blob;
  }
}
