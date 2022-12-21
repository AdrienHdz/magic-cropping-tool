import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dimensions-form',
  templateUrl: './dimensions-form.component.html',
  styleUrls: ['./dimensions-form.component.css']
})
export class DimensionsFormComponent implements OnInit {

  
  width = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(18),
    Validators.max(2048)
  ])

  height = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(18),
    Validators.max(2048)
  ])

  public registerForm = new FormGroup({
    width: this.width,
    height: this.height
  })

  ngOnInit(): void {
  }

}
