var Bureau = module.parent.exports.Bureau
var app = module.parent.exports.app
var _ = require( 'lodash' )

var logApiRequest = function( req, res, next ) {
	console.log( 'host:', req.get( 'host' ) )
	console.log( 'origin:', req.get( 'Origin' ) )
	console.log( req.body )
	next()
}

var sendError = function( err, req, res ) {
	res.json( 400, {
		error: err
	} )
}

var checkAppToken = function( req, res, next ) {
	if ( req.body.APP_TOKEN === process.env.BUREAU_APP_TOKEN ) {
		next()
	} else {
		sendError( 'Invalid APP_TOKEN', req, res )
	}

}

var checkUserToken = function( req, res, next ) {
	var uid = req.body.USER_ID,
		suppliedToken = req.body.USER_TOKEN

	Bureau.assassin.getToken( uid, function( err, actualToken ) {
		console.log( err, uid, actualToken, suppliedToken )
		if ( !err && suppliedToken === actualToken ) {
			next()
		} else {
			sendError( 'Invalid USER_TOKEN and USER_ID pair', req, res )
		}
	} )
}

var sendHeaders = function( req, res, next ) {
	res.header( 'Access-Control-Allow-Origin', '*' )
	res.header( 'Access-Control-Allow-Credentials', 'true' )
	res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' )
	if ( next ) next()
}

var sendHeadersForOptions = function( req, res, next ) {
	if ( req.method === 'OPTIONS' ) {
		res.header( 'Access-Control-Allow-Origin', '*' )
		res.header( 'Access-Control-Allow-Methods', 'POST' )
		res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Custom-Header' )
		res.send( 200 )
	} else {
		next()
	}
}

var authPipeline = [ logApiRequest, sendHeadersForOptions, checkAppToken, checkUserToken ]

authPipeline.map( app.use.bind( app, '/api' ) )

var handleApiRequest = function( handler, req, res ) {

	var data = _.omit( req.body, 'USER_TOKEN' )
	var params = req.params

	handler( data, params, sendResponse.bind( this, req, res ) )

}

var sendResponse = function( req, res, err, data ) {
	if ( err ) {
		sendError( err, req, res )
	} else {
		sendHeaders( req, res )
		res.json( data )
	}
}

var mapApiRoutes = function( routeHandler, route ) {
	route = route ? route : ''

	if ( _.isFunction( routeHandler ) ) {

		app.post( '/api/' + route, handleApiRequest.bind( this, routeHandler ) )

	} else if ( _.isPlainObject( routeHandler ) ) {

		_.each( routeHandler, function( subRouteHandler, subRoute ) {

			var glue = subRoute === '/' ? '' : '/';

			mapApiRoutes( subRouteHandler, route + glue + subRoute );

		} );
	}
}

var createApiEndpoint = function( endpoint ) {
	mapApiRoutes( require( './endpoints/' + endpoint )( Bureau ), endpoint )
}

var endpoints = require( './endpoints.js' )

endpoints.map( createApiEndpoint )
console.log( app.routes )

module.exports = true
