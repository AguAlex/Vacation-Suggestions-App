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
      render json: { message: 'User created successfully', user: @user }, status: :created
    else
      puts @user.errors.full_messages
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
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
  
    if @user&.authenticate(params[:parola]) # folosește 'parola' aici, pentru a se potrivi cu câmpul din DB
      render json: { message: 'Autentificare reușită', user: @user }, status: :ok
    else
      render json: { message: 'Email sau parolă greșită' }, status: :unauthorized
    end
  end
  

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def user_params
      params.require(:user).permit(:nume, :password, :email)
    end
end
