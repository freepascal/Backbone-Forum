class forum.UserView extends Backbone.View
	tagName: 'div'
	className: 'user-panel'

	events:
		'click #signup-button': 'signup'
		'click #login-button': 'login'
		'click #logout-button': 'logout'

	initialize: ->
		@model.bind 'change', @render

	render: =>
		if typeof(@model.get 'username') == "undefined"
			renderedContent = JST['login'] @model.toJSON()
		else
			renderedContent =  JST['user'] @model.toJSON()

		$(@el).html renderedContent
		return this

	signup: ->
		newUser = new forum.User
			username: this.$('.un').val()
			password: this.$('.pw').val()

		newUser.save {},
			success: (mode, data) =>
				if data.exists == true #if username already exists
					@render()
					this.$('.alert-text').html 'That username is taken'
				else
					@model.set data
			error: (object, error) =>
				this.$('.alert-text').html 'There was some sort of error. Try again.'

	login: ->
		data =
			username: this.$('.un').val()
			password: this.$('.pw').val()

		$.post '/sessions', data, (response) =>
			if response.exists == true
				@model.set response.user
			else if response.exists == false
				@render()
				this.$('.alert-text').html 'Username or password is incorrect'
			else
				this.$('.alert-text').html 'There was some sort of error. Try again.'

	logout: ->
		$.post '/sessions', { '_method': 'delete' }, (response) =>
			@model.clear()

