module Api
  class ChatController < ApplicationController
    skip_before_action :verify_authenticity_token 

    def create
      prompt = params[:prompt] || params.dig(:chat, :prompt)

      response = HTTParty.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers: {
          "Authorization" => "Bearer #{ENV['GROQ_API_KEY']}",
          "Content-Type" => "application/json"
        },
        body: {
          model: "compound-beta",
          messages: [
            { role: "user", content: prompt }
          ]
        }.to_json
      )

      if response.success?
        content = response.parsed_response.dig("choices", 0, "message", "content")
        render json: { response: content }
      else
        render json: { error: response.parsed_response }, status: :bad_request
      end
    end
  end
end
