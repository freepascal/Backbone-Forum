(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  forum.ForumRouter = (function() {

    __extends(ForumRouter, Backbone.Router);

    function ForumRouter() {
      ForumRouter.__super__.constructor.apply(this, arguments);
    }

    ForumRouter.prototype.routes = {
      '': 'home',
      'postlist': 'posts'
    };

    ForumRouter.prototype.initialize = function() {
      forum.currentUser = new forum.User();
      forum.postList = new forum.PostList();
      return forum.postListView = new forum.PostListView({
        collection: forum.postList
      });
    };

    ForumRouter.prototype.posts = function() {
      var $container;
      $container = $('#container');
      return $container.empty().append(forum.postListView.render().el);
    };

    return ForumRouter;

  })();

}).call(this);