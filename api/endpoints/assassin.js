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
		'guild'
	]

	var projectAssassin = function( assassin ) {
		return _.pick( assassin, assassinProjection )
	}

	return {
		'getAssassin/:uid': function( data, params, callback ) {
			var uid = params.uid

			Bureau.assassin.getAssassin( uid, function( err, assassin ) {

				if ( err ) {
					callback( err )
					return
				}

				callback( null, projectAssassin( assassin ) )
			} )
		}
	}

}
