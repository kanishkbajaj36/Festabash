package com.example.festa.view.guest.guestlistresponse

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName
import java.io.Serializable


class GuestListUserResponse {
    @SerializedName("success")
    @Expose
    var success: Boolean? = null

    @SerializedName("message")
    @Expose
    var message: String? = null

    @SerializedName("guests_list")
    @Expose
    var guestsList: List<Guests>? = null

    inner class Guests : Serializable
    {
        @SerializedName("Guest_Name")
        @Expose
        var guestName: String? = null

        @SerializedName("phone_no")
        @Expose
        var phoneNo: Long? = null

        @SerializedName("status")
        @Expose
        var status: Int? = null
    }
}