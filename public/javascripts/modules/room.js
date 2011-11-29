(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  forum.Room = (function() {

    __extends(Room, Backbone.Model);

    function Room() {
      Room.__super__.constructor.apply(this, arguments);
    }

    return Room;

  })();

  forum.RoomList = (function() {

    __extends(RoomList, Backbone.Collection);

    function RoomList() {
      RoomList.__super__.constructor.apply(this, arguments);
    }

    RoomList.prototype.model = forum.Room;

    RoomList.prototype.url = '/db/rooms';

    return RoomList;

  })();

  /*
  #	View for each room entry in the room list
  #
  */

  forum.RoomListRoomView = (function() {

    __extends(RoomListRoomView, Backbone.View);

    function RoomListRoomView() {
      this.showRoom = __bind(this.showRoom, this);
      this.render = __bind(this.render, this);
      RoomListRoomView.__super__.constructor.apply(this, arguments);
    }

    RoomListRoomView.prototype.tagName = 'li';

    RoomListRoomView.prototype.className = 'post span10';

    RoomListRoomView.prototype.events = {
      'click .go': 'showRoom'
    };

    RoomListRoomView.prototype.initialize = function() {
      return this.model.bind('change', this.render);
    };

    RoomListRoomView.prototype.render = function() {
      var modelObj, renderedContent;
      modelObj = this.model.toJSON();
      modelObj.subheading = this.toSentence(modelObj.participants);
      modelObj.dateStr = this.toDateString(modelObj.created_at);
      renderedContent = JST['roomListRoom'](modelObj);
      $(this.el).html(renderedContent);
      return this;
    };

    RoomListRoomView.prototype.showRoom = function() {
      return forum.app.navigate("show/room/" + (this.model.get('id')), true);
    };

    RoomListRoomView.prototype.toSentence = function(arr) {
      var lastEntry;
      console.log(arr.length);
      if (arr.length === 1) return "with " + arr[0];
      console.log("one");
      if (arr.length === 2) return "between " + (arr.join(" and "));
      console.log("two");
      lastEntry = arr.splice(arr.length - 1);
      return "between " + (arr.join(', ')) + ", and " + lastEntry;
    };

    RoomListRoomView.prototype.toDateString = function(dateStr) {
      var date, str;
      date = new Date(dateStr);
      str = "" + (date.getHours()) + ":" + (date.getMinutes()) + " ";
      str += "" + (date.getDate()) + "/" + (date.getMonth()) + "/";
      str += "" + (date.getFullYear().toString().substr(2, 2));
      return str;
    };

    return RoomListRoomView;

  })();

  /*
  #	View for room list on main page
  #
  */

  forum.RoomListView = (function() {

    __extends(RoomListView, Backbone.View);

    function RoomListView() {
      this.render = __bind(this.render, this);
      RoomListView.__super__.constructor.apply(this, arguments);
    }

    RoomListView.prototype.tagName = 'section';

    RoomListView.prototype.className = 'rooms span10';

    RoomListView.prototype.initialize = function() {
      this.collection.bind('reset', this.render);
      return this.collection.bind('add', this.render);
    };

    RoomListView.prototype.render = function() {
      var $postList;
      var _this = this;
      $(this.el).html(JST['roomList']());
      $postList = this.$('.room-list');
      this.collection.each(function(room) {
        var view;
        view = new forum.RoomListRoomView({
          model: room,
          collection: _this.collection
        });
        return $postList.append(view.render().el);
      });
      return this;
    };

    return RoomListView;

  })();

  /*
  #	View for creating a Roundtable page
  #
  */

  forum.NewRoomView = (function() {

    __extends(NewRoomView, Backbone.View);

    function NewRoomView() {
      this.submit = __bind(this.submit, this);
      this.render = __bind(this.render, this);
      NewRoomView.__super__.constructor.apply(this, arguments);
    }

    NewRoomView.prototype.tagName = 'div';

    NewRoomView.prototype.className = 'new-room-form';

    NewRoomView.prototype.events = {
      'click .submit': 'submit'
    };

    NewRoomView.prototype.initialize = function() {};

    NewRoomView.prototype.render = function() {
      $(this.el).html(JST['newRoom']());
      return this;
    };

    NewRoomView.prototype.submit = function() {
      var postText, room, topicText;
      var _this = this;
      topicText = this.$('.topic-text').val().trim();
      postText = this.$('.post-text').val().trim();
      $('.error').removeClass('error');
      if (topicText === "") this.$('.topic-text').addClass('error');
      if (postText === "") this.$('.post-text').addClass('error');
      if (topicText === "" || postText === "") return;
      return room = this.collection.create({
        room: {
          user_id: forum.currentUser.get('id'),
          topic: topicText
        }
      }, {
        success: function() {
          var post;
          room.set({
            username: forum.currentUser.get('username')
          });
          room.collection = new forum.PostList();
          return post = room.collection.create({
            post: {
              room_id: room.get('id'),
              user_id: forum.currentUser.get('id'),
              content: postText
            }
          }, {
            success: function() {
              forum.postList.add(post);
              post.set({
                username: forum.currentUser.get('username')
              });
              return forum.app.navigate("show/room/" + (room.get('id')), true);
            }
          });
        }
      });
    };

    return NewRoomView;

  })();

}).call(this);
