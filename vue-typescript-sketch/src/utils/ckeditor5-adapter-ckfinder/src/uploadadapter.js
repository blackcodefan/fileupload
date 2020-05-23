/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* globals XMLHttpRequest, FormData */

/**
 * @module adapter-ckfinder/uploadadapter
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';

/**
 * A plugin that enables file uploads in CKEditor 5 using the CKFinder server–side connector.
 *
 * See the {@glink features/image-upload/ckfinder "CKFinder file manager integration" guide} to learn how to configure
 * and use this feature as well as find out more about the full integration with the file manager
 * provided by the {@link module:ckfinder/ckfinder~CKFinder} plugin.
 *
 * Check out the {@glink features/image-upload/image-upload comprehensive "Image upload overview"} to learn about
 * other ways to upload images into CKEditor 5.
 *
 * @extends module:core/plugin~Plugin
 */
export default class CKFinderUploadAdapter extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ FileRepository ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'CKFinderUploadAdapter';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		//const url = this.editor.config.get( 'ckfinder.uploadUrl' );
		const noteComp = this.editor.config._config.ckfinder.noteComp;

		if (!noteComp) {
			console.error("Could not create UploadAdapter. Missing args:", noteComp);
			return;
		}

		// Register CKFinderAdapter
		this.editor.plugins.get(FileRepository).createUploadAdapter = loader => new UploadAdapter(loader, this.editor.t, noteComp);
	}
}

/**
 * Upload adapter for CKFinder.
 *
 * @private
 * @implements module:upload/filerepository~UploadAdapter
 */
class UploadAdapter {
	/**
	 * Creates a new adapter instance.
	 *
	 * @param {module:upload/filerepository~FileLoader} loader
	 * @param {String} url
	 * @param {module:utils/locale~Locale#t} t
	 */
	constructor(loader, t, noteComp) {
		/**
		 * FileLoader instance to use during the upload.
		 *
		 * @member {module:upload/filerepository~FileLoader} #loader
		 */
		this.loader = loader;

		/**
		 * Locale translation method.
		 *
		 * @member {module:utils/locale~Locale#t} #t
		 */
		this.t = t;
		/**
		 * Header Token
		 *
		 */
		this.noteComp = noteComp;
	}

	/**
	 * Starts the upload process.
	 *
	 * @see module:upload/filerepository~UploadAdapter#upload
	 * @returns {Promise.<Object>}
	 */
	upload() {
		return this.loader.file.then( file => {
			return new Promise( ( resolve, reject ) => {
				this.noteComp.$refs.fileList.createDBHeaders(file.name).then((headerMap) => {
					this._initRequest(file, headerMap);
					this._initListeners(resolve, reject, file);
					this._sendRequest(file);
				});
			} );
		} );
	}

	/**
	 * Aborts the upload process.
	 *
	 * @see module:upload/filerepository~UploadAdapter#abort
	 */
	abort() {
		if ( this.xhr ) {
			this.xhr.abort();
		}
	}

	/**
	 * Initializes the XMLHttpRequest object.
	 *
	 * @private
	 */
	_initRequest(file, headerMap) {
		const xhr = this.xhr = new XMLHttpRequest();

		xhr.open('POST', this.noteComp.$refs.fileList.DBUploadPath, true);
		xhr.responseType = 'json';
		// xhr.processData = false;

		for (const [k, v] of headerMap) {
			xhr.setRequestHeader(k, v);
		}
	}



	/**
	 * Initializes XMLHttpRequest listeners.
	 *
	 * @private
	 * @param {Function} resolve Callback function to be called when the request is successful.
	 * @param {Function} reject Callback function to be called when the request cannot be completed.
	 * @param {File} file File instance to be uploaded.
	 */
	_initListeners( resolve, reject, file ) {
		const xhr = this.xhr;
		const loader = this.loader;
		const t = this.t;
		const genericError = t( 'Cannot upload file:' ) + ` ${ file.name }.`;

		xhr.addEventListener( 'error', () => { reject( genericError ); });
		xhr.addEventListener( 'abort', () => reject() );
		xhr.addEventListener( 'load', () => {
			const response = xhr.response;
			if ( !response || !response.id ) {
				return reject( genericError );
			}

			// get the size of image
			var url = URL.createObjectURL(file);
			var img = new Image;
			let that = this;

			img.onload = function () {
				//alert(img.width);
				let result = {
					//default: this.getImgUrl(response),
					default: that.getImgUrl(response, 'w2048h1536'),
					'32': that.getImgUrl(response, 'w32h32'),
					'64': that.getImgUrl(response, 'w64h64'),
					'128': that.getImgUrl(response, 'w128h128'),
					'256': that.getImgUrl(response, 'w256h256'),
					'480': that.getImgUrl(response, 'w480h320'),
					'640': that.getImgUrl(response, 'w640h480'),
					'960': that.getImgUrl(response, 'w960h640'),
					'1024': that.getImgUrl(response, 'w1024h768'),
					'2048': that.getImgUrl(response, 'w2048h1536')
				};
				for (let key in result) {
					if (parseInt(key) > img.width) {
						delete result[key];
					}
				}
				//console.log("img srcset: ", result)
				result[img.width] = that.getImgUrl(response, 'w2048h1536');
				resolve(result);
			};
			img.src = url;

			// sync file list after upload
			this.noteComp.sync();
		} );

		// Upload progress when it's supported.
		/* istanbul ignore else */
		if ( xhr.upload ) {
			xhr.upload.addEventListener( 'progress', evt => {
				if ( evt.lengthComputable ) {
					loader.uploadTotal = evt.total;
					loader.uploaded = evt.loaded;
				}
			} );
		}
	}

	getImgUrl(response, size) {
		return this.noteComp.$refs.fileList.getPreviewPath(response.name, size);
	}

	/**
	 * Prepares the data and sends the request.
	 *
	 * @private
	 * @param {File} file File instance to be uploaded.
	 */
	_sendRequest( file ) {
		var f = file.slice();
		this.xhr.send(f);
	}
}
