import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NoteModel} from "../../shared/note.model";
import {NotesService} from "../../shared/notes.service";
import {animate, query, stagger, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  animations: [
    trigger('itemAnim', [
      // ENTRY ANIMATION
      transition('void => *', [
        // initial stage
        style({
          height: 0,
          opacity: 0,
          transform: 'scale(0.8)',
          'margin-bottom': 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
          paddingLeft: 0,
        }),
        animate('50ms',style({
          height: '*',
          'margin-bottom': '*',
          paddingTop: '*',
          paddingBottom: '*',
          paddingRight: '*',
          paddingLeft: '*',
        })),
        animate(100)
      ]),
      transition('* => void',[
        animate(50, style({
          transform: 'scale(1.05)'
        })),
        animate(50, style({
          transform: 'scale(1)',
          opacity: 0.75
        })),
        animate('120ms ease-out', style({
          transform: 'scale(0.68)',
          opacity: 0,
        })),
        animate('150ms ease-out', style({
          height: 0,
          'margin-bottom': 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
          paddingLeft: 0,
        }))
      ])
    ]),
    trigger('listAnim',[
      transition('* => *',[
        query(':enter',[
          style({
            opacity: 0,
            height: 0,
          }),
          stagger(100,[
            animate('0.2s ease')
          ])
        ],{
          optional: true
        })
      ])
    ])
  ]
})
export class NotesListComponent implements OnInit {
  notes: NoteModel[]= new Array<NoteModel>();
  filteredNotes: NoteModel[]= new Array<NoteModel>();

  @ViewChild('filterInput') filterInputElementeRef: ElementRef<HTMLInputElement>
  constructor(private noteService: NotesService) { }

  ngOnInit(): void {
    this.notes=this.noteService.getAll();
    //this.filteredNotes=this.noteService.getAll();
    this.filter(' ')
  }
  deleteNote(note: NoteModel){
    let noteId=this.noteService.getId(note)
    this.noteService.delete(noteId);
    this.filter(this.filterInputElementeRef.nativeElement.value)
  }
  getURLLink(note: NoteModel){
    let noteId=this.noteService.getId(note)
    return noteId;
  }
  filter(query: any){
    query=query.toLowerCase().trim();
    let allResults: NoteModel[]= new Array<NoteModel>()
    let terms: string[]=query.split(' ')
    terms=this.removeDuplicates(terms)
    terms.forEach(term=>{
      let results: NoteModel[]=this.relavantNotes(term)
      allResults=[...allResults,...results]
    })
    let uniqueResults=this.removeDuplicates(allResults)
    this.filteredNotes=uniqueResults
    this.sortByRelevancy(allResults)
  }
  removeDuplicates(arr: Array<any>): Array<any>{
    let uniqueTerms: Set<any>= new Set<any>();
    arr.forEach(e=>uniqueTerms.add(e))
    return Array.from(uniqueTerms)
  }
  relavantNotes(query: any): Array<NoteModel>{
    query=query.toLowerCase().trim()
    let relavantNotes=this.notes.filter(note=>{
      if(note.title.toLowerCase().includes(query)||note.body?.toLowerCase().includes(query)){
        return true
      }
      else{
        return false
      }

    })
    return relavantNotes;
  }
  sortByRelevancy(searchResults : NoteModel[]){
    let noteCountObj: Object={};
    searchResults.forEach(note =>{
      let noteId= this.noteService.getId(note)
      if(noteCountObj[noteId]){
        noteCountObj[noteId]+=1
      }else{
        noteCountObj[noteId]=1
      }
    })
    this.filteredNotes=this.filteredNotes.sort((a: NoteModel,b:NoteModel)=>{
      let aId=this.noteService.getId(a)
      let bId=this.noteService.getId(b)

      let aCount=noteCountObj[aId]
      let bCount=noteCountObj[bId]

      return bCount-aCount
    })
  }
}
