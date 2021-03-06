import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { PlayerArrayService } from './player-array.service';
import { HealthChangeService } from './health-change.service';
import { MonsterLayoutService } from './monster-layout.service';
import { RoomLayoutService } from './room-layout.service';

import monsters from '../assets/monsters.json';
import bosses from '../assets/bosses.json';
import treasure from '../assets/treasure.json';

@Injectable({
  providedIn: 'root'
})
export class AttackService {

  constructor(
    public playerArray: PlayerArrayService,
    public healthChange: HealthChangeService,
    private router: Router,
    public monster_layout_service: MonsterLayoutService,
    public room_layout_service: RoomLayoutService
  ) { }
  
  bossFight = false;
  currentMonster = '';
  setMonster(monsterName){
    this.currentMonster = monsterName;
  }

  getMonster(){
    return this.currentMonster;
  }

  getStrength(monster){ 
    let chosen = monsters.monsters.filter(function(items) {
      return(items.namePretty === monster);
    })[0];
    let strength = treasure.treasure.filter(function(items) {
      return(items.strength == chosen.weakness);
    })[0];
    return strength;
  }
  getBossStrength(monster){ 
    let chosen = bosses.bosses.filter(function(items) {
      return(items.namePretty === monster);
    })[0];
    let strength = treasure.treasure.filter(function(items) {
      return(items.strength == chosen.weakness);
    })[0];
    return strength;
  }

  addWeakness(){
    try{
      this.playerArray.addToInventory(this.getStrength(this.currentMonster).name);
    } catch{
      this.playerArray.loseHealth();
    }
  }  
  
  addBossWeakness(){
    try{
      this.playerArray.addToInventory(this.getBossStrength(this.currentMonster).name);
    } catch{
      this.playerArray.loseHealth();
    }
  }

  monster_list;
  boss_list;
  treasure_list;
  

  attackDeclared(damageType){
    this.monster_list = this.monster_layout_service.random_monster_layout;
    //bring in boss monsters, random order
    this.boss_list = this.monster_layout_service.random_boss_layout;
    //bring in treasure to find, random order
    this.treasure_list = this.room_layout_service.random_treasure_layout;


    try{
      //console.log("you attacked the " + this.currentMonster + " with the " + damageType);
      let curr_mons = this.currentMonster;
      //console.log(curr_mons);
      let my_monster_entry = monsters.monsters.filter(function(items){
        return(items.namePretty === curr_mons)
      })[0];
      
      //get index of current monster
      let my_index = this.monster_list.map(function(e){return e.namePretty;}).indexOf(curr_mons);
      //console.log(this.treasure_list);

      if(curr_mons === "Honey Badger"){
        this.playerArray.instantDeath();
        this.playerArray.setFightResult(my_monster_entry.fightDamage);
      } else if(curr_mons === "Seer"){
        if(damageType === 'deathnote'){
          this.playerArray.instantDeath();
          this.playerArray.setFightResult(my_monster_entry.fightDamage);
        } else if(this.playerArray.getGold() > 0) {
          let weakness = monsters.monsters;
          let bossWeakness = bosses.bosses;
          let endString = '';

          weakness = weakness.filter(function(items){return(items.weakness === damageType)});
          bossWeakness = bossWeakness.filter(function(items){return(items.weakness === damageType)});

          weakness.forEach(element => { endString = endString + "the " + element.namePretty + " and "; });
          bossWeakness.forEach(element => { endString = endString + "the " + element.namePretty + " and "; });
          endString = endString.slice(0, -5) + '.';

          this.playerArray.setFightResult('Such an item would do well against ' + endString + ' If you were to find them in this dungeon.');
          if(damageType !== 'gold'){//costs gold if not testing gold
            this.playerArray.spendGold();
          }
        } else {
          this.playerArray.setFightResult('She glares at you starting "My sight actually costs money..."');
        }
      } else if(this.usedWeakness(damageType, this.currentMonster)) {
        //console.log(this.monster_list[my_index].dead);
        if(this.monster_list[my_index].dead == false && this.monster_list[my_index].name != "treasure_find"){
          this.playerArray.setFightResult(my_monster_entry.fightDie);   
          this.playerArray.addToInventory(this.treasure_list[my_index].name);
        }
        //console.log("you used the right weapon");
      } else {
        //console.log("you used the wrong weapon");
          this.playerArray.loseHealth();
          this.healthChange.updateLife();
          if(this.monster_list[my_index].dead == false && this.monster_list[my_index].name != "treasure_find"){
            this.playerArray.setFightResult(my_monster_entry.fightDamage);
            this.playerArray.addToInventory(this.treasure_list[my_index].name); }
      }

      //set dead to true
      if(curr_mons !== "Seer"){
        for(var i=0; i< this.monster_list.length; i++){
          if(this.monster_list[i].namePretty == curr_mons && this.monster_list[i].namePretty != ""){
            this.monster_list[i].dead = true;
          }
        }
      }
    } catch (error) {
      let curr_mons = this.currentMonster;
      let my_monster_entry = bosses.bosses.filter(function(items){
        return(items.namePretty === curr_mons)
      })[0];

      //let my_index = this.boss_list.map(function(e){return e.namePretty;}).indexOf(curr_mons);
      //console.log(my_index);
      if(this.usedWeakness(damageType, this.currentMonster)){
        
        this.playerArray.setFightResult(my_monster_entry.fightDie);
        //this.playerArray.addToInventory(this.treasure_list[my_index].name);
        //console.log("you used the right weapon");
      } else {
        //console.log("you used the wrong weapon");
          this.playerArray.loseHealth();
          this.healthChange.updateLife();
          //error line 142?
          this.playerArray.setFightResult(my_monster_entry.fightDamage);
          //this.playerArray.addToInventory(this.treasure_list[my_index].name);
      }
    }
  }

  usedWeakness(damageType, monster){ 
    let chosen = monsters.monsters.filter(function(items) {
    return(items.namePretty === monster);
  })[0];

    try{
      if(chosen.namePretty === '') {
        return true;
      } else if(chosen.weakness === damageType) {
        this.playerArray.addToScore();
        return true;
      } else { 
        return false; 
      }
    } catch (error) {
      let chosen = bosses.bosses.filter(function(items) {
        return(items.namePretty === monster);
      })[0];
      if(chosen.namePretty === '') {
        return true;
      } else if(chosen.weakness === damageType) {
        this.playerArray.addToScore();
        this.router.navigate(['/endScreen'])
        return true;
      } else { 
        this.router.navigate(['/endScreen'])
        return false; 
      }
    }  
  }
}
