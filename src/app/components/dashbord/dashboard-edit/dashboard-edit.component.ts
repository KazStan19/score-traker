import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DashBoardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard-edit',
  templateUrl: './dashboard-edit.component.html',
  styleUrls: ['./dashboard-edit.component.css'],
})
export class DashboardEditComponent implements OnInit {
  id: number = 0;
  playerMode: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dbService: DashBoardService
  ) {}

  ngOnInit() {

    this.route.parent?.params.subscribe((params: Params) => {
      this.id = +params['id'];
    });
    this.route.params.subscribe((params: Params) => {
      if(params['type'] !== 'playerAdd' && params['type'] !== 'columnAdd' )this.router.navigate(['game',this.id])
      this.playerMode = params['type'] === 'playerAdd' ? true : false
    });
    
  }

  onNavigateBack() {
    this.router.navigate(['game',this.id]);
  }

  onSubmit() {
    if (this.playerControlInput.value && this.playerMode) {
      this.dbService.addPlayer(this.id, this.playerControlInput.value);
      this.onNavigateBack();
    } else if (this.playerControlInput.value) {
      this.dbService.addColumn(this.id, this.playerControlInput.value);
      this.onNavigateBack();
    }
  }

  playerControlInput = new FormControl('', Validators.required);
}
