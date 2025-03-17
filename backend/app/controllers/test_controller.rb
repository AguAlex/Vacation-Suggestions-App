class TestController < ApplicationController
    def index
      render json: { message: "Salut din Rails API! React, mă auzi?" }, status: :ok
    end
  end
  