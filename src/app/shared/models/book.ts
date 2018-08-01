export class Book {

     authorName: string;
     publishedDate: string;
     title: string;
     id?: number;

    constructor( authorName: string, publishedDate: string, title: string, id?: number ) {
        this.authorName = authorName;
        this.publishedDate = publishedDate;
        this.title = title;
        this.id = id;
    }
}