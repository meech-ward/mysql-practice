import { series, parallel, src, dest, watch } from 'gulp'
import log from 'fancy-log'
import path from 'path'
import nodemon from 'gulp-nodemon'
import babel from 'gulp-babel'
import sourcemaps from 'gulp-sourcemaps'
import del from 'del'

const srcDir = 'src', destDir = 'dist'

const _config = {presets: ['@babel/preset-env']}

const babelConfig =
{presets: ['@babel/preset-env'], "plugins": [
  "@babel/plugin-transform-runtime",
]}

const babelConfigDist =
{presets: [
  [
    '@babel/preset-env',
    {
      targets: {
        esmodules: true,
      },
    },
  ],
],}

/* 
Watch for changes to the destDir using nodemon
*/
export const nodeWatch = done => nodemon({
  script: 'bin/www',
  ignore: [srcDir],
  watch: [destDir],
  env: { 'NODE_ENV': 'development' },
  done: done
})

/*
Use babel to compile files
*/
const build = (srcPath, destPath, babelConfig) => 
  src([srcPath])
  .pipe(sourcemaps.init())
  .on('error', log.error)
  .pipe(babel(babelConfig))
  .on('error', log.error)
  .pipe(sourcemaps.mapSources(sourcePath =>  path.join(__dirname, srcDir, sourcePath)))
  .on('error', log.error)
  .pipe(sourcemaps.write())
  .on('error', log.error)
  .pipe(dest(destPath))
  .on('error', log.error)

const buildProd = (srcPath, destPath, babelConfig) => 
  src([srcPath])
  .pipe(babel(babelConfig))
  .on('error', log.error)
  .pipe(dest(destPath))
  .on('error', log.error)

/*
Use babel to compile everything from the srcDir into the destDir
*/
export const buildAll = async () =>  {
  build(path.join(srcDir,'**/*.js'), destDir, babelConfig)
  // return true
}


export const buildAllProd = async () =>  {
  buildProd(path.join(srcDir,'**/*.js'), destDir, babelConfigDist)
  // return true
}

// Convert a filepath from src into a filepath to dest
const destPath = srcPath => srcPath.replace(srcDir, destDir)

/*
Use gulp to watch the files in the srcDir and compile them using babel when they change
*/
export const buildWatch = async () => {
  const watcher = watch([path.join(srcDir, '**/*')]);

  const compile = filePath =>  {
  build(filePath, path.parse(destPath(filePath)).dir, babelConfig)
  .on('end', () => console.log("compiled", filePath))
  return null}
  
  
  const remove = filePath => 
  del([destPath(filePath)])
  .then(paths => console.log("removed", paths))

  watcher.on('change', compile)
  watcher.on('add', compile)
  watcher.on('unlink', remove)
  watcher.on('unlinkDir', remove)
}

const defaultTask = series(buildAll, parallel(buildWatch, nodeWatch))
export default defaultTask