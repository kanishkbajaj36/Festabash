package com.example.festa.view.events.viewmodel.feedslist

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName
import java.io.Serializable

class FeedsListResponse {
    @SerializedName("success")
    @Expose
    var success: Boolean? = null

    @SerializedName("message")
    @Expose
    var message: String? = null

    @SerializedName("feeds")
    var feeds: ArrayList<Feeds> = ArrayList()

    inner class Feeds : Serializable {
        @SerializedName("feed_id")
        var feed_id = ""

        @SerializedName("eventId")
        var eventId = ""

        @SerializedName("userId")
        var userId = ""

        @SerializedName("userName")
        var userName = ""

        @SerializedName("user_profileImage")
        var user_profileImage = ""

        @SerializedName("feed_description")
        var feed_description = ""

        @SerializedName("feed_image")
        var feed_image = ""

        @SerializedName("feed_created_time")
        var feed_created_time = ""

        @SerializedName("feed_likes")
        var feed_likes = 0

        @SerializedName("feed_comments")
        var feed_comments = 0

        @SerializedName("feed_views")
        var feed_views = 0
    }
}