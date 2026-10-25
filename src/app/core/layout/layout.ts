import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';
import { Navbar } from './components/navbar/navbar';

@Component({
  imports: [RouterOutlet, Sidebar, Navbar],
  selector: 'app-layout',
  styleUrl: './layout.css',
  templateUrl: './layout.html',
})
export class Layout {}