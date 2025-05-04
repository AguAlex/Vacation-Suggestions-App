class CountriesController < ApplicationController
  before_action :set_country, only: %i[show update destroy]

  # GET /countries
  # GET /countries.json
  def index
    @countries = Country.all
    render json: @countries, status: :ok
  end

  # GET /countries/1
  # GET /countries/1.json
  def show
    country = Country.includes(cities: :accomodations).find(params[:id])
    cities = country.cities
  
    accomodations = cities.flat_map do |city|
      city.accomodations.map do |acc|
        # Adaugă numărul de like-uri pentru fiecare acomodation
        acc_attributes = acc.attributes.merge(
          city_name: city.name,
          likes_count: acc.likes_count # numărul de like-uri
        )
      end
    end
  
    render json: {
      id: country.id,
      name: country.name,
      cities: cities.as_json(only: [:id, :name]),
      accomodations: accomodations
    }
  end

  # POST /countries
  # POST /countries.json
  def create
    @country = Country.new(country_params)

    if @country.save
      render json: @country, status: :created, location: @country
    else
      render json: @country.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /countries/1
  # PATCH/PUT /countries/1.json
  def update
    if @country.update(country_params)
      render json: @country, status: :ok
    else
      render json: @country.errors, status: :unprocessable_entity
    end
  end

  # DELETE /countries/1
  # DELETE /countries/1.json
  def destroy
    @country.destroy
    head :no_content  # Indică succesul fără a returna niciun conținut
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_country
      @country = Country.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def country_params
      params.require(:country).permit(:name)
    end
end
