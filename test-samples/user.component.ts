import { Component } from '@angular/core';

@Component({
  selector: 'app-user',
  template: `
    <div>
      <h1>User Profile</h1>
      <h3>Details</h3> <!-- Skipping h2 -->
      
      <img src="avatar.png"> <!-- Missing alt -->
      
      <button (click)="save()">Save</button>
      <button (click)="delete()"></button> <!-- Missing name -->
    </div>
  `
})
export class UserComponent {
  save() {}
  delete() {}
}
