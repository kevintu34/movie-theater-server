const knex = require("../db/connection")

function list() {
    return knex("theaters as t")
        .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
        .join("movies as m", "mt.movie_id", "m.movie_id")
        .select("t.*", "m.movie_id", "m.title", "m.runtime_in_minutes", "m.rating", "m.description", "m.image_url", "m.created_at as m_created_at", "m.updated_at as m_updated_at", "mt.is_showing", "mt.theater_id as mt_theater_id")
        .distinct("t.theater_id")
}

module.exports = {
    list,
}