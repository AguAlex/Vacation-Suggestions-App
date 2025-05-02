class SessionsController < ApplicationController
  # POST /sessions
  def create
    # Cautam utilizatorul in functie de email
    @user = User.find_by(email: params[:email])

    if @user && @user.authenticate(params[:password])  # Verifică dacă parola este corectă
      # Dacă autentificarea este reușită, generăm un token JWT pentru utilizator
      token = encode_jwt(@user)
      render json: { token: token, message: 'Login successful', user: @user }, status: :ok
    else
      render json: { message: 'Invalid email or password' }, status: :unauthorized
    end
  end

  private

  # Metodă pentru a genera un token JWT
  def encode_jwt(user)
    payload = { user_id: user.id }
    JWT.encode(payload, Rails.application.secret_key_base)
  end
end
