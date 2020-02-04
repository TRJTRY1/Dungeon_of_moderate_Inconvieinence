import { Component, OnInit, OnDestroy, DoCheck } from '@angular/core';
import { Subscription } from 'rxjs';


import { MoveRoomService } from '../move-room.service.js';
import { PlayerArrayService } from '../player-array.service.js';



@Component({
  selector: 'app-dungeon',
  templateUrl: './dungeon.component.html',
  styleUrls: ['./dungeon.component.css']
})
export class DungeonComponent implements OnInit, DoCheck {

  //can_search_for_treasure = this.playerArrayService.getSearchPossible();
  constructor(public move_room_service: MoveRoomService, public playerArrayService: PlayerArrayService) { 

  
  }
  

  ngOnInit() {
    
  }
  
  

  onMoveNorth(){
    let current_position: {x: number, y: number} = this.playerArrayService.getPosition();
   this.playerArrayService.setOldPosition(current_position);
    let new_position= this.move_room_service.moveRoom(0,1,current_position);
    this.playerArrayService.setPosition(new_position);
    this.playerArrayService.setTreasureFound(false);
    //console.log(this.playerArrayService.getOldPosition());
    
      //this.found_treasure = false;
    
    // console.log(current_position);
    // console.log(this.playerArrayService.getPosition());
    
  }

  onMoveSouth(){
    let current_position: {x: number, y: number} = this.playerArrayService.getPosition();
    this.playerArrayService.setOldPosition(current_position);
    let new_position = this.move_room_service.moveRoom(0,-1,current_position);
    this.playerArrayService.setPosition(new_position);
    this.playerArrayService.setTreasureFound(false);
    //console.log(this.playerArrayService.getOldPosition());
    // console.log(current_position);
    // console.log(this.playerArrayService.getPosition());
  }

  onMoveEast(){
    let current_position: {x: number, y: number} = this.playerArrayService.getPosition();
    this.playerArrayService.setOldPosition(current_position);
    let new_position = this.move_room_service.moveRoom(1,0,current_position);
    this.playerArrayService.setPosition(new_position);
    this.playerArrayService.setTreasureFound(false);
    //console.log(this.playerArrayService.getOldPosition());
    // console.log(current_position);
    // console.log(this.playerArrayService.getPosition());

  }

  onMoveWest(){
    let current_position: {x: number, y: number} = this.playerArrayService.getPosition();
    this.playerArrayService.setOldPosition(current_position);
    let new_position = this.move_room_service.moveRoom(-1,0,current_position);
    this.playerArrayService.setPosition(new_position);
    this.playerArrayService.setTreasureFound(false);
    //console.log(this.playerArrayService.getOldPosition());
    // console.log(current_position);
    // console.log(this.playerArrayService.getPosition());
  }

ngDoCheck(){
  // this.can_search_for_treasure = this.playerArrayService.getSearchPossible();
  // console.log(this.can_search_for_treasure);
}
  

}
