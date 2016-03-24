export default function cacheControl(maxAge) {
  return function cacheControlThunk(req, res, next) {
    if (maxAge) {
      res.set('Cache-Control', `public, max-age=${maxAge}`)
    }
    else {
      res.set('Cache-Control', 'max-age=0, no-cache, no-store')
    }
    next()
  }
}
