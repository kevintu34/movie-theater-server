const knex = require("../db/connection")

function list() {
    return knex("movies").select("*")
}

function listShowing() {
    return knex("movies as m")
        .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
        .select("m.*")
        .where("mt.is_showing", true)
        .distinct("m.movie_id")
}

function read(movieId) {
    return knex("movies")
        .select("*")
        .where("movie_id", movieId)
        .first()
}

function getTheaters(movieId) {
    return knex("movies as m")
        .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
        .join("theaters as t", "mt.theater_id", "t.theater_id")
        .select("t.*")
        .where("m.movie_id", movieId)
        .andWhere("mt.is_showing", true)
}

function getReviews(movieId) {
    return knex("movies as m")
        .join("reviews as r", "m.movie_id", "r.movie_id")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .select("r.*", "c.critic_id", "c.preferred_name", "c.surname", "c.organization_name", "c.created_at as critic_created_at", "c.updated_at as critic_updated_at",)
        .where("m.movie_id", movieId)
}

module.exports = {
    list,
    listShowing,
    read,
    getTheaters,
    getReviews,
}