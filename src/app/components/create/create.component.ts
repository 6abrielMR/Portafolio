import { Component, OnInit } from '@angular/core';
import { Project } from '../../models/project';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.sass'],
  providers: [ProjectService]
})
export class CreateComponent implements OnInit {

  public title: string;
  public project: Project;
  public status: string;

  constructor(
    private _projectService: ProjectService
  ) {
    this.title = 'Crear Proyecto';
    this.project = new Project('', '', '', '', 2020, '', '');
    this.status = 'initiated';
  }

  ngOnInit(): void {
  }

  hideMessageStatus(ms: number) {
    setTimeout(() => {
      this.status = 'initiated';
    }, ms);
  }

  onSubmit(form) {
    this.status = 'initiated';
    this._projectService.saveProject(this.project).subscribe(
      response => {
        console.log(response);
        if (response.project) {
          this.status = 'success';
          form.reset();
          this.hideMessageStatus(3000);
        }
        else {
          this.status = 'failed';
          this.hideMessageStatus(3000);
        }
      },
      error => {
        this.status = 'failed';
        console.log(error);
      }
    );
  }

}
