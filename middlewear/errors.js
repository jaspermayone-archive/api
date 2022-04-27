import path from 'path';

const errorLogger = (err, req, res, next) => {
    console.error('\x1b[31m', err) // adding some color to our logs
    next(err) // calling next middleware
}

const errorResponder = (err, req, res, next) => {
    res.header("Content-Type", 'application/json')
    res.status(err.statusCode).send(JSON.stringify(err, null, 4)) // pretty print
}
const invalidPathHandler = (req, res, next) => {
    // send the 404.html file
    res.redirect(`${req.baseUrl}/404.html`)
}

export { errorLogger, errorResponder, invalidPathHandler }