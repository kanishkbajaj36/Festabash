package com.example.festa.view.events.viewmodel.particularalbumimageslist

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName
import java.io.Serializable

class ParticularAlbumImagesResponse {
    @SerializedName("success")
    @Expose
    var success: Boolean? = null

    @SerializedName("message")
    @Expose
    var message: String? = null

    @SerializedName("album_name")
    @Expose
    var albumName: String? = null

    @SerializedName("album_id")
    @Expose
    var albumId: String? = null

    @SerializedName("image_entries")
    @Expose
    var imageEntries: ArrayList<ImageEntry>?  = ArrayList()

    @SerializedName("userId")
    @Expose
    var userId: String? = null

    inner class ImageEntry : Serializable {
        @SerializedName("image_path")
        @Expose
        var imagePath: String? = null

        @SerializedName("_id")
        @Expose
        var id: String? = null
    }
}