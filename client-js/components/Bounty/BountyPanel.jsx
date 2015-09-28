class BountyPanel extends React.Component {

	constructor() {
		super()
		this.state = {
			createBountyOpen: false
		}
	}

	toggleCreateBounty() {
		this.setState({
			createBountyOpen: !this.state.createBountyOpen
		})
	}

	render() {

		var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup

		return (
			<div className="toolbar-panel-wrapper">
				<div className="toolbar-header" style={{color:CHOSEN_COLOUR}}>
					Bounties
					{ BUREAU_ASSASSIN.guild ? <div className="toolbar-header-button" onClick={this.toggleCreateBounty.bind(this)}>+</div> : null }
				</div>
				<div className="toolbar-content">
					{ this.state.createBountyOpen ? <ReactCSSTransitionGroup transitionName="toolbar-content-slideup" className="toolbar-content-overlay" component='div' transitionAppear={true}><BountyCreate/></ReactCSSTransitionGroup> : null }
					<BountyList/>
				</div>
			</div>
		)
	}

}
