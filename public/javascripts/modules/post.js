(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  forum.Post = (function() {

    __extends(Post, Backbone.Model);

    function Post() {
      Post.__super__.constructor.apply(this, arguments);
    }

    return Post;

  })();

  forum.PostList = (function() {

    __extends(PostList, Backbone.Collection);

    function PostList() {
      PostList.__super__.constructor.apply(this, arguments);
    }

    PostList.prototype.model = forum.Post;

    PostList.prototype.url = '/db/posts';

    return PostList;

  })();

  /*
  #	View for each post in a Roundtable
  #
  */

  forum.PostView = (function() {

    __extends(PostView, Backbone.View);

    function PostView() {
      this.render = __bind(this.render, this);
      PostView.__super__.constructor.apply(this, arguments);
    }

    PostView.prototype.tagName = 'li';

    PostView.prototype.className = 'post';

    PostView.prototype.initialize = function() {
      return this.model.bind('change', this.render);
    };

    PostView.prototype.render = function() {
      var renderedContent;
      renderedContent = JST['post'](this.model.toJSON());
      $(this.el).html(renderedContent);
      return this;
    };

    return PostView;

  })();

  /*
  #	View for list of posts in a Roundtable
  #
  */

  forum.PostListView = (function() {

    __extends(PostListView, Backbone.View);

    function PostListView() {
      this.showNext = __bind(this.showNext, this);
      this.showPrev = __bind(this.showPrev, this);
      this.render = __bind(this.render, this);
      PostListView.__super__.constructor.apply(this, arguments);
    }

    PostListView.prototype.className = 'post-list list';

    PostListView.prototype.events = {
      'click .prev': 'showPrev',
      'click .next': 'showNext'
    };

    PostListView.prototype.initialize = function() {
      this.collection.bind('reset', this.render);
      return this.collection.bind('add', this.render);
    };

    PostListView.prototype.render = function() {
      var $postList;
      var _this = this;
      $(this.el).html(JST['postList']({
        topic: this.model.get('topic')
      }));
      $postList = this.$('.post-list');
      this.collection.each(function(post) {
        var view;
        view = new forum.PostView({
          model: post,
          collection: _this.collection
        });
        return $postList.append(view.render().el);
      });
      return this;
    };

    PostListView.prototype.showPrev = function() {
      var newRoomID, roomIndex;
      forum.animateDirection = {
        from: 'left',
        to: 'right'
      };
      roomIndex = forum.roomList.indexOf(this.model) - 1;
      if (roomIndex < 0) {
        newRoomID = forum.roomList.last().get('id');
      } else {
        newRoomID = forum.roomList.models[roomIndex].get('id');
      }
      return forum.app.navigate("show/room/" + newRoomID, true);
    };

    PostListView.prototype.showNext = function() {
      var newRoomID, roomIndex;
      forum.animateDirection = {
        from: 'right',
        to: 'left'
      };
      roomIndex = forum.roomList.indexOf(this.model) + 1;
      if (roomIndex === forum.roomList.models.length) {
        newRoomID = forum.roomList.first().get('id');
      } else {
        newRoomID = forum.roomList.models[roomIndex].get('id');
      }
      return forum.app.navigate("show/room/" + newRoomID, true);
    };

    return PostListView;

  })();

  /*
  # View for posting new posts
  #
  */

  forum.PostFormView = (function() {

    __extends(PostFormView, Backbone.View);

    function PostFormView() {
      this.submit = __bind(this.submit, this);
      this.render = __bind(this.render, this);
      PostFormView.__super__.constructor.apply(this, arguments);
    }

    PostFormView.prototype.tagName = 'div';

    PostFormView.prototype.className = 'form-wrapper';

    PostFormView.prototype.events = {
      'click .post-form button': 'submit'
    };

    PostFormView.prototype.initialize = function() {
      this.collection.bind('reset', this.render);
      this.collection.bind('add', this.render);
      return forum.currentUser.bind('change', this.render);
    };

    PostFormView.prototype.render = function() {
      if (forum.currentUser.get('username') != null) {
        $(this.el).html(JST['postForm']());
      } else {
        $(this.el).html('');
      }
      this.delegateEvents();
      return this;
    };

    PostFormView.prototype.submit = function() {
      var content, post;
      var _this = this;
      if (forum.currentUser.get('username') == null) return;
      content = this.$('textarea').val().trim();
      if (content === "") {
        this.$('textarea').addClass('error');
        return;
      }
      return post = this.collection.create({
        post: {
          room_id: this.model.id,
          user_id: forum.currentUser.get('id'),
          content: content
        }
      }, {
        success: function() {
          var userArr, username;
          forum.postList.add(post);
          username = forum.currentUser.get('username');
          post.set({
            username: username
          });
          userArr = _this.model.get('participants');
          if (!_.include(userArr, username)) {
            userArr.push(username);
            return _this.model.set({
              participants: userArr
            });
          }
        }
      });
    };

    return PostFormView;

  })();

}).call(this);
