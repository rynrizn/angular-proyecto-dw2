import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Navbar } from '../navbar/navbar';

@Component({
  imports: [RouterOutlet, Sidebar, Navbar],
  selector: 'app-layout',
  styleUrl: './layout.css',
  templateUrl: './layout.html',
})
export class Layout {}