import { Component, OnInit } from '@angular/core';
import { Project } from '../../models/project';
import { ProjectService } from '../../services/project.service';
import { UploadService } from '../../services/upload.service';
import { Global } from '../../services/global';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.sass'],
  providers: [ProjectService, UploadService]
})
export class CreateComponent implements OnInit {

  public title: string;
  public project: Project;
  public saveProject;
  public status: string;
  public filesToUpload: Array<File>;
  
  private ms: number;

  constructor(
    private _projectService: ProjectService,
    private _uploadService: UploadService
  ) {
    this.title = 'Crear Proyecto';
    this.project = new Project('', '', '', '', 2020, '', '');
    this.status = 'initiated';
    this.ms = 5000;
  }

  ngOnInit(): void {
  }

  hideMessageStatus(ms: number) {
    setTimeout(() => {
      this.status = 'initiated';
    }, ms);
  }

  onSubmit(form) {
    //Guardar datos básicos
    this.status = 'initiated';
    this._projectService.saveProject(this.project).subscribe(
      response => {
        console.log(response);
        if (response.project) {
          //Subir la imagen
          this._uploadService.makeFileRequest(
            Global.url + "upload-image/" + response.project._id,
            [],
            this.filesToUpload,
            'image'
          ).then((result: any) => {
            this.saveProject = result.project;

            this.status = 'success';
            form.reset();
            this.hideMessageStatus(this.ms);
          });
        }
        else {
          this.status = 'failed';
          this.hideMessageStatus(this.ms);
        }
      },
      error => {
        this.status = 'failed';
        console.log(error);
      }
    );
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

}
