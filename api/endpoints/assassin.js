var _ = require( 'lodash' )

module.exports = function( Bureau ) {

	var assassinProjection = [
		'_id',
		'forename',
		'surname',
		'nickname',
		'course',
		'address',
		'liverin',
		'gamegroup',
		'college',
		'guild',
		'imgname'
	]

	var projectAssassin = function( assassin ) {
		return _.pick( assassin, assassinProjection )
	}

	return {
		'getAssassin/:uid': function( data, params, callback ) {

			var uid = params.uid

			Bureau.assassin.getGamegroup( data.USER_ID, function( err, ggid ) {

				Bureau.assassin.getAssassin( uid, function( err, assassin ) {

					if ( err ) {
						callback( err )
						return
					}

					if ( ggid !== assassin.gamegroup ) {
						callback( 'Assassin is in a different gamegroup to you' )
						return
					}

					callback( null, projectAssassin( assassin ) )
				} )
			} )
		},

		getAssassins: function( data, params, callback ) {

			var uid = params.uid

			Bureau.assassin.getGamegroup( data.USER_ID, function( err, ggid ) {

				var filter = _.omit( data, [ 'USER_ID', 'APP_TOKEN' ] )
				filter.gamegroup = ggid

				Bureau.assassin.getAssassins( filter, function( err, assassins ) {

					if ( err ) {
						callback( err )
						return
					}

					callback( null, assassins.map( projectAssassin ) )

				} )

			} )

		},

		getAssassinsFromAssassinIds: function( data, params, callback ) {

			var assassinIds = data.assassinIds

			if ( !_.isArray( assassinIds ) ) {
				callback( 'Assassin ids must be supplied as an array' )
				return
			}

			Bureau.assassin.getGamegroup( data.USER_ID, function( err, ggid ) {

				Bureau.assassin.getAssassinsFromIds( assassinIds, function( err, assassins ) {

					if ( err ) {
						callback( err )
						return
					}

					assassins = assassins.filter( function( assassin ) {
						return assassin.gamegroup === ggid
					} )

					callback( null, assassins.map( projectAssassin ) )

				} )
			} )
		}
	}

}
