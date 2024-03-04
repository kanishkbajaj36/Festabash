package com.example.festa.view.feedback.viewmodel

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName
import java.io.Serializable

class FeedbackResponse {
    @SerializedName("success")
    @Expose
    var success: Boolean? = null

    @SerializedName("message")
    @Expose
    var message: String? = null

    @SerializedName("feedback_details")
    @Expose
    var feedbackDetails: FeedbackDetails? = null

    inner class FeedbackDetails : Serializable
    {
        @SerializedName("userId")
        @Expose
        var userId: String? = null

        @SerializedName("userName")
        @Expose
        var userName: String? = null

        @SerializedName("rating")
        @Expose
        var rating: Double? = null

        @SerializedName("message")
        @Expose
        var message: String? = null

        @SerializedName("feedback_Type")
        @Expose
        var feedbackType: String? = null

        @SerializedName("_id")
        @Expose
        var id: String? = null

        @SerializedName("createdAt")
        @Expose
        var createdAt: String? = null

        @SerializedName("updatedAt")
        @Expose
        var updatedAt: String? = null

        @SerializedName("__v")
        @Expose
        var v: Int? = null

    }
}