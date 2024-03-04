package com.example.festa.view.events.viewmodel.addimagealbum

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName

class AddImageInAlbumReponse {
    @SerializedName("success")
    @Expose
    var success: Boolean? = null

    @SerializedName("message")
    @Expose
    var message: String? = null

}