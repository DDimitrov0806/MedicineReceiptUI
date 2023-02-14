import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'MedicineReceipts';
  dtOptions: DataTables.Settings = {};
  posts: any;

  isLoggedIn = false;
  username?: string;
   
  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    public authService: AuthService) { }
   
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };
   
    this.http.get('http://jsonplaceholder.typicode.com/posts')
      .subscribe(posts => {
        this.posts = posts;
    });

    this.isLoggedIn = this.storageService.isLoggedIn();
  }
}
