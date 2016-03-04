# wpreview

A library to get site previews from the WordPress.com REST API.

Requires wpcom.js

## Usage

```javascript
const authToken = '12345';
import { getPreviewForPost, connectWithToken } from 'wpreview';
getPreviewForPost( connectWithToken( authToken ), siteId, postId )
.then( preview => doSomethingWithPreviewMarkup( preview ) );
```
