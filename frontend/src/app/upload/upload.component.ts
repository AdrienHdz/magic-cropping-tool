import { AfterViewInit, asNativeElements, Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService, FetchingServerState } from '../services/data.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  providers: [DataService]
})
export class UploadComponent implements OnInit, AfterViewInit {
  spinner!: Observable<boolean>;
  isDragover: boolean = false
  file: File | null = null
  nextStep: boolean = false
  imageUrlResponse!: SafeUrl
  imageUrlUpload!: SafeUrl
  
  @ViewChildren("step2", {read: ElementRef})
  step2List!: QueryList<ElementRef>;

  constructor(private dataService: DataService, private sanitizer:DomSanitizer) { }

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

  ngAfterViewInit(): void {
    this.spinner = this.dataService.fetchingState.pipe(
      map(state => state == FetchingServerState.FETCHING)
    )
    this.dataService.image_prediction.subscribe((d: Blob) => {
      this.imageUrlResponse = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(d))
    })
    this.step2List.changes.subscribe(() => {
      if (this.step2List.length> 0) {
        (this.step2List.first.nativeElement as HTMLElement).scrollIntoView({behavior: 'smooth'});
      }
    })
  }

  storeFile($event: Event) {
    this.isDragover = false

    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?
    ($event as DragEvent).dataTransfer?.files.item(0) ?? null :
    ($event.target as HTMLInputElement).files?.item(0) ?? null

    if(!this.file || this.file.type !== 'image/jpeg'
    && this.file.type !== 'image/jpg' && this.file.type !== 'image/png'
    ) {
      return
    }

    this.nextStep = true
    this.imageUrlUpload = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.file))
  }

  inputButtonClicked($event: Event) {
    this.nextStep = false
  }

  uploadFile() {
    const selectedSize = this.registerForm.value;

    if (this.registerForm.valid) {
      this.dataService.detectClick({
        file: this.file,
        width: selectedSize.width,
        height: selectedSize.height
      })
    } else {
      console.log('Form invalid!')
      return
    }
  }

}
