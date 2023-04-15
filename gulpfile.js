const gulp = require('gulp');
const ts = require('gulp-typescript');
const mergeStream = require('merge-stream');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');

const cleanPackageJson = require('./scripts/gulp/cleanPackageJson');

const buildDir = 'dist';

// Helpers
function tsCompilerFactory(outPath, settings) {
	return function compileTS() {
		const tsProject = ts.createProject('tsconfig.json', settings);

		return gulp
			.src(['src/**/!(*.test).{ts,tsx}'])
			.pipe(sourcemaps.init())
			.pipe(tsProject())
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(outPath));
	};
}

function copyNotTranspilableSourcesFactory(outPath) {
	return function copyNotTranspilableSources() {
		return gulp.src([`src/**/!(*.test).{js,d.ts}`]).pipe(gulp.dest(outPath));
	};
}

// Main
function buildESM() {
	const out = `${buildDir}/esm`;

	return gulp.parallel([
		// Compile TS files
		Object.assign(tsCompilerFactory(out, { module: 'esnext' }), {
			displayName: 'TSC:esnext',
		}),

		// Copy js files and declarations
		Object.assign(copyNotTranspilableSourcesFactory(out), {
			displayName: 'CopyPureSources:esnext',
		}),
	]);
}

function makeCJSFromESM() {
	const esm = `${buildDir}/esm`;
	const out = buildDir;

	return mergeStream(
		// Copy type declarations
		gulp.src([`${esm}/**/*.ts`]),
		// Convert to CJS
		gulp
			.src([`${esm}/**/*.js`])
			.pipe(sourcemaps.init())
			.pipe(
				babel({
					plugins: ['@babel/plugin-transform-modules-commonjs'],
				}),
			)
			.pipe(sourcemaps.write()),
	).pipe(gulp.dest(out));
}

function copyMetaFiles() {
	return mergeStream(
		// Clean package.json
		gulp.src(['./package.json']).pipe(cleanPackageJson()),
		// Copy other
		gulp.src(['./README.md']),
	).pipe(gulp.dest(buildDir));
}

// Compilations
const fullBuild = gulp.series([copyMetaFiles, buildESM(), makeCJSFromESM]);

module.exports.default = fullBuild;
