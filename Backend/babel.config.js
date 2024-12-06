module.exports = function (api) {
  api.cache(true)
  const presets = ['@babel/preset-env']
  const ignore = ['./node_modules', 'babel.config.js']

  return {
    presets,
    ignore
  }
}
