# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_05_07_124258) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "accomodations", force: :cascade do |t|
    t.string "category"
    t.string "name"
    t.float "distance_to_city"
    t.float "price"
    t.float "rating"
    t.bigint "city_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "link"
    t.string "imagine"
    t.index ["city_id"], name: "index_accomodations_on_city_id"
  end

  create_table "airports", force: :cascade do |t|
    t.string "name"
    t.string "detailed_name"
    t.string "iataCode"
    t.float "latitude"
    t.float "longitude"
    t.string "cityName"
    t.string "cityCode"
    t.string "countryName"
    t.string "countryCode"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "cities", force: :cascade do |t|
    t.string "name"
    t.bigint "country_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "iata_code"
    t.index ["country_id"], name: "index_cities_on_country_id"
  end

  create_table "countries", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "image"
  end

  create_table "likes", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "accomodation_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["accomodation_id"], name: "index_likes_on_accomodation_id"
    t.index ["user_id"], name: "index_likes_on_user_id"
  end

  create_table "playing_with_neon", id: :serial, force: :cascade do |t|
    t.text "name", null: false
    t.float "value", limit: 24
  end

  create_table "points_of_interests", force: :cascade do |t|
    t.string "name"
    t.float "rating"
    t.string "category"
    t.bigint "city_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "link"
    t.string "image"
    t.float "price"
    t.string "description"
    t.float "latitude"
    t.float "longitude"
    t.index ["city_id"], name: "index_points_of_interests_on_city_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "nume"
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "password_digest"
  end

  add_foreign_key "accomodations", "cities"
  add_foreign_key "cities", "countries"
  add_foreign_key "likes", "accomodations"
  add_foreign_key "likes", "users"
  add_foreign_key "points_of_interests", "cities"
end
