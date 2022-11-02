import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Game } from 'src/app/models/game.model';
import { SharedService } from 'src/app/shared/shared.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LandingService } from './landing.service';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit, OnDestroy {
  selected = '';
  games: Game[] = [];
  subsciption?: Subscription;
  subsciptionGame?: Subscription;
  theme: boolean = false;
  addMode: boolean = false;
  editMode: boolean = false;

  constructor(
    private sharedService: SharedService,
    private landingService: LandingService,
    private router: Router,
    private changeRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.changeRef.detectChanges();
  }

  ngOnInit(): void {
    this.games = this.landingService.getGames();
    this.subsciptionGame = this.landingService.gamesChanged.subscribe(
      (item: Game[]) => {
        this.games = item;
        //console.log(item);
      }
    );
    this.subsciptionGame.add(
      this.sharedService.themeChanged.subscribe((item: boolean) => {
        this.theme = item;
      })
    );
  }

  ngOnDestroy() {
    this.subsciptionGame?.unsubscribe();
  }

  onDeleteGames() {
    if (typeof this.selectedName.value === 'number')
      this.landingService.deleteGame(this.selectedName.value);
    this.selectedName.reset('');
  }

  onEditGames(name: string) {
    if (typeof this.selectedName.value === 'number')
      this.landingService.editGame(this.selectedName.value, name);
    this.selectedName.reset('');
  }

  onEditToggle() {
    this.editMode = !this.editMode;
    this.addMode = !this.addMode;
    if (typeof this.selectedName.value === 'number')
      this.gameName.setValue(this.games[this.selectedName.value].name);
    this.selectedName.reset('');
  }

  onSubmit(type: string) {
    if (type === 'start') {
      if (this.addMode === false)
        this.router.navigate(['game', this.selectedName.value]);
      else {
        if (this.gameName.value && this.editMode === false) {
          this.landingService.addGame(this.gameName.value);
          this.router.navigate(['game', this.games.length - 1]);
        } else if (this.gameName.value) {
          this.onEditGames(this.gameName.value);
          this.selectedName.reset('')
          this.gameName.reset('')
          this.addMode = false;
          this.editMode = false;
        }
      }
    } else {
      this.selectedName.reset('');
      this.addMode = !this.addMode;
    }
  }

  selectedName = new FormControl('');
  gameName = new FormControl('');
}
