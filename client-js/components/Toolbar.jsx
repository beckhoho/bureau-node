class Toolbar extends React.Component {

	constructor() {
		super()

		bureau.toolbar = this

		this.state = {
			unreadCount: 0,
			open: false,
			panel: 'notifications'
		}

		var m = document.createElement( 'meta' );
		m.setAttribute( 'name', 'msapplication-tap-highlight' );
		m.setAttribute( 'content', 'no' );

		var m2 = document.createElement( 'meta' );
		m2.setAttribute( 'http-equiv', 'X-UA-Compatible' );
		m2.setAttribute( 'content', 'IE=edge' );

		document.head.appendChild( m );
		document.head.appendChild( m2 );
	}

	setUnreadCount( unread ) {

		this.setState( {
			unreadCount: unread
		} )

	}

	static grabber() {

		return (
			<svg version="1.1" id="Layer_1" x="0px" y="0px" width="30px" height="23px" viewBox="0 0 30 23">
				<rect fill="{CHOSEN_COLOUR}" width="30" height="3"/>
				<rect y="10" fill="{CHOSEN_COLOUR}" width="30" height="3"/>
				<rect y="20" fill="{CHOSEN_COLOUR}" width="30" height="3"/>
			</svg>
		)
	}

	toggleOpen(e) {

		this.setState({
			open: !this.state.open
		})

	}

	render() {

		let assassin = BUREAU_ASSASSIN

		var personal = null;

		if ( assassin.imgname && assassin.imgname.length > 0 ) {
			personal = <li id="personal-toolbar-pic"><a href="/personal" style={{backgroundImage: `url(${assassin.imgname})`}} title="Me"></a></li>
		} else {
			personal = <li><a href="/personal" title="Me">&#xe001;</a></li>
		}

		return (
			<div id="toolbar" className={ this.state.open ? 'open' : '' }>
				<div id="toolbar-panel">
					<NotificationsPanel/>
				</div>
				<ul id="toolbar-buttons">
					<li id="grabber" onClick={this.toggleOpen.bind(this)}>{Toolbar.grabber()}</li>
					<li><a href="/home" title="Home">&#xe006;</a></li>
					<li><a id="notifications-btn" href="#" onClick={this.toggleOpen.bind(this)}>&#xe004;<span id="unread-count">{this.state.unreadCount > 0 ? this.state.unreadCount : null}</span></a></li>
					{personal}
					{assassin.guild ? <li><a href="/guild" title="Guild">&#xe005;</a></li> : null}
					{assassin.admin ? <li><a href="/admin" title="Admin">&#10083;</a></li> : null}
					<li><a href="/goodbye" title="Goodbye">&#xe002;</a></li>
				</ul>
			</div>

		)
	}
}