package com.example.festa.view.feedback.viewmodel

import com.google.gson.annotations.SerializedName

class FeedbackBody(
    @SerializedName("rating") var rating: String,
    @SerializedName("message") var message: String,
    @SerializedName("feedback_Type") var feedback_Type: String

)