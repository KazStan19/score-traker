import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DashBoardService } from './dashboard.service';
import { Subscription } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { Player } from 'src/app/models/player.modle';
import { Game } from 'src/app/models/game.model';

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css'],
})
export class DashbordComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [];
  dataSource: any;

  id: number = 0;
  idUser?: number;
  columnId?: number;
  type: string = '';

  subscribtion!: Subscription;

  inputToggle: boolean = true;
  editMode: boolean = false;
  editToggle: boolean = false;

  constructor(
    private dbService: DashBoardService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscribtion = this.dbService.contentChanged.subscribe((item) => {
      this.dataSource = item;
    });

    this.subscribtion.add(
      this.dbService.displayedColumnsChanged.subscribe((item) => {
        this.displayedColumns = item;
      })
    );

    this.subscribtion.add(
      this.route.params.subscribe((params: Params) => {
        this.id = +params['id'];
      })
    );

    this.subscribtion.add(
      this.dbService.getColumns(this.id).subscribe((res) => {
        let foundColumnSet = res.find((item) => +item.id === this.id);
        this.displayedColumns = foundColumnSet!.columns;
      })
    );

    this.subscribtion.add(
      this.dbService.getGame(this.id).subscribe((res: Game[]) => {
        this.dataSource = res.find((item) => item.id === this.id);
      })
    );
  }

  handleSubmit() {
    if (!this.editMode && this.idUser !== undefined) {
      this.dbService.addScores(
        this.id,
        this.idUser,
        this.columnId,
        this.scoreInput.value!
      );
      this.scoreInput.setValue(0);
      this.inputToggle = !this.inputToggle;
      this.idUser = undefined;
      this.columnId = undefined;
    }
    if (this.editMode) {
      this.dbService.editItem(
        this.id,
        this.idUser,
        this.columnId,
        this.editInput.value!
      );
      this.editInput.setValue('');
      this.editToggle = !this.editToggle;
      this.idUser = undefined;
      this.columnId = undefined;
    }
  }

  addNavigate(type: string) {
    this.editMode = false;
    this.editToggle = false;
    this.inputToggle = true;
    this.router.navigate(['game', this.id,type]);
  }

  onToggle(id: number, columnId: number | undefined) {
    this.idUser = id;
    this.columnId = columnId;
    this.inputToggle = !this.inputToggle;
    this.editMode = false;
    this.editToggle = false;
    this.router.navigate(['game', this.id]);
  }

  ngOnDestroy(): void {
    if(this.subscribtion)this.subscribtion.unsubscribe();
  }

  onEditControl(type: string) {
    this.editMode = !this.editMode;
    this.editToggle = false;
    this.type = type;
    this.router.navigate(['game', this.id]);
  }

  onClick(columnId: number | undefined, userId: number | undefined) {
    if (this.editMode) {
      if (this.type === 'delete') {
        this.dbService.deleteItem(this.id, userId, columnId);
        this.idUser = undefined;
        this.columnId = undefined;
      }

      if (this.type === 'edit') {
        let index = this.dataSource.players.findIndex(
          (player: Player) => player.id === userId
        );
        if (userId !== undefined) {
          this.idUser = userId;
          if (columnId !== undefined) {
            this.columnId = columnId;
            this.editInput.setValue(
              +this.dataSource.players[index].score[columnId]
            );
          } else this.editInput.setValue(this.dataSource.players[index].name);
        }
        if (columnId && userId === undefined) {
          this.columnId = columnId;
          this.editInput.setValue(this.displayedColumns[columnId]);
        }
        this.editToggle = !this.editToggle;
      }
    }
  }

  scoreInput = new FormControl<number>(0, [
    Validators.required,
    Validators.pattern(/^-?(0|[1-9]\d*)?$/),
  ]);
  editInput = new FormControl<number | string>('', [Validators.required]);
}
