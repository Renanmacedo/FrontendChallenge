import { Component } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Team } from "@summoners-app/core/model/teams";
import { ManagementTeamsService } from "../../management.service";
import { timeout } from 'rxjs/operators'
import { of } from "rxjs";
import routes from "environments/routes";
import { Router } from "@angular/router";

@Component({
    selector: 'summoners-add-championship',
    templateUrl: './add-championship.html',
    styleUrls: ['./add-championship.scss']
})
export class AddChampionShip {
  teamForm: FormGroup;
  championshipForm: FormGroup;
  showTeam: boolean;
  listTeams: Array<Team[]> = new Array<Team[]>();

  constructor(
    private managerService: ManagementTeamsService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.createForm();
    
  }

  nextStep() {
    this.showTeam = !this.showTeam;
  }
  prevStep() {
    this.showTeam = !this.showTeam
  }  
  createTournament() {

    let body = {...this.championshipForm.value};
    this.teams.controls.forEach((item, index) => {
        let keys = [ 
          [{ name: item.get('firstTeam').value, points: 0, id: `${btoa(item.get('firstTeam').value)}`,winner: false }
          ,{ name: item.get('secondTeam').value, points: 0, id: `${btoa(item.get('secondTeam').value)}`,winner: false }
          ]
        ]
        this.listTeams.push(...keys);
    });
    body['teams'] = this.listTeams;
    this.managerService.post(routes.teams.createTeams, body).subscribe( response => {
      this.router.navigate(['/management/search']);
    })
  }
  //#region private methods

  
  private createForm() {
    this.teamForm = this.fb.group({
      name: [null, [Validators.compose([Validators.required, Validators.maxLength(50)])]],
    });

    this.championshipForm = this.fb.group({
      name: [null, [Validators.compose([Validators.required])]],
      teams: this.fb.array([
        this.createFormArray(), this.createFormArray(),
        this.createFormArray(), this.createFormArray()
      ])   
    })

    console.log(this.championshipForm);
  }
  private createFormArray() {
    return this.fb.group({
      firstTeam: [null, [Validators.compose([Validators.required])]],
      secondTeam: [null, [Validators.compose([Validators.required])]]
    })    
  }
  private generateId() {
    
  }

  //#endregion

  get teams(): FormArray { return this.championshipForm.get('teams') as FormArray };

  get title() { return this.showTeam ? 'Adicionar Time' : 'Criar Torneio'}
}