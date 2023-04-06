const service = require("./reviews.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

async function reviewExists(req, res, next) {
    const { reviewId } = req.params
    const review = await service.readReview(reviewId)

    if(review) {
        res.locals.review = review
        next()
    } else {
        next({ status: 404, message: `Review cannot be found.`})
    }
}

async function destroy(req, res, next) {
    await service.destroyReview(res.locals.review.review_id)
    res.sendStatus(204)
}

function validateBodyExists(req, res, next) {
    const data = req.body.data
    if(data) {
        next()
    } else {
        next({ status: 400, message: `Request must include data`})
    }
}

function validateBodyTextExistsFunction(field) {
    const validateTextExists = (req, res, next) => {
        if(req.body.data[field]) {
            res.locals[field] = req.body.data[field]
            next()
        } else {
            next({ status: 400, message: `${field} must include text`})
        }
    }
    return validateTextExists
}

async function update(req, res, next) {
    const updatedReview = {
        ...res.locals.review,
        score: res.locals.score,
        content: res.locals.content
    }
    await service.updateReview(updatedReview)
    const data = await service.readReviewCritic(updatedReview)
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
    res.json({data: formattedData[0]})
}

module.exports = {
    destroy: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
    update: [
        asyncErrorBoundary(reviewExists), 
        validateBodyExists,
        ...["content"].map(field=>validateBodyTextExistsFunction(field)),
        update,
    ],

}