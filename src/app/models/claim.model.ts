import { NoteModel } from './note.model';

export enum ClaimStatus {
  Pending = 1,
  Approved,
  Declined,
  Inquiry,
}

export class ClaimModel {
  id?: number;
  status?: string;
  amount?: string;
  createdDate?: string;
  patientName?: string;
  memberId?: string;
  denialReason?: string;
  notes?: NoteModel[];

  constructor(object?: any) {
    this.id = object.claimID;
    this.status = object.status.toLowerCase();
    this.amount = object.claimAmount;
    this.createdDate = object.createdDate;
    this.patientName = object.patientName;
    this.memberId = object.memberId;
    this.denialReason = object.ReasonForDenial;

    if (object.MemberClaimNotes && object.MemberClaimNotes.length) {
      const notes: NoteModel[] = [];

      object.MemberClaimNotes.forEach(
        (note: any) => {
          notes.push(new NoteModel(note));
        },
      );

      this.notes = notes;
    }
  }
}
