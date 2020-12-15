export class CommentList {
    constructor() {
        this.isSet = false;
        this.comments = [];
        this.video = {
            'id': '',
            'name': '',
            'creatorId': ''
        }
        console.log('new CommentList constructed');
    }

    get comments() {
        return this._comments;
    }

    set comments(data) {
        this._comments = data;
    }

    getFilteredComments(onlyUnique = false, excludeAuthor = false) {

        let modifiedComments = this.comments;

        if (onlyUnique) {
            console.log('Ready to export only unique comments');
            let uniqueComments = [];
            for (let comment of this.comments) {
                console.log(comment.id);
                let isUnique = true;
                for (let uniqueComment of uniqueComments) {
                    if (comment.id === uniqueComment.id) {
                        isUnique = false;
                        break;
                    }
                }
                if (isUnique) {
                    uniqueComments.push(comment);
                }
            }
            console.log('All comments: ' + this.comments.length);
            console.log('Unique comments: ' + uniqueComments.length);

            modifiedComments = uniqueComments;
        }

        if (excludeAuthor) {
            console.log('Ready to export comments without comments by video author');
            modifiedComments = modifiedComments.filter(comment => comment.id !== this.video.creatorId);
            console.log('Comments author excluded: ' + modifiedComments.length);
        }
        return modifiedComments;
    }

    resetData() {
        this.isSet = false;
        this.comments = [];
        this.video = {
            'id': '',
            'name': '',
        }
        console.log('all CommentList data reset to empty')
    }
}