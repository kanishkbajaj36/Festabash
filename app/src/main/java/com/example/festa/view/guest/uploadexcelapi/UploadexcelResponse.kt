package com.example.festa.view.guest.uploadexcelapi

import com.google.gson.annotations.Expose

import com.google.gson.annotations.SerializedName

class UploadexcelResponse {
    @SerializedName("success")
    @Expose
    var success: Boolean? = null

    @SerializedName("message")
    @Expose
    var message: String? = null
}