const service = require("./movies.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

async function list(req, res, next) {
    const {is_showing} = req.query
    if (is_showing === "true") {
        res.json({data: await service.listShowing()})
    } else {
        res.json({data: await service.list()})
    }
}

async function movieExists(req, res, next) {
    const {movieId} = req.params
    const movie = await service.read(movieId)
    if (movie) {
        res.locals.movie = movie
        next()
    } else {
        next({ status: 404, message: `Movie cannot be found.` })
    }
}

function read(req, res, next) {
    res.json({ data: res.locals.movie })
}

async function listTheaters(req, res, next) {
    res.json({data: await service.getTheaters(res.locals.movie.movie_id)})
}

async function listReviews(req, res, next) {
    const data = await service.getReviews(res.locals.movie.movie_id)
    const formattedData = data.map(movie=> ({
        review_id: movie.review_id,
        content: movie.content,
        score: movie.score,
        created_at: movie.created_at,
        updated_at: movie.updated_at,
        critic_id: movie.critic_id,
        movie_id: movie.movie_id,
        critic: {
            critic_id: movie.critic_id,
            preferred_name: movie.preferred_name,
            surname: movie.surname,
            organization_name: movie.organization_name,
            created_at: movie.critic_created_at,
            updated_at: movie.critic_updated_at,
        }
    }))
    res.json({data: formattedData})
}

module.exports = {
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(movieExists), read],
    listTheaters: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listTheaters)],
    listReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listReviews)],
}