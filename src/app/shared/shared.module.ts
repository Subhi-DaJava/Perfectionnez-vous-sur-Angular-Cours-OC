import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsComponent } from './components/comments/comments.component';
import {MaterialModule} from "./material.module";
import {ReactiveFormsModule} from "@angular/forms";
import {ShortenPipe} from "./custom-pipes/shorten.pipe";
import {FullNamePipe} from "./custom-pipes/full-name.pipe";
import {TimeAgoPipe} from "./custom-pipes/time-ago.pipe";



@NgModule({
  declarations: [
    CommentsComponent,
    ShortenPipe,
    FullNamePipe,
    TimeAgoPipe
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    CommentsComponent,
    MaterialModule,
    ReactiveFormsModule,
    ShortenPipe,
    FullNamePipe,
    TimeAgoPipe
  ]
})
export class SharedModule { }
