import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Game } from 'src/app/models/game.model';
import { SharedService } from 'src/app/shared/shared.service';
import { map, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LandingService } from './landing.service';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit, OnDestroy {
  selected = 0;
  games: Game[] = [];
  id: number = 0;
  subsciption?: Subscription;
  subsciptionGame?: Subscription;
  theme: boolean = false;
  addMode: boolean = false;
  editMode: boolean = false;

  constructor(
    private sharedService: SharedService,
    private landingService: LandingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.selectedName.setValue(0)
    this.subsciptionGame = this.landingService.gamesChanged.subscribe(
      (item: Game[]) => {
        this.games = item;
      }
    );
    this.subsciptionGame.add(
      this.sharedService.themeChanged.subscribe((item: boolean) => {
        this.theme = item;
      })
    );
    this.subsciptionGame.add(
      this.landingService.getGames().subscribe((item: Game[]) => {
        this.games = item;
      })
    );
  }

  ngOnDestroy() {
    this.subsciptionGame?.unsubscribe();
  }

  onDeleteGames() {
    if (typeof this.selectedName.value === 'number')
      this.landingService.deleteGame(this.selectedName.value);
    this.selectedName.reset(0);
  }

  onEditGames(name: string) {
    if (typeof this.selectedName.value === 'number')
      this.landingService.editGame(this.selectedName.value, name);
  }

  onEditToggle() {
    this.editMode = !this.editMode;
    this.addMode = !this.addMode;
    if (typeof this.selectedName.value === 'number'){
      let game = this.games.find(item => item.id === this.selectedName.value)
      this.gameName.setValue(game!.name);
  
    }}

  onSubmit(type: string) {
    if (type === 'start') {
      if (this.addMode === false)
        this.router.navigate(['game', this.selectedName.value]);
      else {
        if (this.gameName.value && this.editMode === false) {
          this.landingService
            .addGame(this.gameName.value)
          this.router.navigate(['game', this.games[this.games.length-1].id]);
        } else if (this.gameName.value) {
          this.onEditGames(this.gameName.value);
          this.gameName.reset('');
          this.addMode = false;
          this.editMode = false;
        }
      }
    } else {
      this.selectedName.reset(0);
      this.addMode = !this.addMode;
    }
  }

  selectedName = new FormControl(0);
  gameName = new FormControl('');
}
