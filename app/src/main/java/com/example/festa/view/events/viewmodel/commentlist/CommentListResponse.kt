package com.example.festa.view.events.viewmodel.commentlist

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName
import java.io.Serializable

class CommentListResponse {
    @SerializedName("success")
    @Expose
    var success: Boolean? = null

    @SerializedName("message")
    @Expose
    var message: String? = null

    @SerializedName("all_comments")
    var all_comments: ArrayList<AllComments> = ArrayList()

    inner class AllComments : Serializable {
        @SerializedName("userName")
        var userName = ""

        @SerializedName("user_image")
        var user_image = ""

        @SerializedName("userId")
        var userId = ""

        @SerializedName("text_comment")
        var text_comment = ""

        @SerializedName("_id")
        var _id = ""
    }
}