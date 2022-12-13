import { Injectable } from '@angular/core';
import { MemberModel } from 'src/app/models/member.model';

@Injectable({
  providedIn: 'root'
})
export class MemberCardService {

  member: MemberModel;

  constructor() { }

  setMemberData(memberData) {
    this.member = memberData;
  }
}
