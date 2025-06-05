class SessionsController < ApplicationController
  require 'google-id-token'

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

  # POST /sessions/google
  def google
    begin
      validator = GoogleIDToken::Validator.new
      payload = validator.check(params[:credential], ENV['GOOGLE_CLIENT_ID'])
      
      # Extract user information from the payload
      email = payload['email']
      name = payload['name']
      
      # Find or create user
      @user = User.find_by(email: email)
      
      if @user.nil?
        # Create a new user with a random password
        random_password = SecureRandom.hex(10)
        @user = User.create!(
          email: email,
          nume: name,
          password: random_password
        )
      end
      
      # Generate JWT token
      token = encode_jwt(@user)
      
      render json: { 
        token: token, 
        message: 'Google authentication successful',
        user: @user 
      }, status: :ok
      
    rescue GoogleIDToken::ValidationError => e
      render json: { message: 'Google authentication failed', error: e.message }, status: :unauthorized
    rescue => e
      render json: { message: 'Google authentication failed', error: e.message }, status: :unauthorized
    end
  end

  private

  # Metodă pentru a genera un token JWT
  def encode_jwt(user)
    payload = { user_id: user.id }
    JWT.encode(payload, Rails.application.secret_key_base)
  end
end
