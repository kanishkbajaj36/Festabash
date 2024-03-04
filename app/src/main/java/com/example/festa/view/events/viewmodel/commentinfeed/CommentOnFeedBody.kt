package com.example.festa.view.events.viewmodel.commentinfeed

import com.google.gson.annotations.SerializedName

data class CommentOnFeedBody(
    @SerializedName("comment") var comment: String
)
