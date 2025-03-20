require "test_helper"

class PointsOfInterestsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @points_of_interest = points_of_interests(:one)
  end

  test "should get index" do
    get points_of_interests_url, as: :json
    assert_response :success
  end

  test "should create points_of_interest" do
    assert_difference("PointsOfInterest.count") do
      post points_of_interests_url, params: { points_of_interest: { category: @points_of_interest.category, city_id: @points_of_interest.city_id, name: @points_of_interest.name, rating: @points_of_interest.rating } }, as: :json
    end

    assert_response :created
  end

  test "should show points_of_interest" do
    get points_of_interest_url(@points_of_interest), as: :json
    assert_response :success
  end

  test "should update points_of_interest" do
    patch points_of_interest_url(@points_of_interest), params: { points_of_interest: { category: @points_of_interest.category, city_id: @points_of_interest.city_id, name: @points_of_interest.name, rating: @points_of_interest.rating } }, as: :json
    assert_response :success
  end

  test "should destroy points_of_interest" do
    assert_difference("PointsOfInterest.count", -1) do
      delete points_of_interest_url(@points_of_interest), as: :json
    end

    assert_response :no_content
  end
end
