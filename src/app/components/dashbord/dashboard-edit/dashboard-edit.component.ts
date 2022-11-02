import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
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
    this.route.pathFromRoot[1].params.subscribe((params: Params) => {
      this.id = +params['id'];
    });

    if (
      this.router.url.split('/')[this.router.url.split('/').length - 1] ===
      'playerAdd'
    )
      this.playerMode = !this.playerMode;
  }

  onNavigateBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onSubmit() {
    if (this.playerControlInput.value && this.playerMode) {
      this.dbService.addPlayer(this.id, this.playerControlInput.value);
      this.onNavigateBack();
    } else if (this.playerControlInput.value){
      this.dbService.addColumn(this.id, this.playerControlInput.value);
      this.onNavigateBack();
    }
  }

  playerControlInput = new FormControl('');
}
