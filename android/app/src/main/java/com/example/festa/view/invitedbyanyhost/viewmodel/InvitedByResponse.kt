package com.example.festa.view.invitedbyanyhost.viewmodel

import com.example.festa.view.createevents.viewmodel.getedit.GetEditResponse.EventData
import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName
import java.io.Serializable


class InvitedByResponse {

    @SerializedName("success")
    @Expose
    var success: Boolean? = null

    @SerializedName("message")
    @Expose
    var message: String? = null

    @SerializedName("event_data")
    @Expose
    var eventData: EventData? = null

    inner class EventData : Serializable
    {
        @SerializedName("userName")
        @Expose
        var userName: String? = null

        @SerializedName("title")
        @Expose
        var title: String? = null

        @SerializedName("description")
        @Expose
        var description: String? = null

        @SerializedName("event_type")
        @Expose
        var eventType: String? = null

        @SerializedName("images")
        @Expose
        var images: List<String>? = null

        @SerializedName("user_phone")
        @Expose
        var userPhone: Long? = null

        @SerializedName("venue_location")
        @Expose
        var venueLocation: String? = null

        @SerializedName("venue_Name")
        @Expose
        var venueName: String? = null

        @SerializedName("date")
        @Expose
        var date: String? = null

        @SerializedName("start_time")
        @Expose
        var startTime: String? = null

        @SerializedName("end_time")
        @Expose
        var endTime: String? = null

        @SerializedName("venue_Date_and_time")
        @Expose
        var venueDateAndTime: List<VenueDateAndTime>? = null
    }

    inner class VenueDateAndTime :Serializable
    {
        @SerializedName("sub_event_title")
        @Expose
        var subEventTitle: String? = null

        @SerializedName("venue_Name")
        @Expose
        var venueName: String? = null

        @SerializedName("venue_location")
        @Expose
        var venueLocation: String? = null

        @SerializedName("date")
        @Expose
        var date: String? = null

        @SerializedName("start_time")
        @Expose
        var startTime: String? = null

        @SerializedName("end_time")
        @Expose
        var endTime: String? = null

        @SerializedName("venue_status")
        @Expose
        var venueStatus: Int? = null

        @SerializedName("_id")
        @Expose
        var id: String? = null
    }
}