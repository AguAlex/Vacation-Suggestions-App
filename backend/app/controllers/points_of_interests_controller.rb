class PointsOfInterestsController < ApplicationController
  before_action :set_points_of_interest, only: %i[show update destroy]

  # GET /points_of_interests
  # GET /points_of_interests.json
  def index
    @points_of_interests = PointsOfInterest.all
    render json: @points_of_interests, status: :ok
  end

  # GET /points_of_interests/1
  # GET /points_of_interests/1.json
  def show
    render json: @points_of_interest, status: :ok
  end

  # POST /points_of_interests
  # POST /points_of_interests.json
  def create
    @points_of_interest = PointsOfInterest.new(points_of_interest_params)

    if @points_of_interest.save
      render json: @points_of_interest, status: :created, location: @points_of_interest
    else
      render json: @points_of_interest.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /points_of_interests/1
  # PATCH/PUT /points_of_interests/1.json
  def update
    if @points_of_interest.update(points_of_interest_params)
      render json: @points_of_interest, status: :ok
    else
      render json: @points_of_interest.errors, status: :unprocessable_entity
    end
  end

  # DELETE /points_of_interests/1
  # DELETE /points_of_interests/1.json
  def destroy
    @points_of_interest.destroy
    head :no_content # Indică succesul fără a returna niciun conținut
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_points_of_interest
      @points_of_interest = PointsOfInterest.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def points_of_interest_params
      params.require(:points_of_interest).permit(:name, :rating, :category, :city_id)
    end
end
