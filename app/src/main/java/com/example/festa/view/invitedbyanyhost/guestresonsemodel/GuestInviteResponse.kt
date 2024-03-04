package com.example.festa.view.invitedbyanyhost.guestresonsemodel

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName

class GuestInviteResponse {
    @SerializedName("success")
    @Expose
    var success: Boolean? = null

    @SerializedName("responseMessage")
    @Expose
    var responseMessage: String? = null
}