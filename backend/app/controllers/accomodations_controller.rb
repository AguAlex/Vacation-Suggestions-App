class AccomodationsController < ApplicationController
  before_action :set_accomodation, only: %i[show update destroy]

  # GET /accomodations
  # GET /accomodations.json
  def index
    @accomodations = Accomodation.all
    render json: @accomodations, status: :ok
  end

  # GET /accomodations/1
  # GET /accomodations/1.json
  def show
    render json: @accomodation, status: :ok
  end

  # POST /accomodations
  # POST /accomodations.json
  def create
    @accomodation = Accomodation.new(accomodation_params)

    if @accomodation.save
      render json: @accomodation, status: :created, location: @accomodation
    else
      render json: @accomodation.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /accomodations/1
  # PATCH/PUT /accomodations/1.json
  def update
    if @accomodation.update(accomodation_params)
      render json: @accomodation, status: :ok
    else
      render json: @accomodation.errors, status: :unprocessable_entity
    end
  end

  # DELETE /accomodations/1
  # DELETE /accomodations/1.json
  def destroy
    @accomodation.destroy
    head :no_content  # Indică succesul fără a returna niciun conținut
  end

  # GET /top_accomodations
  def top_accomodations
    top_accommodations = Accomodation.joins(city: :country)
                                    .select('accomodations.id, accomodations.name, accomodations.price, accomodations.rating, cities.name AS city_name, countries.name AS country_name, COUNT(likes.id) AS likes_count')
                                    .left_joins(:likes)
                                    .group('accomodations.id, cities.id, countries.id')
                                    .order('likes_count DESC')
                                    .limit(3)
  
    render json: top_accommodations
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_accomodation
      @accomodation = Accomodation.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def accomodation_params
      params.require(:accomodation).permit(:category, :name, :distance_to_city, :price, :rating, :city_id, :link, :imagine)
    end
    
end
