import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { DateFormatPipe } from './date';

@Pipe({
  name: 'DateFormatImpure',
  pure: false
})

@Injectable()
export class DateFormatImpurePipe extends DateFormatPipe { }
