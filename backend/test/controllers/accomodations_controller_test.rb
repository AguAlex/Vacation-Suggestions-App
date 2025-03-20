require "test_helper"

class AccomodationsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @accomodation = accomodations(:one)
  end

  test "should get index" do
    get accomodations_url, as: :json
    assert_response :success
  end

  test "should create accomodation" do
    assert_difference("Accomodation.count") do
      post accomodations_url, params: { accomodation: { category: @accomodation.category, city_id: @accomodation.city_id, distance_to_city: @accomodation.distance_to_city, name: @accomodation.name, price: @accomodation.price, rating: @accomodation.rating } }, as: :json
    end

    assert_response :created
  end

  test "should show accomodation" do
    get accomodation_url(@accomodation), as: :json
    assert_response :success
  end

  test "should update accomodation" do
    patch accomodation_url(@accomodation), params: { accomodation: { category: @accomodation.category, city_id: @accomodation.city_id, distance_to_city: @accomodation.distance_to_city, name: @accomodation.name, price: @accomodation.price, rating: @accomodation.rating } }, as: :json
    assert_response :success
  end

  test "should destroy accomodation" do
    assert_difference("Accomodation.count", -1) do
      delete accomodation_url(@accomodation), as: :json
    end

    assert_response :no_content
  end
end
