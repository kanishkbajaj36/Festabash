package com.example.festa.view.notifications.notificationmodelview

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName
import java.io.Serializable

class NotificationResponse {
    @SerializedName("success")
    @Expose
    var success: Boolean? = null

    @SerializedName("message")
    @Expose
    var message: String? = null

    @SerializedName("Notification_count")
    @Expose
    var notificationCount: Int? = null

    @SerializedName("notifications")
    @Expose
    var notifications: List<Notification>? = null

    inner class Notification : Serializable {
        @SerializedName("notification_id")
        @Expose
        var notificationId: String? = null

        @SerializedName("userId")
        @Expose
        var userId: String? = null

        @SerializedName("message")
        @Expose
        var message: String? = null

        @SerializedName("title")
        @Expose
        var title: String? = null

        @SerializedName("event_image")
        @Expose
        var eventImage: String? = null

        @SerializedName("date")
        @Expose
        var date: String? = null

        @SerializedName("event_location")
        @Expose
        var eventLocation: String? = null

        @SerializedName("status")
        @Expose
        var status: Int? = null
    }

}