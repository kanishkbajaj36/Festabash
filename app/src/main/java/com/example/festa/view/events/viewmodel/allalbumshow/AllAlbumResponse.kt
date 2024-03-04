package com.example.festa.view.events.viewmodel.allalbumshow

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName
import java.io.Serializable

class AllAlbumResponse {
    @SerializedName("success")
    @Expose
    var success: Boolean? = null

    @SerializedName("message")
    @Expose
    var successMessage: String? = null

    @SerializedName("allAlbums")
    var albums: ArrayList<Albums> = ArrayList()

    inner class Albums : Serializable {
        @SerializedName("album_id")
        var album_id = ""

        @SerializedName("album_name")
        var album_name = ""

        @SerializedName("first_image")
        var first_image = ""
    }
}