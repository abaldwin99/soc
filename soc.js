Posts = new Mongo.Collection("posts");
Chats = new Mongo.Collection("chats");
UserHistory = new Mongo.Collection("userhistory");



if (Meteor.isClient) {

    Template.body.helpers({
        posts: function () {
            return Posts.find({});
        },
        chatsByPost: function (postID) {
            return Chats.find({
                postID: postID
            });
        }
    });

    Template.body.events({
        "submit .new-post": function (event) {

            var text = event.target.text.value;
            var link = event.target.link.value;

            Posts.insert({
                text: text,
                createdAt: new Date(),
                link: link,
                owner: Meteor.userId(),
                username: Meteor.user().username,
                voteUp: 0,
                voteUpUsers: [],
                voteDown: 0,
                voteDownUsers: []
            });

            event.target.text.value = "";
            event.target.link.value = "";

            // Prevent default form submit
            return false;
        },
        "submit .new-chat": function (event) {

            var postID = $(event.target).data('postid');
            var message = event.target.chat.value;

            Chats.insert({
                postID: postID,
                message: message,
                createdAt: new Date(),
                owner: Meteor.userId(),
                username: Meteor.user().username
            });

            event.target.chat.value = "";

            return false;
        },
        "click .vote-up": function (event) {
            var postID = $(event.target).data('postid');

            userHasVoted = Posts.findOne({
                _id: postID,
                voteUpUsers: {
                    $in: [Meteor.userId()]
                }
            });
            if (userHasVoted) {
                return;
            }


            Posts.update({
                _id: postID
            }, {
                $inc: {
                    voteUp: 1
                },
                $addToSet: {
                    voteUpUsers: Meteor.userId()
                }
            })
        },
        "click .vote-down": function (event) {
            var postID = $(event.target).data('postid');

            userHasVoted = Posts.findOne({
                _id: postID,
                voteDownUsers: {
                    $in: [Meteor.userId()]
                }
            });
            if (userHasVoted) {
                return;
            }

            Posts.update({
                _id: postID
            }, {
                $inc: {
                    voteDown: 1
                },
                $addToSet: {
                    voteDownUsers: Meteor.userId()
                }
            });
        }
    });

    Template.registerHelper('equals', function (a, b) {
        return a === b;
    });


    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}