import wpcomFactory from 'wpcom'
import debugFactory from 'debug'

const debug = debugFactory( 'wpreview' )

export function connectWithToken( authToken ) {
	debug( 'building wpcom connection' )
	return wpcomFactory( authToken )
}

export function getPreviewForPost( wpcom, site, postId ) {
	return new Promise( ( resolve, reject ) => {
		if ( ! wpcom.req || ! site || ! postId ) return reject( new Error( 'Cannot fetch markup. Insufficient data available.' ) )
		getPathForPost( wpcom, site, postId )
		.then( slug => {
			return getPreviewForSlug( wpcom, site, slug )
		} )
		.then( response => {
			resolve( response )
		} )
		.catch( reject )
	} )
}

function getPathForPost( wpcom, site, postId ) {
	return new Promise( ( resolve, reject ) => {
		if ( ! wpcom.site || ! site || ! postId ) return reject( new Error( 'Cannot fetch slug. Insufficient data available.' ) )
		debug( 'fetching slug', site, postId )
		wpcom.site( site ).post( postId ).get()
		.then( response => {
			debug( 'got post data response', response )
			if ( ! response.slug ) return reject( new Error( 'Failed to fetch post slug' ) )
			resolve( response.slug )
		} )
		.catch( reject )
	} )
}

export function getPreviewForSlug( wpcom, site, slug ) {
	return new Promise( ( resolve, reject ) => {
		if ( ! wpcom.req || ! site || ! slug ) return reject( new Error( 'Cannot fetch preview. Insufficient data available.' ) )
		const endpoint = `/sites/${site}/previews/mine?path=${slug}/`
		debug( 'fetching preview', endpoint )
		wpcom.req.get( endpoint )
		.then( response => {
			debug( 'got preview markup response', response )
			if ( ! response.html ) return reject( new Error( 'No markup received from API' ) )
			resolve( response.html )
		} )
		.catch( reject )
	} )
}
