export class CommentList {
    constructor(){
        this.isSet = false;
        this.comments = [];
        this.video = {
            'id' : '',
            'name' : '',
        }
        console.log('new CommentList constructed')
    }

    get comments() {
        return this._comments;
    }

    set comments(data) {
        this._comments = data;
    }

    resetData(){
        this.isSet = false;
        this.comments = [];
        this.video = {
            'id' : '',
            'name' : '',
        }
        console.log('all CommentList data reset to empty')
    }
}