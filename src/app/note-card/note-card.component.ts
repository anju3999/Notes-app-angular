import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})

export class NoteCardComponent implements AfterViewInit {

  @Input('title') title: string;
  @Input('body') body: string;
  @Input('link') link: string;

  @Output('delete') deleteEvent: EventEmitter<void>= new EventEmitter<void>();
  //@ViewChild('truncator') truncator: ElementRef<HTMLElement>;
  @ViewChild('truncator', { static: false })
  truncator?: ElementRef<HTMLElement>;
  @ViewChild('bodyText') bodyText: ElementRef<HTMLElement>;
  constructor(private renderer: Renderer2) { }


  ngAfterViewInit(): void {
    const style = window.getComputedStyle(this.bodyText.nativeElement, null);
    const viewableHeight = parseInt(style.getPropertyValue('height'), 10);
    console.log(this.bodyText.nativeElement.scrollHeight,'=', viewableHeight)
    if (this.bodyText.nativeElement.scrollHeight === viewableHeight){
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'block');
    }
    else{
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'none');
    }
  }
  onXbutton(){
    this.deleteEvent.emit();
  }
}
