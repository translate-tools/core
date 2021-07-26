const through = require('through2');
const PluginError = require('plugin-error');

const PLUGIN_NAME = 'gulp-clean-packagejson';

/**
 * Props which will not removed
 */
const defaultIgnoredProps = [
	'name',
	'version',
	'description',
	'keywords',
	'author',
	'license',
	'homepage',
	'repository',
	'dependencies',
	'peerDependencies',
	'publishConfig',
	'engines',
];

/**
 * Plugin for clean package.json file
 */
module.exports = function(options = {}) {
	if (typeof options !== 'object') {
		throw new PluginError(PLUGIN_NAME, 'Options must be is object');
	}

	const {
		/**
		 * New props. It will overwrite exists
		 */
		addonProps = {},

		/**
		 * This props will not remove
		 */
		ignorePropsNames = [],

		/**
		 * This props will remove anyway
		 */
		removePropsNames = [],

		/**
		 * Disable default list of ignored props
		 */
		noDefaults = false,

		/**
		 * Disable beautify
		 */
		beautify = true,
	} = options;

	return through.obj(function(file, encoding, callback) {
		// Skip
		if (file.isNull()) {
			return callback(null, file);
		}

		const ignoredProps = noDefaults
			? ignorePropsNames
			: [...ignorePropsNames, ...defaultIgnoredProps];

		const handleData = (sourceObject) => {
			const newObject = { ...sourceObject };

			// Remove unnecessary props
			Object.keys(newObject).forEach((name) => {
				const isIgnoredProperty = ignoredProps.indexOf(name) !== -1;
				const isPropertyToRemove = removePropsNames.indexOf(name) !== -1;

				if (!isIgnoredProperty || isPropertyToRemove) {
					delete newObject[name];
				}
			});

			return { ...newObject, ...addonProps };
		};

		if (file.isStream()) {
			// TODO: support streams
			// file.contents is a Stream - https://nodejs.org/api/stream.html
			this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));

			// or, if you can handle Streams:
			//file.contents = file.contents.pipe(...
			//return callback(null, file);
		} else if (file.isBuffer()) {
			const fileData = JSON.parse(file.contents.toString());
			const handledData = handleData(fileData);

			const stringifyData = JSON.stringify(
				handledData,
				null,
				beautify ? '\t' : null,
			);
			file.contents = Buffer.from(stringifyData);

			return callback(null, file);
		}
	});
};
