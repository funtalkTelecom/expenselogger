import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  cateLeft=[];
  cateRight=[];

  constructor() {

    for(let i=0;i<20;i++)
    {this.cateRight.push({
      pic:'https://thumbs.dreamstime.com/b/online-shopping-e-business-digital-technology-concept-78546456.jpg',
      title:'no'+i
    });}

    for(let i=0;i<20;i++){
      this.cateLeft.push(`catagory${i}`);
    }

  }

  ngOnInit() {
  }

}
