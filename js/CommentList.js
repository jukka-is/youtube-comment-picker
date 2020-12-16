export class CommentList {
    constructor() {
        this.isSet = false;
        this.comments = [];
        this.video = {
            'id': '',
            'title': '',
            'channelName': '',
            'channelId': ''
        }
        console.log('new CommentList constructed');
    }

    get comments() {
        return this._comments;
    }

    set comments(data) {
        this._comments = data;
    }

    filterComments(onlyUnique = false, excludeCreator = false) {

        let modifiedComments = this.comments;

        if (onlyUnique) {
            console.log('Ready to export only unique comments');
            let uniqueComments = [];
            for (let comment of this.comments) {
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

        if (excludeCreator) {
            console.log('Ready to export comments without comments by video creator');
            modifiedComments = modifiedComments.filter(comment => comment.id !== this.video.channelId);
            console.log('Comments creator excluded: ' + modifiedComments.length);
        }

        this.comments = modifiedComments;
    }

    resetData() {
        this.isSet = false;
        this.comments = [];
        this.video = {
            'id': '',
            'title': '',
            'channelName': '',
            'channelId': ''
        }
        console.log('all CommentList data reset to empty')
    }
}