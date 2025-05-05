class CitiesController < ApplicationController
  before_action :set_city, only: %i[show update destroy]

  # GET /cities
  # GET /cities.json
  def index
    if params[:name].present?
    # Căutăm orașele care conțin numele în câmpul name
    cities = City.where('name LIKE ?', "%#{params[:name]}%")
    else
    # Dacă nu se trimite parametru 'name', returnăm toate orașele
    cities = City.all
    end

  render json: cities # Returnează orașele ca JSON
  end

  # GET /cities/1
  # GET /cities/1.json
  def show
    render json: @city, status: :ok
  end

  # POST /cities
  # POST /cities.json
  def create
    @city = City.new(city_params)

    if @city.save
      render json: @city, status: :created, location: @city
    else
      render json: @city.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /cities/1
  # PATCH/PUT /cities/1.json
  def update
    if @city.update(city_params)
      render json: @city, status: :ok
    else
      render json: @city.errors, status: :unprocessable_entity
    end
  end

  # DELETE /cities/1
  # DELETE /cities/1.json
  def destroy
    @city.destroy
    head :no_content  # Indică succesul fără a returna niciun conținut
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_city
      @city = City.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def city_params
      params.require(:city).permit(:name, :country_id)
    end
end
