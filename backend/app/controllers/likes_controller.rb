class LikesController < ApplicationController
    before_action :set_accomodation
    before_action :set_user
  
    def create
      like = Like.find_or_create_by(user: @user, accomodation: @accomodation)
      render json: { liked: true }
    end
  
    def destroy
      like = Like.find_by(user: @user, accomodation: @accomodation)
      like.destroy if like
      render json: { liked: false }
    end
  
    def liked
      liked = Like.exists?(user: @user, accomodation: @accomodation)
      render json: { liked: liked }
    end
  
    private
  
    def set_accomodation
      @accomodation = Accomodation.find(params[:accomodation_id])
    end
  
    def set_user
      @user = User.find(params[:user_id])
    end
  end
  