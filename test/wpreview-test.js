const chai = require( 'chai' )
const wpreview = require( '../lib' )

const expect = chai.expect

const site = '1001001001'
const postId = '4'
const slug = 'simple-page'

const previewMarkup = `
<!DOCTYPE html>
<html>
<head>
	<title>Hi there</title>
</head>
<body>
	This is a page
	a simple page
</body>
</html>
`

// Mock wpcom
const mockwpcom = {
	site( id ) {
		mockwpcom.currentSite = id
		return mockwpcom
	},
	post( id ) {
		mockwpcom.currentPost = id
		return mockwpcom
	},
	get() {
		if ( mockwpcom.currentSite === site && mockwpcom.currentPost === postId ) return Promise.resolve( { slug } )
		return Promise.resolve( {} )
	},
	req: {
		get( options ) {
			const endpoint = `/sites/${site}/previews/mine?path=${slug}/`
			if ( options === endpoint ) return Promise.resolve( { html: previewMarkup } )
			return Promise.resolve( {} )
		}
	},
}

describe( 'getPreviewForPost()', function() {
	it( 'returns a promise that resolves into the post preview', function() {
		return wpreview.getPreviewForPost( mockwpcom, site, postId )
		.then( markup => {
			expect( markup ).to.eql( previewMarkup )
		} )
	} )
} )

describe( 'getPreviewForSlug()', function() {
	it( 'returns a promise that resolves into the post preview', function() {
		return wpreview.getPreviewForSlug( mockwpcom, site, slug )
		.then( markup => {
			expect( markup ).to.eql( previewMarkup )
		} )
	} )
} )
