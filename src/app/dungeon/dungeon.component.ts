import { Component, OnInit, OnDestroy, DoCheck} from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { MoveRoomEasyService } from '../services/difficulty/move-room-easy.service';
import { UniqueEncountersService } from '../services/uniqueencounters.service'
import { MoveRoomMediumService } from '../services/difficulty/move-room-medium.service';
import { PlayerArrayService } from '../services/player-array.service';

@Component({
  selector: 'app-dungeon',
  templateUrl: './dungeon.component.html',
  styleUrls: ['./dungeon.component.css']
})


export class DungeonComponent implements OnInit, DoCheck, OnDestroy {

  //can_search_for_treasure = this.playerArrayService.getSearchPossible();
  constructor(
    private router: Router,
    public move_room_easy_service: MoveRoomEasyService, 
    public playerArrayService: PlayerArrayService,
    public uniqueEncounters: UniqueEncountersService,
    public move_room_medium_service: MoveRoomMediumService
    ) {}

    //initialize
    cantGoNorth;
    cantGoSouth;
    cantGoEast;
    cantGoWest;
    currRoom;
    newRoom;

    curr_difficulty;

    subscription: Subscription;
  
  ngOnInit() {
    if(this.playerArrayService.difficulty === ""){
      this.router.navigate(['/']);
    }

    this.playerArrayService.resetPosition();
    this.playerArrayService.setFightResult("");
    if( this.playerArrayService.getName() === '' || this.playerArrayService.getInventory() === []){
      this.router.navigate(['/'])
    }
  
    this.curr_difficulty = this.playerArrayService.getDifficulty();

    //if(this.curr_difficulty == "easy"){
    switch(this.curr_difficulty){
      case "easy":
        this.cantGoNorth = false;
        this.cantGoSouth = true;
        this.cantGoEast = false;
        this.cantGoWest = false;
        break;
      default:
      this.cantGoNorth = false;
      this.cantGoSouth = true;
      this.cantGoEast = false;
      this.cantGoWest = true;
      break;
    }

    this.currRoom = this.playerArrayService.getPosition();
    //this.newRoom = this.playerArrayService.getPosition();
    //console.log(this.newRoom);
  }

  // toggle(arg: boolean){
  //   if(arg == false){
  //     return arg = true;
  //   }
  //   else{
  //     return arg = false;
  //   }
  // };

   
  
  ngDoCheck(){
    let now_where = this.playerArrayService.getPosition();
    //this.curr_difficulty = this.playerArrayService.getDifficulty();
    this.curr_difficulty = window.history.state.difficulty;
    //movement buttons enable/disable for small dungeon
    if(this.curr_difficulty == "easy"){
      if(now_where.x != 1){
        this.cantGoSouth = false;
      }

      if(now_where.x == 1){
        switch(now_where.y){
          case 2:
            //console.log("boss room");
            this.cantGoNorth = true;
            this.cantGoSouth = false;
            this.cantGoEast = true;
            this.cantGoWest = true;
            break;

          case 1:
            //console.log("moved north");
            this.cantGoNorth = false;
            this.cantGoSouth = false;
            this.cantGoEast = false;
            this.cantGoWest = false;
            break;

          case 0:
            this.cantGoNorth = false;
            this.cantGoSouth = true;
            this.cantGoEast = false;
            this.cantGoWest = false;
            break;
          
            default: 
              break;
          }
        }
      }
    //movement buttons enable/disable for 4x4 dungeon
      else{
        if(now_where.x != 0){
            this.cantGoWest = false;
          }
          if(now_where.x == 0){
            this.cantGoWest = true;
          }
          if(now_where.x == 3){
            this.cantGoEast = true;
          }
          if(now_where.x != 3){
            this.cantGoEast = false;
          }
          if(now_where.y == 0){
            this.cantGoSouth = true;
          }
          if(now_where.y != 0){
            this.cantGoSouth = false;
          }
          if(now_where.y == 3){
            this.cantGoNorth = true;
          }
          if(now_where.y != 3){
            this.cantGoNorth = false;
          }
        }
      }

  onMoveNorth(){
    this.uniqueEncounters.setTreasureFound(false);
    let new_position = {};
    let current_position: {x: number, y: number} = this.playerArrayService.getPosition();
    if(window.history.state.difficulty == "easy"){
        new_position= this.move_room_easy_service.moveRoom(0,1,current_position);
    }else{
        new_position = this.move_room_medium_service.moveRoom(0,1,current_position);
    }
    this.playerArrayService.setPosition(new_position);
  }

  onMoveSouth(){
    this.uniqueEncounters.setTreasureFound(false);
    let new_position = {};
    let current_position: {x: number, y: number} = this.playerArrayService.getPosition();
    if(window.history.state.difficulty == "easy"){
       new_position= this.move_room_easy_service.moveRoom(0,-1,current_position);
    }else{
       new_position = this.move_room_medium_service.moveRoom(0,-1,current_position);
    }
    this.playerArrayService.setPosition(new_position);
  }

  onMoveEast(){
    this.uniqueEncounters.setTreasureFound(false);
    let new_position = {};
    let current_position: {x: number, y: number} = this.playerArrayService.getPosition();
    if(window.history.state.difficulty == "easy"){
      new_position= this.move_room_easy_service.moveRoom(1,0,current_position);
    }else{
      new_position = this.move_room_medium_service.moveRoom(1,0,current_position);
    }
    this.playerArrayService.setPosition(new_position);
  }

  onMoveWest(){
    this.uniqueEncounters.setTreasureFound(false);
    let new_position = {};
    let current_position: {x: number, y: number} = this.playerArrayService.getPosition();
    if(window.history.state.difficulty == "easy"){
      new_position= this.move_room_easy_service.moveRoom(-1,0,current_position);
    }else{
      new_position = this.move_room_medium_service.moveRoom(-1,0,current_position);
    }
    this.playerArrayService.setPosition(new_position);
  }

  ngOnDestroy(){
    this.playerArrayService.setDifficulty("");
  }
}
