package com.example.festa.view.events.viewmodel.feedslikedislike

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName

class FeedLikeDislikeReponse {
    @SerializedName("success")
    @Expose
    var success: Boolean? = null

    @SerializedName("message")
    @Expose
    var message: String? = null

    @SerializedName("isLiked")
    @Expose
    var isLiked = 0
}