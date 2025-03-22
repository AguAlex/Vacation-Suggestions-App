class UsersController < ApplicationController
  before_action :set_user, only: %i[show update destroy]

  # GET /users
  # GET /users.json
  def index
    @users = User.all
    render json: @users, status: :ok
  end

  # GET /users/1
  # GET /users/1.json
  def show
    render json: @user, status: :ok
  end

  # POST /users
  # POST /users.json
  def create
    @user = User.new(user_params)

    if @user.save
      render json: @user, status: :created, location: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
    if @user.update(user_params)
      render json: @user, status: :ok
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @user.destroy
    head :no_content # Indică succesul fără a returna niciun conținut
  end

  # POST /users/login
  def login
    @user = User.find_by(email: params[:email])

    if @user&.authenticate(params[:password])
      render json: { message: 'Autentificare reușită', user: @user }, status: :ok
    else
      render json: { message: 'Email sau parolă greșită' }, status: :unauthorized
    end
  end

  def signup
    @user = User.new(user_params)

    if @user.save
      render json: { message: 'Cont creat cu succes!', user: @user }, status: :created
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def user_params
      params.require(:user).permit(:nume, :parola, :email)
    end
end
