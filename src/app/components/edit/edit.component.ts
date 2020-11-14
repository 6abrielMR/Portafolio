import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { Global } from 'src/app/services/global';
import { ProjectService } from 'src/app/services/project.service';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-edit',
  templateUrl: '../create/create.component.html',
  styleUrls: ['./edit.component.sass'],
  providers: [ProjectService, UploadService]
})
export class EditComponent implements OnInit {

  public title: string;
  public url: string;
  public project: Project;
  public saveProject;
  public status: string;
  public filesToUpload: Array<File>;

  private ms: number;

  constructor(
    private _projectService: ProjectService,
    private _uploadService: UploadService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.title = "Editar proyecto";
    this.url = Global.url;
    this.ms = 5000;
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      let id = params.id;

      this.getProject(id);
    });
  }

  getProject(id: string): void {
    this._projectService.getProject(id).subscribe(
      response => {
        this.project = response.project;
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  hideMessageStatus(ms: number) {
    setTimeout(() => {
      this.status = 'initiated';
    }, ms);
  }

  onSubmit() {
    this._projectService.updateProject(this.project).subscribe(
      response => {
        if (response.project) {
          //Subir la imagen
          if(this.filesToUpload) {
            this._uploadService.makeFileRequest(
              Global.url + "upload-image/" + response.project._id,
              [],
              this.filesToUpload,
              'image'
            ).then((result: any) => {
              this.saveProject = result.project;
  
              this.status = 'success';
              this.hideMessageStatus(this.ms);
            });
          } else {
            this.saveProject = response.project;
  
            this.status = 'success';
            this.hideMessageStatus(this.ms);
          }
        }
        else {
          this.status = 'failed';
          this.hideMessageStatus(this.ms);
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

}
