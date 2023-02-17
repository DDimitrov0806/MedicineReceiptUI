import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  showPIN: boolean=false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['',Validators.required],
      address: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      pin: [null],
      specialty: [null],
      role: ['', [Validators.required]]
    });
  }

  onUserTypeChange() {
    const userRole = this.registerForm.get('role')!.value;
    if (userRole === 'patient') {
      this.registerForm.get('pin')!.setValidators([Validators.required]);
      this.registerForm.get('specialty')!.clearValidators();
    } else {
      this.registerForm.get('pin')!.clearValidators();
      this.registerForm.get('specialty')!.setValidators([Validators.required]);
    }
    this.registerForm.get('pin')!.updateValueAndValidity();
    this.registerForm.get('specialty')!.updateValueAndValidity();
  }

  isPatient(): boolean {
    return this.registerForm.get('role')!.value === 'patient';
  }

  isDoctor(): boolean {
    return this.registerForm.get('role')!.value === 'doctor';
  }

  onSubmit() {
    this.authService.register(this.registerForm.value)
      .subscribe(() => {
        this.router.navigate(['/login']);
      });
  }
}