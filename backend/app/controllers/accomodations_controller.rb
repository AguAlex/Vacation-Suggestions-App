class AccomodationsController < ApplicationController
  before_action :set_accomodation, only: %i[show update destroy]

  # GET /accomodations
  # GET /accomodations.json
  def index
    if params[:city_id].present?
      # Căutăm orașele care conțin numele în câmpul name
      acc = Accomodation.where(city_id: params[:city_id])
      else
      # Dacă nu se trimite parametru 'name', returnăm toate orașele
      acc = Accomodation.all
      end
  
    render json: acc # Returnează orașele ca JSON
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
