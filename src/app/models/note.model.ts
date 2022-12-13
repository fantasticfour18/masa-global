export class NoteModel {
  id?: number;
  text?: string;
  createdDate?: string;

  constructor(object?: any) {
    this.id = object.noteId;
    this.text = object.note;
    this.createdDate = object.noteDate;
  }
}
