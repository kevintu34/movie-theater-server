const knex = require("../db/connection")

function readReview(reviewId) {
    return knex("reviews")
        .select("*")
        .where("review_id", reviewId)
        .first()
}

function destroyReview(reviewId) {
    return knex("reviews")
        .where("review_id", reviewId)
        .del()
}

function updateReview(updatedReview) {
    return knex("reviews")
        .where("review_id", updatedReview.review_id)
        .update(updatedReview)
}

function readReviewCritic(updatedReview) {
    return knex("reviews as r")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .select("r.*", "c.critic_id", "c.preferred_name", "c.surname", "c.organization_name", "c.created_at as critic_created_at", "c.updated_at as critic_updated_at")
        .where("r.review_id", updatedReview.review_id)
}

module.exports = {
    readReview,
    destroyReview,
    updateReview,
    readReviewCritic,
}