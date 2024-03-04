package com.example.festa.view.invitedbyanyhost.guestresonsemodel

import com.google.gson.annotations.SerializedName

class GuestInviteResponseBody (
    @SerializedName("response") var response: String,
    @SerializedName("event_title") var event_title: String,
    @SerializedName("phone_no") var phone_no: String
)